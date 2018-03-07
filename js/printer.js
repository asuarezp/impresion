'use strict';

angular.module('app')
.factory('Printer', ['$rootScope', '$compile', '$http', '$timeout', '$q', function ($rootScope, $compile, $http, $timeout, $q) {
    var printHtml = function (value) {
        	
        var deferred = $q.defer();
        var hiddenFrame = $('<iframe id="printFrame" style="display: none"></iframe>').appendTo('body')[0];

        $(hiddenFrame).on('load', function () {

            if (!hiddenFrame.contentDocument.execCommand('print', false, null)) {        
                hiddenFrame.contentWindow.focus();            
                hiddenFrame.contentWindow.print();   
                $timeout(function(){
                    $(hiddenFrame).remove();
                    deferred.resolve();
               }, 1000);                           
            }else {
                $(hiddenFrame).remove(); 
                deferred.resolve();
            }   
        });

        var htmlContent = "<!doctype html>"+
                    "<html>"+
                        '<body>' +
                            value +
                        '</body>'+
                    "</html>";
                    
        var doc = hiddenFrame.contentWindow.document.open("text/html", "replace");
        doc.write(htmlContent);
        deferred.resolve();
        doc.close();
        return deferred.promise;
    };
    
    var openNewWindow = function (html) {
        var newWindow = window.open("printest.html");
        newWindow.addEventListener('load', function(){ 
            $(newWindow.document.body).html(html);
        }, false);
    };
    
    var print = function (templateUrl, data) {
        $http.get(templateUrl).then(function(template){
            var printScope = angular.extend($rootScope.$new(), data);
            var element = $compile($('<div>' + template.data + '</div>'))(printScope);
            var waitForRenderAndPrint = function() {
                if(printScope.$$phase || $http.pendingRequests.length) {
                    $timeout(waitForRenderAndPrint);
                } else {
                    printHtml(element.html());
                    printScope.$destroy();
                }
            }
            waitForRenderAndPrint();   
        })
    };
    return {
        print: print
    }
}]);
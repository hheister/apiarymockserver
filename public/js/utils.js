/**
 * Utility class that puts some utility methods in the namespace horst.utils
 * To use the class you need to add a requirejs dependency to 'horstutils'.
 * This module does not return an object. It just defines functions in the horst.utils namespace.
 */
define(['knockout'], function(ko) {

// Use a self executing function to define the horst.utils namespace
    ( function() {

        function createNamespace(namespace) {
            var names = namespace.split('.');
            var obj = window;
            for (var i = 0; i < names.length; i++) {
                if (!obj[names[i]]) {
                    obj = obj[names[i]] = {};
                } else {
                    obj = obj[names[i]];
                }
            }
            return obj;
        }

        var utilsNS = createNamespace("horst.utils");

        utilsNS.capitalizeString = function(s) {
            var s1 = s.slice(0, 1).toUpperCase();
            return s1 + s.slice(1);
        };
    })();

});
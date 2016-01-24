define(['jquery', 'knockout', 'koTemplateEngine', 'koBindings', 'utils'],
function ($, ko, koTemplateEngine, koBindings) {

    var vm = (function () {
        "use strict";
        var self = this;

        var serverUrl = window.location.href;
        var labelText = ko.observable(serverUrl);
        var API_MANAGER_ORIGIN = "http://slc01hhz.us.oracle.com:7201";

        var activate = function () {
            ko.applyBindings(vm);

            // Setup listener for message from Oracle API Manager
            window.addEventListener("message", handleOracleAPIManagerMessage, false);
        };

        function handleOracleAPIManagerMessage(e) {
            if (e.origin == API_MANAGER_ORIGIN) {
                console.log('!! Apiary GOT APIManager message  data:' + e.data);
            }
        }

        var sendData = function() {
            var input = $("#file-input")[0].files;
            alert('sendData: data=' + input);
        };

        var doParentCall = function() {
            var parent = window.parent;
            if (window.parent.iframetest) {
                console.log('iframetest is seen in the parent window!');
                window.parent.iframetest();
            } else {
                console.log('iframetest is NOT seen in the parent window!');
            }
        };

        var postMessageToAPIManager = function() {
            var parent = window.parent;
            var queryString = window.location.search;
            queryString = queryString.substring(1);
            var params = parseQueryString(queryString);
            var origin = params['origin'];

            var data = {
                name: "horst",
                company: "oracle",
                type: "raml"
            };
            parent.postMessage(data, origin);
        };

        var parseQueryString = function( queryString ) {
            var params = {}, queries, temp, i, l;

            // Split into key/value pairs
            queries = queryString.split("&");

            // Convert the array of strings into an object
            for ( i = 0, l = queries.length; i < l; i++ ) {
                temp = queries[i].split('=');
                params[temp[0]] = temp[1];
            }

            return params;
        };

        return {
            labelText: labelText,
            activate: activate,
            sendData: sendData,
            doParentCall: doParentCall,
            postMessageToAPIManager: postMessageToAPIManager
        };
    })();

    $(document).ajaxError(function (event, response) {
        console.error(response);
        alert("Error in the communication. Check the console!");
    });

    // ko External Template Settings
    infuser.defaults.templateSuffix = ".html";
    infuser.defaults.templateUrl = "http://localhost:8080/templates";

//alert('infuser.defaults.templateUrl=' + infuser.defaults.templateUrl);
    vm.activate();

    return vm;

});
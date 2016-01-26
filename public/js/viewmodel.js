define(['jquery', 'knockout', 'koTemplateEngine', 'koBindings', 'utils'],
function ($, ko, koTemplateEngine, koBindings) {

    var vm = (function () {
        "use strict";
        var self = this;

        var serverUrl = window.location.href;
        var labelText = ko.observable(serverUrl);
        var API_MANAGER_ORIGIN = "http://slc01hhz.us.oracle.com:7201";
        var markdown = ko.observable();
        var pdf = ko.observable();
        var downloadingPDF = ko.observable(false);

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

        function sendDataToAPIManager(data) {
            var parent = window.parent;
            var queryString = window.location.search;
            queryString = queryString.substring(1);
            var params = parseQueryString(queryString);
            var origin = params['origin'];
            if (origin) {
                parent.postMessage(data, origin);
            } else {
                alert('No origin to send message to!');
            }
        }

        var postMessageToAPIManager = function() {
            var data = {
                type: "text",
                data: $("#message-input")[0].value
            };
            sendDataToAPIManager(data);
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

        var downloadMarkdown = function() {
            $.ajax({
                url: "./markdown/README.md",
                type: "GET",
                dataType:'text',
                success: function (result) {
                    console.log(result);
                    markdown(result);
                },
                error: function(jhr, exception) {
                    console.log(exception);
                }
            });
        };

        var hasMarkdown = ko.computed(function () {
            return markdown() !== undefined && markdown() != null;
        });

        var sendMarkDownToAPIManager = function() {
            var data = {
                type: 'markdown',
                data: markdown()
            };
            sendDataToAPIManager(data);
        };

        var downloadImage = function() {
            var oReq = new XMLHttpRequest();
            oReq.open("GET", "/images/cloudworld.jpg", true);
            oReq.responseType = "blob";

            oReq.onload = function(oEvent) {
                var blob = oReq.response;
                // ...
            };

            oReq.send();
        };

        var downloadPDF = function() {
            //downloadImage();

            var oReq = new XMLHttpRequest();
            oReq.open("GET", "./pdf/test.pdf", true);
            oReq.responseType = "blob";
            downloadingPDF(true);
            oReq.onload = function(oEvent) {
                var blob = oReq.response;
                pdf(blob);
                downloadingPDF(false);
                var href = window.URL.createObjectURL(blob);
                var linkHTML = "<a target='_blank' href='" + href +  "'>Downloaded PDF</a>";
                $('#pdf-link-container').append(linkHTML);
            };

            oReq.send();

            /*
            $.ajax({
                url: './pdf/test.pdf',
                success: function (data) {
                    pdf(data);
                    var blob = new Blob([data]);

                    var href = window.URL.createObjectURL(blob);
                    var linkHTML = "<a target='_blank' href='" + href +  "'>Downloaded PDF</a>";
                    $('#pdf-link-container').append(linkHTML);
                },
                error: function (jhr, exception) {
                    console.log(exception);
                }
            });*/
            /*
            $.ajax({
                url: "./images/cloudworld.jpg",
                type: "GET",
                processData: false,
                success: function (result) {
                    console.log(result);
                    image(result);
                },
                error: function(jhr, exception) {
                    console.log(exception);
                }
            });*/
        };

        var hasPDF = ko.computed(function () {
            return pdf() !== undefined && pdf() != null;
        });

        var sendPDFtoAPIManager = function() {
            var data = {
                type: 'pdf',
                data: pdf()
            };
            sendDataToAPIManager(data);
        };

        return {
            downloadingPDF: downloadingPDF,
            sendPDFtoAPIManager: sendPDFtoAPIManager,
            hasPDF: hasPDF,
            downloadPDF: downloadPDF,
            sendMarkDownToAPIManager: sendMarkDownToAPIManager,
            hasMarkdown: hasMarkdown,
            downloadMarkdown: downloadMarkdown,
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
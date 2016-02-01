// Workaround for Knockout not initializing the global "ko" variable when it detects Require.js
define('knockout.global', ['knockout'], function(kno) {
    window.ko = kno; // Initialize a global 'ko' variable
    return kno;
});

require.config({

    // Sets the js folder as the base directory for all future relative paths
    baseUrl: "./js",

    // 3rd party script alias names
    paths: {
        "jquery": "vendors/jquery.min",
        "jqueryUI": "vendors/jquery-ui/jquery-ui",
        "knockout": "vendors/knockout.debug",
        "koTemplateEngine":"vendors/koExternalTemplateEngine_all.min",
        "viewmodel": "viewmodel",
        "utils": "utils"
    },

    // Sets the configuration for your scripts that are not AMD compatible
    shim: {
        "bootstrap": ["jquery"],
        "bootstrap-modal": ["jquery"],
        "koTemplateEngine": ["knockout"],
        "jqueryUI": {
            export:"$" ,
            deps: ['jquery']
        }
    },

    map: {
        '*': {'knockout': 'knockout.global'}, // All modules referencing 'knockout' will be loading 'knockout.global'
        'knockout.global': {'knockout': 'knockout'} // 'knockout.global' itself will be referencing the original 'knockout'
    }

});

require(['app'], function(app) {
       // require the app module to kick off the application
       app.initialize();
    }
);

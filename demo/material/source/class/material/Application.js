/* ************************************************************************

   Copyright:

   License:

   Authors:

 ************************************************************************ */

/**
 * This is the main application class of your custom application "material"
 *
 * @asset(material/*)
 */
qx.Class.define("material.Application",
        {
    extend : qx.application.Standalone,



    /*
     *****************************************************************************
     MEMBERS
     *****************************************************************************
     */

    members :
    {
        /**
         * Main interface class with Three.js library. Inherite from qx.Widget and handle Three Gl canvas
         */
        GLWidget: null,
        
        /**
         * This method contains the initial application code and gets called 
         * during startup of the application
         * 
         * @lint ignoreDeprecated(alert)
         */
        main : function()
        {
            // Call super class
            this.base(arguments);

            // Enable logging in debug variant
            if (qx.core.Environment.get("qx.debug"))
            {
                // support native logging capabilities, e.g. Firebug for Firefox
                qx.log.appender.Native;
                // support additional cross-browser console. Press F7 to toggle visibility
                qx.log.appender.Console;
            }

            /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
             */

            // Document is the application root
            var doc = this.getRoot();
            
            // List of plugins to load
            var plugins = ['controls/TrackballControls'];
            
            // Create Gl Canvas
            this.GLWidget = new qxthree.GLWidget(plugins);
            
            // Post process when scene is init
            this.GLWidget.addListener("sceneCreated", this.scenePostProcess, this);

            // Create qx window
            this.initWindow();
        },

        scenePostProcess: function()
        {
            // Set a default mode of interactor
            this.GLWidget.addController("TrackballControls");
        },
        
        initWindow: function()
        {
            // Create a container to have a panel on the left and GLWidget on the right
//            var container = new qx.ui.container.Composite(new qx.ui.layout.HBox(5)).set({
//                decorator: "main",
//                width : 650,
//                height : 500,
//                backgroundColor: "black",
//                allowGrowX: true,
//                allowGrowY: true
//              });
//            
//            // Add the different widgets to the container
//            container.add(this.createPanel(), { flex : 1 });
//            container.add(this.GLWidget, { flex : 2 });

            // Create the main window to encapsulate this container
            var win = new qx.ui.window.Window('Three 3D Cubes interactions').set(
                    {
                        backgroundColor: "yellow",
                        width : 650,
                        height : 500,
                        allowGrowX: true,
                        allowGrowY: true
                    });
            win.setLayout(new qx.ui.layout.Grow());
            win.addListener('appear', function() {
                win.center();
            });
            win.add(this.GLWidget);
            win.open();        
        }
    }
});

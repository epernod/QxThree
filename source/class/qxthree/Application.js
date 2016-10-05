/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "qxThree"
 *
 */
qx.Class.define("qxthree.Application",
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

      var plugins = ['controls/TrackballControls'];
      //var plugins = ['TrackballControls'];
      
      // Create Gl Canvas
      var glRenderer = new qxthree.GLRenderer(plugins);
      
      var win = new qx.ui.window.Window('Three 3D Cube example').set(
              {
                  backgroundColor: "red",
                  width : 500,
                  height : 500
              });
      win.setLayout(new qx.ui.layout.Grow());
      win.addListener('appear', function() {
          win.center()
      });
      win.add(glRenderer);
      win.open();
    }

  }
});

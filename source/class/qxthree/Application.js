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
    extend: qx.application.Inline,


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

      this.glRenderer = new qxthree.GLRenderer();
     // win.add(glRenderer.getRenderer());
          
      this.glRenderer.testMethod();

      this.glRenderer.addListener("sceneCreated", this.create3DScene, this);
      
    },

    create3DScene : function(){
        this.debug("create3DScene");
        
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
        //var test1 = new qx.ui.layout.HBox(10);
        //test1.add(this.glRenderer.getRenderer());
        win.add(this.glRenderer);
        win.open();
        var test = document.body;
        
        var chk = qx.dom.Element.create("input", {
            type : "checkbox",
            checked : true,
            id : "chk"
          });

        document.body.appendChild(chk);
        var toto = this.glRenderer.getRenderer();
        chk.appendChild(toto);
        document.body.appendChild(this.glRenderer.getRenderer());
        //win.add(chk);
        
//        var test = document.getElementById("qooxdooDiv");
//        if(test)
//            test.appendChild(this.glRenderer.getRenderer());
// 
//        if(chk)
//                chk.appenchild(this.glRenderer.getRenderer());

    }
  }
});

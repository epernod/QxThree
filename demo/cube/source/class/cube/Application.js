/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "cube"
 *
 */
qx.Class.define("cube.Application",
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

          // Create GL Widget that encapsulate Three.js canvas 
          this.GLWidget = new qxthree.GLWidget();

          // Create cube and add it to the 3D scene (will be init after scene)
          var glCube = new qxthree.GLMeshModel("test1", function() {
              this._geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
              var texture = new THREE.TextureLoader().load( 'resource/crate.gif' );
              this._material = new THREE.MeshBasicMaterial( { map: texture } );
              return new THREE.Mesh( this._geometry, this._material );
          }, null, null, null, function() {
              this._threeModel.rotation.x += 0.005;
              this._threeModel.rotation.y += 0.01;
          });
          this.GLWidget.addGLModel(glCube);

          this.GLWidget.addListener("scriptLoaded", this.scenePostProcess, this);



          // Create qx window
          var win = new qx.ui.window.Window('Three 3D Cube example').set(
                  {
                      width : 500,
                      height : 500
                  });
          win.setLayout(new qx.ui.layout.Grow());
          win.addListener('appear', function() {
              win.center()
          });
          win.add(this.GLWidget);
          win.open();      
      },

      scenePostProcess: function()
      {
          this.debug("Scene has been created");
          this.GLWidget.animate(true);
      }
  }
});

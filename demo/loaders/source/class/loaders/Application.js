/* ************************************************************************

   Copyright:

   License:

   Authors:

 ************************************************************************ */

/**
 * This is the main application class of your custom application "loaders"
 *
 */
qx.Class.define("loaders.Application",
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
            var plugins = ['loaders/OBJLoader', 'loaders/MTLLoader', 'controls/TrackballControls'];

            // Create Gl Canvas
            this.GLWidget = new qxthree.GLWidget(plugins);

            // Create cube and add it to the 3D scene (will be init after scene)
            this.GLWidget.addListener("scriptLoaded", this.initMeshes, this);

            this.GLWidget.addListener("sceneCreated", this.scenePostProcess, this);

            // Create qx window
            var win = new qx.ui.window.Window('Three Obj Mesh loading example').set(
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
            //this.GLWidget.animate(true);  
            
            // Set a default mode of interactor
            this.GLWidget.addController("TrackballControls");
            
            // start animation
            this.GLWidget.animate(true);
        },
        
        initMeshes: function()
        {
            // Add ambient Light
            var GLAmbientLight = new qxthree.BaseGLModel("ambientLight", function(){
                var ambient = new THREE.AmbientLight( 0x101030 );
                return ambient;
            }, null, null);
            this.GLWidget.addGLModel(GLAmbientLight);

            // Add directional Light
            var GLDirLight = new qxthree.BaseGLModel("directionLight", function(){
                var directionalLight = new THREE.DirectionalLight( 0xffeedd );
                directionalLight.position.set( 0, 0, 1 );
                return directionalLight;
            }, null, null);
            this.GLWidget.addGLModel(GLDirLight);

            // Add simple obj mesh
            this.clock = new THREE.Clock();
            this.mesh = new qxthree.GLMeshLoader("man_simple", "resource/mesh/", "male02.obj",
                    null, null, null, function(){
                this.setPosition( 100.0, 0.0, 0.0 );
            },
            function(){
                var delta = this.clock.getElapsedTime()*0.5;
                this.mesh.setRotation( 0.0, Math.PI*delta, 0.0 );
            }.bind(this));
            this.GLWidget.addGLModel(this.mesh);
            
            
            // Add a second obj mesh with mtl texture.
            this.mesh2 = new qxthree.GLMeshLoader("man_textured", "resource/mesh/", "male02.obj",
                    null, null, null, function(){
                this.mesh2.setPosition( -100.0, 0.0, 0.0 );
            }.bind(this),
            function(){
                var delta = this.clock.getElapsedTime()*0.5;
                this.mesh2.setRotation( 0.0, Math.PI*delta, 0.0 );
            }.bind(this));
            
            var mtlLoader = new qxthree.GLMeshLoader("man_mtl", "resource/mesh/", "male02.mtl",
                    function( materials ) {
                materials.preload();
                this.mesh2.setMaterials(materials);
                this.GLWidget.addGLModel(this.mesh2);
            }.bind(this));
            this.GLWidget.addGLModel(mtlLoader);
        }
        
    }
});

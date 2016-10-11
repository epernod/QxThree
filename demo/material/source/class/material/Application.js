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
        
        floorMat: null,
        cubeMat: null,
        ballMat: null,
        
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
            var plugins = ['controls/OrbitControls'];
            
            // Create Gl Canvas
            this.GLWidget = new qxthree.GLWidget(plugins);

            // Create cube and add it to the 3D scene (will be init after scene)
            this.GLWidget.addListener("scriptLoaded", this.initMeshes, this);
            
            // Post process when scene is init
            this.GLWidget.addListener("sceneCreated", this.scenePostProcess, this);

            // Create qx window
            this.initWindow();
        },

        scenePostProcess: function()
        {
            // Set a default mode of interactor
            this.GLWidget.addController("OrbitControls");
            
            this.GLWidget.showGrid();
            
            // update camera position
            var camera = this.GLWidget.getCamera();
            camera.position.x = -4;
            camera.position.z = 4;
            camera.position.y = 2;
        },
        
        initMeshes: function()
        {  
            var textureLoader = new THREE.TextureLoader();
            
            // Create floor mat
            this.floorMat = new THREE.MeshStandardMaterial( {
                roughness: 0.8,
                color: 0xffffff,
                metalness: 0.2,
                bumpScale: 0.0005
            });
            textureLoader.load( "resource/textures/hardwood2_diffuse.jpg", function( map ) {
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = 4;
                map.repeat.set( 10, 24 );
                this.floorMat.map = map;
                this.floorMat.needsUpdate = true;
            }.bind(this));
            textureLoader.load( "resource/textures/hardwood2_bump.jpg", function( map ) {
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = 4;
                map.repeat.set( 10, 24 );
                this.floorMat.bumpMap = map;
                this.floorMat.needsUpdate = true;
            }.bind(this) );
            textureLoader.load( "resource/textures/hardwood2_roughness.jpg", function( map ) {
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = 4;
                map.repeat.set( 10, 24 );
                this.floorMat.roughnessMap = map;
                this.floorMat.needsUpdate = true;
            }.bind(this) );
                        
            var floorGeometry = new THREE.PlaneBufferGeometry( 20, 20 );                       
            var floorMesh = new qxthree.GLModel("floor", null, floorGeometry, this.floorMat, 
                    function(){
                this.__threeMesh.receiveShadow = true;
                this.__threeMesh.rotation.x = -Math.PI / 2.0;
            });                       
            this.GLWidget.addGLModel(floorMesh);
            
            
            // create cube mat
            this.cubeMat = new THREE.MeshStandardMaterial( {
                roughness: 0.7,
                color: 0xffffff,
                bumpScale: 0.002,
                metalness: 0.2
            });
            textureLoader.load( "resource/textures/brick_diffuse.jpg", function( map ) {
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = 4;
                map.repeat.set( 1, 1 );
                this.cubeMat.map = map;
                this.cubeMat.needsUpdate = true;
            }.bind(this) );
            textureLoader.load( "resource/textures/brick_bump.jpg", function( map ) {
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = 4;
                map.repeat.set( 1, 1 );
                this.cubeMat.bumpMap = map;
                this.cubeMat.needsUpdate = true;
            }.bind(this) );

            var boxGeometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
            var boxMesh = new qxthree.GLModel("box1", null, boxGeometry, this.cubeMat, 
                    function(){
                this.__threeMesh.position.set( -0.5, 0.25, -1 );
                this.__threeMesh.castShadow = true;
            });                       
            this.GLWidget.addGLModel(boxMesh);
            
            
            // create world ball mat
            this.ballMat = new THREE.MeshStandardMaterial( {
                color: 0xffffff,
                roughness: 0.5,
                metalness: 1.0
            });
            textureLoader.load( "resource/textures/planets/earth_atmos_2048.jpg", function( map ) {
                map.anisotropy = 4;
                this.ballMat.map = map;
                this.ballMat.needsUpdate = true;
            }.bind(this) );
            textureLoader.load( "resource/textures/planets/earth_specular_2048.jpg", function( map ) {
                map.anisotropy = 4;
                this.ballMat.metalnessMap = map;
                this.ballMat.needsUpdate = true;
            }.bind(this) );
            
            var ballGeometry = new THREE.SphereGeometry( 0.5, 32, 32 );
            var ballMesh = new qxthree.GLModel("planet", null, ballGeometry, this.ballMat, 
                    function(){
                this.__threeMesh.position.set( 1, 0.5, 1 );
                this.__threeMesh.rotation.y = Math.PI;
                this.__threeMesh.castShadow = true;
            });                       
            this.GLWidget.addGLModel(ballMesh);            
            
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

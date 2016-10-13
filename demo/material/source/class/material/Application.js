/* ************************************************************************

   Copyright:

   License:

   Authors:

 ************************************************************************ */

/**
 * This is the main application class of your custom application "material"
 *
 * @asset(textures/hardwood2_diffuse.jpg)
 * @asset(textures/hardwood2_bump.jpg)
 * @asset(textures/hardwood2_roughness.jpg)
 * @asset(textures/brick_diffuse.jpg)
 * @asset(textures/brick_bump.jpg)
 * @asset(textures/planets/earth_atmos_2048.jpg)
 * @asset(textures/planets/earth_specular_2048.jpg)
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
        
        // material objects, need member for callbacks methods
        floorMat: null,
        cubeMat: null,
        ballMat: null,
        bulbMat: null,
        
        // TODO set params choices like in Three example
        exposure: 0.68,
        bulbLuminousPowers: 400,
        hemiLuminousIrradiances: 0.0001,
        
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
            
            //this.GLWidget.showGrid();
            
            // update camera position
            var camera = this.GLWidget.getCamera();
            camera.position.x = -4;
            camera.position.z = 4;
            camera.position.y = 2;
            
            // update renderer
            var renderer = this.GLWidget.getRenderer();
            renderer.physicallyCorrectLights = true;
            renderer.gammaInput = true;
            renderer.gammaOutput = true;
            renderer.shadowMap.enabled = true;
            renderer.toneMapping = THREE.ReinhardToneMapping;
            renderer.toneMappingExposure = Math.pow( this.exposure, 5.0 );
          
            // start animation
            this.GLWidget.animate(true);
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
            var floorMesh = new qxthree.GLMeshModel("floor", null, floorGeometry, this.floorMat, 
                    function(){
                this._threeModel.receiveShadow = true;
                this._threeModel.rotation.x = -Math.PI / 2.0;
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

            // Add cubes            
            var boxGeometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
            var boxMesh1 = new qxthree.GLMeshModel("box1", null, boxGeometry, this.cubeMat, 
                    function(){
                this._threeModel.position.set( -0.5, 0.25, -1 );
                this._threeModel.castShadow = true;
            });                       
            this.GLWidget.addGLModel(boxMesh1);
            
            var boxMesh2 = new qxthree.GLMeshModel("box2", null, boxGeometry, this.cubeMat, 
                    function(){
                this._threeModel.position.set( 0, 0.25, -5 );
                this._threeModel.castShadow = true;
            });                       
            this.GLWidget.addGLModel(boxMesh2);
            
            var boxMesh3 = new qxthree.GLMeshModel("box3", null, boxGeometry, this.cubeMat, 
                    function(){
                this._threeModel.position.set( 7, 0.25, 0 );
                this._threeModel.castShadow = true;
            });                       
            this.GLWidget.addGLModel(boxMesh3);
            
            
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
            var ballMesh = new qxthree.GLMeshModel("planet", null, ballGeometry, this.ballMat, 
                    function(){
                this._threeModel.position.set( 1, 0.5, 1 );
                this._threeModel.rotation.y = Math.PI;
                this._threeModel.castShadow = true;
            });                       
            this.GLWidget.addGLModel(ballMesh);            
           
            
            // create buld light
            this.bulbGeometry = new THREE.SphereGeometry( 0.02, 16, 8 );
            this.bulbMat = new THREE.MeshStandardMaterial( {
                emissive: 0xffffee,
                emissiveIntensity: 1,
                color: 0x000000
            });
            
            var GLBulbLight = new qxthree.GLModel("bulbLight", function(){
                var bulbLight = new THREE.PointLight( 0xffee88, 1, 100, 2 );
                bulbLight.add( new THREE.Mesh( this.bulbGeometry, this.bulbMat ) );
                bulbLight.position.set( 0, 2, 0 );
                bulbLight.castShadow = true;
                bulbLight.power = this.bulbLuminousPowers;
                return bulbLight;
            }.bind(this), null, function(){
                var time = Date.now() * 0.0005;
                this._threeModel.position.y = Math.cos( time ) * 0.75 + 1.25;
            });
            this.GLWidget.addGLModel(GLBulbLight);
            
            
            // add hemisphere light
            var GLHemiLight = new qxthree.GLModel("EmiLight", function(){
                var hemiLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 0.02 );
                hemiLight.intensity = this.hemiLuminousIrradiances;
                return hemiLight;
            }.bind(this), null, null);
            this.GLWidget.addGLModel(GLHemiLight);
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
                win.maxi
            });
            win.add(this.GLWidget);
            win.open();        
        }
    }
});

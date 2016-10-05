/* ************************************************************************

   Copyright:
     

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Erik Pernod (epernod)

************************************************************************ */

/**
 * 
 */
qx.Class.define("qxthree.GLRenderer", {
    extend : qx.ui.core.Widget,
    include: [qxthree.MixinGLRenderer],

    construct : function(plugins)
    {
        this.base(arguments);

        // Three.js scripts need to be loaded first. This will fired event scriptLoaded 
        this.__setup(plugins);
        
        // Method to init the scene as soon as Three.js has been loaded
        this.addListener("scriptLoaded", this.__initScene, this);
        
        // Others listeners
//        this.addListener("track", this.__onTrack, this);
        
        this.addListener("resize", this.onResize, this);
    },

    events : {
        sceneCreated: 'qx.event.type.Event'
    },

    members : {
        
        __canvasHeight: 400,
        __canvasWidth: 400,
        
        __camera: null,
        __scene: null,
        __renderer: null,
        __mesh: null,
        __logEvents: false,

        
        __initScene: function()
        {
            if (qx.core.Environment.get("qx.debug"))
                this.debug("GLRenderer::__initScene");
            
            var el = this.getContentElement().getDomElement();
            if (!el){
                this.debug("Error: qxthree.GLRenderer: no DomElement found.")
                return false;
            }
                    
            this.__canvasHeight = this.getBounds().height;
            this.__canvasWidth = this.getBounds().width;

            this.__camera = new THREE.PerspectiveCamera( 70, this.__canvasWidth / this.__canvasHeight, 1, 1000 );
            this.__camera.position.z = 400;
            
            this.controls = new THREE.TrackballControls( this.__camera );
            this.controls.rotateSpeed = 1.0;
            this.controls.zoomSpeed = 1.2;
            this.controls.panSpeed = 0.8;
            this.controls.noZoom = false;
            this.controls.noPan = false;
            this.controls.staticMoving = true;
            this.controls.dynamicDampingFactor = 0.3;
            
            this.__scene = new THREE.Scene();
            
            var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
            
            var texture = new THREE.TextureLoader().load( 'resource/crate.gif' );
            
            //var material = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } );
            var material = new THREE.MeshBasicMaterial( { map: texture } );
            
            this.__mesh = new THREE.Mesh( geometry, material );
            this.__scene.add( this.__mesh );
            
            this.__renderer = new THREE.WebGLRenderer();
            this.__renderer.setPixelRatio( 1 );
            
            this.__renderer.setSize( this.__canvasWidth, this.__canvasHeight );
            
            el.appendChild( this.__renderer.domElement );
            
            this.fireDataEvent('sceneCreated');
            this.animate();
        },
        
        getRenderer: function(){
            return this.__renderer.domElement;
        },
        
        onResize: function()
        {   
            this.__canvasHeight = this.getBounds().height;
            this.__canvasWidth = this.getBounds().width;
            
            if(!this.__renderer)
                return;           
                       
            this.__camera.aspect = this.__canvasWidth / this.__canvasHeight;
            this.__camera.updateProjectionMatrix();
            
            this.__renderer.setSize( this.__canvasWidth, this.__canvasHeight );

            this.updateGL();
        },
               
//        __onTrack: function(trackEvent){
//            if (qx.core.Environment.get("qx.debug") && this.__logEvents){
//                this.debug("Event: webGLController::__onTrack");
//            }
//            this.__mesh.rotation.x += 0.005;
//            this.__mesh.rotation.y += 0.01;
//
//            this.updateGL();
//            
//        },
        
        animate: function()
        {
//          this.__mesh.rotation.x += 0.005;
//          this.__mesh.rotation.y += 0.01;

          this.updateGL();

          requestAnimationFrame( this.animate.bind(this) );                      
        },
        
        updateGL: function()
        {
            if(!this.__renderer)
                return;
            
            this.controls.update();
            
            this.__renderer.render( this.__scene, this.__camera );
        }
    }
});


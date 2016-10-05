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
qx.Class.define("qxthree.GLWidget", {
    extend : qx.ui.core.Widget,
    include: [qxthree.MixinGLRenderer],

    construct : function(plugins)
    {
        this.base(arguments);

        // Init empty list of 3D mesh object of the scene
        this.__GLModels = new qx.data.Array();
        
        // Three.js scripts need to be loaded first. This will fired event scriptLoaded 
        this.__setup(plugins);
        
        // Method to init the scene as soon as Three.js has been loaded
        this.addListener("scriptLoaded", this._initScene, this);
        
        // Others listeners
//        this.addListener("track", this.__onTrack, this);
        
        this.addListener("resize", this.onResize, this);
        
        
    },

    events : {
        sceneCreated: 'qx.event.type.Event'
    },

    members : {
        /** members */
        __canvasHeight: 400,
        __canvasWidth: 400,
        
        __logEvents: false,

        /** Three.js camera object */
        __threeCamera: null,
        /** Three.js scene object */
        __threeScene: null,
        /** Three.js renderer object */
        __threeRenderer: null,
        /** Three.js controller object */
        __threeController: null,
        
        __GLModels: null,
        
        /**
         * @return {Integer} of the canvas height.
         */
        canvasHeight : function() {return this.__canvasHeight;},
        
        /**
         * @return {Integer} of the canvas width.
         */
        canvasWidth : function() {return this.__canvasWidth;},
        
        
        /**
         * Internal Main method to init Three.js empty scene with default objects. 
         * Called when @see scriptLoaded event is fired.
         * @return {Boolean} false if error is encountered.
         */
        _initScene: function()
        {
            if (qx.core.Environment.get("qx.debug"))
                this.debug("GLWidget::_initScene");
            
            // Get the current DomElement
            var el = this.getContentElement().getDomElement();
            if (!el){
                this.debug("Error: qxthree.GLWidget: no DomElement found.")
                return false;
            }
            
            // Init Three canvas with current widget size
            this.__canvasHeight = this.getBounds().height;
            this.__canvasWidth = this.getBounds().width;

            // Init the Three.PerspectiveCamera
            this.__threeCamera = new THREE.PerspectiveCamera( 70, this.__canvasWidth / this.__canvasHeight, 0.1, 1000 );
            // Add default position of the camera
            this.__threeCamera.position.z = 400;
            
            // Init empty Three scene
            this.__threeScene = new THREE.Scene();
            
            // Init the webgl renderer
            this.__threeRenderer = new THREE.WebGLRenderer();
            this.__threeRenderer.setPixelRatio( 1 );
            this.__threeRenderer.setSize( this.__canvasWidth, this.__canvasHeight );
            
            // Init current list of glModels
            for (var i=0; i<this.__GLModels.length; i++)
            {   
                var model = this.__GLModels.getItem(i);
                if (!model.isInit())
                    model.initGL();

                this._addThreeMesh(model);
            }
                        
            // Add webgl canvas to the current widget
            el.appendChild( this.__threeRenderer.domElement );
            
            this.fireDataEvent('sceneCreated');
            
            // Start animation loop
            
     
//            this.__threeController = new THREE.TrackballControls( this.__threeCamera );
//            this.__threeController.rotateSpeed = 1.0;
//            this.__threeController.zoomSpeed = 1.2;
//            this.__threeController.panSpeed = 0.8;
//            this.__threeController.noZoom = false;
//            this.__threeController.noPan = false;
//            this.__threeController.staticMoving = true;
//            this.__threeController.dynamicDampingFactor = 0.3;
            
           // this.test(); 
            
            //var material = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } );
                      
        },               

        
        /**
         * Method to add a @param model {qxthree.GLModel}. 
         * This model will be added to @see __GLModels
         * If scene is already runnin, model will be init and mesh will be added to the scene
         */
        addGLModel: function(model)
        {
            if (this.__GLModels.contains(model))
                this.debug("Error: GLModel already in the scene: " + model.id());
            else 
            {      
                this.__GLModels.push(model);
                if (this.__threeScene)
                {
                    this.debug("Added in method");
                    if (!model.isInit())
                        model.initGL();
                    
                    this._addThreeMesh(model);                    
                    this.updateGL();
                }
            }
            this._animate();
        },
        
        
        /**
         * Internal Method to add a Three mesh from a @see qxthree.GLModel into the Three scene.
         * Will set @see qxthree.GLModel.__isRegistered to {true}
         */
        _addThreeMesh: function(model)
        {
            if (!model.isRegistered()){
                this.__threeScene.add( model.threeMesh() );
                model.setRegistered(true);
            }
        },
        
        
        /**
         * Method to resize the webGl Canvas following GLWidget change of size.
         */
        onResize: function()
        {   
            this.__canvasHeight = this.getBounds().height;
            this.__canvasWidth = this.getBounds().width;
            
            if(!this.__threeRenderer || !this.__threeCamera)
                return;           
                       
            this.__threeCamera.aspect = this.__canvasWidth / this.__canvasHeight;
            this.__threeCamera.updateProjectionMatrix();
            
            this.__threeRenderer.setSize( this.__canvasWidth, this.__canvasHeight );

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
        
        _animate: function()
        {
            // call animate method of each GLObject
            for (var i=0; i<this.__GLModels.length; i++)
                this.__GLModels.getItem(i).animate();

            this.updateGL();

            requestAnimationFrame( this._animate.bind(this) );                      
        },

          
        
        
        /**
         * Main method to render the 3D scene, should be called each time the rendering need to be updated
         */
        updateGL: function()
        {
            if(!this.__threeRenderer)
                return;
            
            // Call update of the controller if set
            if (this.__threeController)
                this.__threeController.update();            
            
            // Update the rendering
            this.__threeRenderer.render( this.__threeScene, this.__threeCamera );
        }
    }
});


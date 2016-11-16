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
        this._setup(plugins);
        
        // Method to init the scene as soon as Three.js has been loaded
        this.addListener("scriptLoaded", this._initScene, this);
        
        // Others listeners
        this.addListener("resize", this.onResize, this);
        
        this.addListener("trackstart", this.__onTrackStart, this);
        this.addListener("track", this.__onTrack, this);
        this.addListener("keypress", this.__handleKeyPress, this);
    },

    events : {
        sceneCreated: 'qx.event.type.Event'
    },

    members : {
        /** members */
        __canvasBounds: null,
        
        __logEvents: false,
        __animate: false,

        /** Three.js camera object */
        __threeCamera: null,
        /** Three.js scene object */
        __threeScene: null,
        /** Three.js renderer object */
        __threeRenderer: null,
        /** Three.js controller object */
        __threeController: null,
        
        /** Three.js raycaster object */
        __threeRayCaster: null,        
        __rayCasterContinuous: false,
        
        __GLModels: null,
        
        __mousePosition: null,
        __intersected: null,
        
        /**
         * @return {Integer} of the canvas height.
         */
        canvasHeight : function() {return this.__canvasBounds.height;},
        
        /**
         * @return {Integer} of the canvas width.
         */
        canvasWidth : function() {return this.__canvasBounds.width;},
        
        /**
         * @return {Boolean} if scene has already been init. 
         */
        isInit: function() {if (this.__threeScene) return true; else return false;},
        
        
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
            this.__canvasBounds = this.getBounds();
            
            this.__mousePosition = new THREE.Vector2()
            this.__mousePosition.x = 0;
            this.__mousePosition.y = 0;

            // Init the Three.PerspectiveCamera
            this.__threeCamera = new THREE.PerspectiveCamera( 70, this.__canvasBounds.width / this.__canvasBounds.height, 0.1, 2000 );
            // Add default position of the camera
            this.__threeCamera.position.z = 400;
            
            // Init empty Three scene
            this.__threeScene = new THREE.Scene();
            
            // Init the webgl renderer
            this.__threeRenderer = new THREE.WebGLRenderer();
            this.__threeRenderer.setPixelRatio( 1 );
            this.__threeRenderer.setSize( this.__canvasBounds.width, this.__canvasBounds.height );
            
            // Init current list of glModels
            for (var i=0; i<this.__GLModels.length; i++)
            {   
                var model = this.__GLModels.getItem(i);
                if (!model.isInit()) // init and then register
                {
                    model.addListenerOnce('modelIsInit',function(_model){
                        this._addThreeMesh(_model);
                    },this);
                    
                    model.initGL();
                }
                else // register now                
                    this._addThreeMesh(model);
            }
                        
            // Add webgl canvas to the current widget
            el.appendChild( this.__threeRenderer.domElement );
            
            this.fireDataEvent('sceneCreated');
            
            // Start animation loop
            this._animate();
        },               

        /**
         * Method to add a Three TrackballController on the Three scene. Need to use plugin @see controls/TrackballControls
         * TODO add the parameter of the trackball as param of this method
         */
        addController: function(controllerType){
            if (!this.__threeScene){
                this.debug("Scene not ready, controller will be added later");
                this.addListenerOnce('sceneCreated',function(){
                    this.addController();
                },this);
                return;
            }

            if(this._hasPlugin(controllerType))
            {
                // if already a controller remove it
                if (this.__threeController)
                    delete this.__threeController;
                
                // TODO find if there is a way to avoid that switch
                if (controllerType == "TrackballControls"){
                    this.__threeController = new THREE.TrackballControls( this.__threeCamera );
                    this.__threeController.rotateSpeed = 1.0;
                    this.__threeController.zoomSpeed = 0.1;
                    this.__threeController.panSpeed = 0.1;
                }
                else if (controllerType == "OrbitControls")
                    this.__threeController = new THREE.OrbitControls( this.__threeCamera );
            }
            else
            {
                this.debug("No plugin found for controller type: " + controllerType);    
                return;
            }            
        },
        
        /**
         * @return {Pointer} to @see this.__threeScene in order to set params
         */
        getScene: function() {return this.__threeScene;},
        
        /**
         * @return {Pointer} to @see this.__threeController in order to set params
         */
        getController: function() {return this.__threeController;},
        
        /**
         * @return {Pointer} to @see this.__threeCamera in order to set params
         */
        getCamera: function() {return this.__threeCamera;},
        
        /**
         * @return {Pointer} to @see this.__threeRenderer in order to set params
         */
        getRenderer: function() {return this.__threeRenderer;},
        
        /**
         * 
         */
        addRayCaster: function(continuousMode){
            if (!this.__threeScene){
                this.debug("Scene not ready, rayCaster will be added later");
                this.addListenerOnce('sceneCreated',function(){
                    this.addRayCaster(continuousMode);
                },this);
                return;
            }
            
            this.__rayCasterContinuous = continuousMode;
            
            if (!this.__threeRayCaster)
                this.__threeRayCaster = new THREE.Raycaster();
        },
        
        setMouseSelection: function (x, y)
        {   
            if(this.__mousePosition)
            {
                this.__mousePosition.x = x;
                this.__mousePosition.y = y;
                
                if (this.__threeRayCaster){
                    this.__threeRayCaster.setFromCamera( this.__mousePosition, this.__threeCamera );
                    this._computeRayIntersection();
                }
            }
        },

        /**
         * Method to render or hide the 3D axis of the scene.
         */
        showAxis: function()
        {
            if (!this.__threeScene)
                return;
            
            var axisObject = this.__threeScene.getObjectByName("sceneAxis");
            if (axisObject)
                axisObject.visible = !axisObject.visible;
            else // first time, need to create the axis object
            {
                axisObject = new THREE.AxisHelper( this.__canvasBounds.height*0.5 );
                axisObject.name = "sceneAxis";
                this.__threeScene.add(axisObject);
            }
        },
        
        /**
         * Method to render or hide plan grid in the scene. Plan is at y = 0.
         */
        showGrid: function()
        {
            if (!this.__threeScene)
                return;
            
            var gridObject = this.__threeScene.getObjectByName("sceneGrid");
            if (gridObject)
                gridObject.visible = !gridObject.visible;
            else // first time, need to create the axis object
            {
                gridObject = new THREE.GridHelper( 1000, 100 );
                gridObject.material.opacity = 0.4;
                gridObject.material.transparent = true;
                gridObject.name = "sceneGrid";
                this.__threeScene.add(gridObject);
            }          
        },
        
        /**
         * Method to add a @param model {qxthree.BaseGLModel}. 
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
                    if (!model.isInit()) // init and then register
                    {
                        model.addListenerOnce('modelIsInit',function(ev){
                            this._addThreeMesh(ev.getData());
                        },this);
                        
                        model.initGL();
                    }
                    else // register now                
                        this._addThreeMesh(model);                                       
                }
            }            
        },
        
        
        /**
         * Internal Method to add a Three mesh from a @see qxthree.BaseGLModel into the Three scene.
         * Will set @see qxthree.BaseGLModel.__isRegistered to {true}
         */
        _addThreeMesh: function(model)
        {
            if (!model.isRegistered()){
                this.__threeScene.add( model.threeModel() );
                model.setRegistered(true);
                this.updateGL();
            }
        },
        
        getGLModelIndex: function(id)
        {
            for(var i=0; i<this.__GLModels.getLength(); i++){
                if(this.__GLModels.getItem(i).id() == id){
                    return i;                    
                }
            }            
            return -1;
        },
        
        getGLModel: function(id)
        {
            var modelIndex = this.getGLModelIndex(id);           
            
            if (modelIndex != -1)
                return this.__GLModels.getItem(modelIndex);
            else
                return null;
        },
        
        
        /**
         * Method to resize the webGl Canvas following GLWidget change of size.
         */
        onResize: function()
        {   
            this.__canvasBounds = this.getBounds();
                        
            if(!this.__threeRenderer || !this.__threeCamera)
                return;           
                       
            this.__threeCamera.aspect = this.__canvasBounds.width / this.__canvasBounds.height;
            this.__threeCamera.updateProjectionMatrix();
            
            this.__threeRenderer.setSize( this.__canvasBounds.width, this.__canvasBounds.height );

            this.updateGL();
        },
                 
        /**
         * Method to set @param {Boolean} value to @see __animate
         * Will start the animation if not already running.
         */
        animate: function(value){
            this.__animate = value;
        },
        
        /**
         * Main loop to animate the 3D scene. Call a each frame refresh.
         */
        _animate: function()
        {
            if (this.__animate){
                // call animate method of each GLObject
                for (var i=0; i<this.__GLModels.length; i++)
                    this.__GLModels.getItem(i).animate();
            }

            this.updateGL();            
            requestAnimationFrame( this._animate.bind(this) );                      
        },
        
        /**
         * 
         */
        _computeRayIntersection: function()
        {
            if(!this.__threeRayCaster)
                return;
            
            var intersects = this.__threeRayCaster.intersectObjects( this.__threeScene.children );
            if ( intersects.length > 0 ) 
            {              
                for(var i=0; i<intersects.length; i++)
                {
//                    this.debug("intersects: " + i + " => " + intersects[ i ].object.name);
                    if (intersects[ i ].object.name == "sceneGrid" || intersects[ i ].object.name == "sceneAxis")
                        continue;
            
                    if ( intersects[ i ].object && this.__intersected != intersects[ i ].object ) 
                    {                 
                        this.debug("inter: " + i + " => " + intersects[ i ].object.name);
                        if ( this.__intersected ) 
                            this.__intersected.material.emissive.setHex( this.__intersected.currentHex );

                        this.__intersected = intersects[ i ].object;
                        this.__intersected.currentHex = this.__intersected.material.emissive.getHex();
                        this.__intersected.material.emissive.setHex( 0xff0000 );
                        
                        return;
                    }
                }
            } 
            else 
            {
                if ( this.__intersected ) 
                    this.__intersected.material.emissive.setHex( this.__intersected.currentHex );

                this.__intersected = null;
            }
        },

        /**
         * callback method when @see trackstart {event} is catched. @param trackEvent
         */
        __onTrackStart: function(trackEvent) {
            if (qx.core.Environment.get("qx.debug") && this.__logEvents){
                this.debug("Event: GLWidget::__onTrackStart");
            }
        },
        
        /**
         * callback method when @see track {event} is catched. @param trackEvent
         */
        __onTrack: function(trackEvent){
            if (qx.core.Environment.get("qx.debug") && this.__logEvents){
                this.debug("Event: GLWidget::__onTrack");
            }
            
            var width  = parseInt(qx.bom.Document.getWidth());
            var height  = parseInt(qx.bom.Document.getHeight());
            this.__mousePosition.x = ((trackEvent.getDocumentLeft()/* - this.__canvasBounds.left*/) / width)*2 - 1;
            this.__mousePosition.y = - ((trackEvent.getDocumentTop()/* - this.__canvasBounds.top*/) / height)*2 + 1;
                         
//            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
//            this.debug("mouse: " + trackEvent.getViewportLeft() + " | " + trackEvent.getViewportTop());
//            this.debug("mouse final: " + this.__mousePosition.x + " | " + this.__mousePosition.y);
            
            this.updateGL();
        },
                
        /**
         * Handle key press events:
         * @param keyEvent
         *            {qx.event.type.KeySequence} Key event
         */
        __handleKeyPress: function(keyEvent){
            if (qx.core.Environment.get("qx.debug") && this.__logEvents){
                this.debug("Event: GLWidget::__handleKeyPress");
            }
            
            var type = keyEvent.getKeyIdentifier();
            var ctrl = keyEvent.isCtrlPressed();
            
            if(type == 'A')
                this.showAxis();
            else if(type == 'G')
                this.showGrid();
            
            this.updateGL();
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
            
            if (this.__threeRayCaster && this.__rayCasterContinuous){
                this.__threeRayCaster.setFromCamera( this.__mousePosition, this.__threeCamera );
                this._computeRayIntersection();
            }
            
            // Update the rendering
            this.__threeRenderer.render( this.__threeScene, this.__threeCamera );
        }
    }
});

/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "interactions"
 *
 */
qx.Class.define("interactions.Application",
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
        
        m_win: null,
        
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
            var plugins = ['controls/TrackballControls', 'controls/OrbitControls'];

            // Create Gl Canvas
            this.GLWidget = new qxthree.GLWidget(plugins);

            // Create cube and add it to the 3D scene (will be init after scene)
            this.GLWidget.addListener("scriptLoaded", this.initMeshes, this);

            // Set a default mode of interactor
            this.changeMouseInteractorParams("TrackballControls");

            this.GLWidget.addListener("sceneCreated", this.scenePostProcess, this);

            // Create qx window
            this.initWindow();
        },

        scenePostProcess: function()
        {
        	//this.debug("Scene has been created");
            this.GLWidget.setRayCasterContinuous(true);
            this.GLWidget.computeCanvasBB();
        },
        
        initMeshes: function()
        {           
            // Create geometry object
            var geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
                        
            for ( var i = 0; i < 500; i ++ ) 
            {                              
                var mat = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } );
                var glCube = new qxthree.GLMeshModel("cube_"+Number(i), null, geometry, mat, 
                            function(){
                    this.setPosition(Math.random() * 800 - 400, Math.random() * 800 - 400, Math.random() * 800 - 400);
                    this.setRotation(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);
                    this.setScale(Math.random() + 0.5, Math.random() + 0.5, Math.random() + 0.5);
                    this.setCanIntersect(true);
                });

                this.GLWidget.addGLModel(glCube);            
            }
            this.GLWidget.addRayCaster(true);
            
            // create light
            var GLDirLight = new qxthree.BaseGLModel("defaultLight", function(){
                var light = new THREE.DirectionalLight( 0xffffff, 1 );
                light.position.set( 1, 1, 1 ).normalize(); 
                return light;
            }.bind(this), null, null);
            this.GLWidget.addGLModel(GLDirLight);
        },
        
        initWindow: function()
        {
            // Create a container to have a panel on the left and GLWidget on the right
            var container = new qx.ui.container.Composite(new qx.ui.layout.HBox(5)).set({
                decorator: "main",
                width : 650,
                height : 500,
                backgroundColor: "black",
                allowGrowX: true,
                allowGrowY: true
              });
            
            // Add the different widgets to the container
            container.add(this.createPanel(), { flex : 1 });
            container.add(this.GLWidget, { flex : 2 });

            // Create the main window to encapsulate this container
            this.m_win = new qx.ui.window.Window('Three 3D Cubes interactions').set(
                    {
                        backgroundColor: "yellow",
                        width : 650,
                        height : 500,
                        allowGrowX: true,
                        allowGrowY: true
                    });
            this.m_win.setLayout(new qx.ui.layout.Grow());
            this.m_win.addListener('appear', function() {
            	this.m_win.center();
            }, this);
            this.m_win.add(container);
            this.m_win.addListener("resize", this.recomputeGLBound, this);
            this.m_win.addListener("move", this.recomputeGLBound, this);
            this.m_win.open();
        },
        
        recomputeGLBound: function()
        {
        	this.debug("recomputeGLBound");
        	if (this.GLWidget)
        		this.GLWidget.setBoundingBox(null);
        },
        
        createPanel: function()
        {
            // create panel layout
            var panelLayout = new qx.ui.layout.VBox();
            panelLayout.setSpacing(10);

            // add the panel layout to the container widget
            var panelCont = new qx.ui.container.Composite(panelLayout).set({backgroundColor: "#e0e0e0", maxWidth:150});
            panelCont.setPadding(20);

            // Add a title to that section
            var label1 = new qx.ui.basic.Label("Mouse interactor").set({font : new qx.bom.Font(14, ["Verdana", "sans-serif"])});
            panelCont.add(label1);

            // Create radio buttons choice
            var rbTrackBall = new qx.ui.form.RadioButton("TrackballControls");
            var rbOrbit = new qx.ui.form.RadioButton("OrbitControls");

            // Add them to the container
            panelCont.add(rbTrackBall);
            panelCont.add(rbOrbit);

            // Add all radio buttons to the manager
            var manager = new qx.ui.form.RadioGroup(rbTrackBall, rbOrbit);

            // Add a listener to the "changeSelected" event
            manager.addListener("changeSelection", this._onChangeMouseInteraction, this);
            
            // Return the panel container to be added to the main widget
            return panelCont;
        },
        
        _onChangeMouseInteraction: function(e)
        {                       
            var selectedButton = e.getData()[0];
            var interactorType = selectedButton.getLabel();
                
            this.changeMouseInteractorParams(interactorType);
        },
        
        changeMouseInteractorParams: function(interactorType)
        {
            if (!this.GLWidget.isInit())
            {
                this.GLWidget.addListener("sceneCreated", function(){
                    this.changeMouseInteractorParams(interactorType);
                },this);
                return;
            }           
            
            this.GLWidget.addController(interactorType);
            
            var controller = this.GLWidget.getController();
            if(!controller){
                this.debug("Error: changeMouseInteractorParams: No controller found.");
                return;
            }
                
            if(interactorType == "TrackballControls")
            {               
                controller.rotateSpeed = 1.0;
                controller.zoomSpeed = 1.2;
                controller.panSpeed = 0.8;
                controller.noZoom = false;
                controller.noPan = false;
                controller.staticMoving = true;
                controller.dynamicDampingFactor = 0.3;
            }
            else if (interactorType == "OrbitControls")
            {
                controller.target.y = 2;
            }
        }
    }
});

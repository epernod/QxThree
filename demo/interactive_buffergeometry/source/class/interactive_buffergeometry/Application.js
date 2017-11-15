/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "interactions"
 *
 */
qx.Class.define("interactive_buffergeometry.Application",
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
            var plugins = [];

            // Create Gl Canvas
            this.GLWidget = new qxthree.GLWidget(plugins);

            // Create cube and add it to the 3D scene (will be init after scene)
            this.GLWidget.addListener("scriptLoaded", this.initMeshes, this);

            this.GLWidget.addListener("sceneCreated", this.scenePostProcess, this);

            // Create qx window
            this.initWindow();
        },

        scenePostProcess: function()
        {
            // Set a default mode of interactor
        	this.debug("Scene has been created");
            // update camera position
            var camera = this.GLWidget.getCamera();
            camera.position.z = 1000;
            
        },
        
        initMeshes: function()
        {           
			var triangles = 5000;
			var geometry = new THREE.BufferGeometry();
			var positions = new Float32Array( triangles * 3 * 3 );
			var normals = new Float32Array( triangles * 3 * 3 );
			var colors = new Float32Array( triangles * 3 * 3 );
			var color = new THREE.Color();
			var n = 800, n2 = n/2;	// triangles spread in the cube
			var d = 120, d2 = d/2;	// individual triangle size
			var pA = new THREE.Vector3();
			var pB = new THREE.Vector3();
			var pC = new THREE.Vector3();
			var cb = new THREE.Vector3();
			var ab = new THREE.Vector3();
			for ( var i = 0; i < positions.length; i += 9 ) {
				// positions
				var x = Math.random() * n - n2;
				var y = Math.random() * n - n2;
				var z = Math.random() * n - n2;
				var ax = x + Math.random() * d - d2;
				var ay = y + Math.random() * d - d2;
				var az = z + Math.random() * d - d2;
				var bx = x + Math.random() * d - d2;
				var by = y + Math.random() * d - d2;
				var bz = z + Math.random() * d - d2;
				var cx = x + Math.random() * d - d2;
				var cy = y + Math.random() * d - d2;
				var cz = z + Math.random() * d - d2;
				positions[ i ]     = ax;
				positions[ i + 1 ] = ay;
				positions[ i + 2 ] = az;
				positions[ i + 3 ] = bx;
				positions[ i + 4 ] = by;
				positions[ i + 5 ] = bz;
				positions[ i + 6 ] = cx;
				positions[ i + 7 ] = cy;
				positions[ i + 8 ] = cz;
				// flat face normals
				pA.set( ax, ay, az );
				pB.set( bx, by, bz );
				pC.set( cx, cy, cz );
				cb.subVectors( pC, pB );
				ab.subVectors( pA, pB );
				cb.cross( ab );
				cb.normalize();
				var nx = cb.x;
				var ny = cb.y;
				var nz = cb.z;
				normals[ i ]     = nx;
				normals[ i + 1 ] = ny;
				normals[ i + 2 ] = nz;
				normals[ i + 3 ] = nx;
				normals[ i + 4 ] = ny;
				normals[ i + 5 ] = nz;
				normals[ i + 6 ] = nx;
				normals[ i + 7 ] = ny;
				normals[ i + 8 ] = nz;
				// colors
				var vx = ( x / n ) + 0.5;
				var vy = ( y / n ) + 0.5;
				var vz = ( z / n ) + 0.5;
				color.setRGB( vx, vy, vz );
				colors[ i ]     = color.r;
				colors[ i + 1 ] = color.g;
				colors[ i + 2 ] = color.b;
				colors[ i + 3 ] = color.r;
				colors[ i + 4 ] = color.g;
				colors[ i + 5 ] = color.b;
				colors[ i + 6 ] = color.r;
				colors[ i + 7 ] = color.g;
				colors[ i + 8 ] = color.b;
			}
        	
			geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
			geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
			geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
			
			geometry.computeBoundingSphere();
			
			var material = new THREE.MeshPhongMaterial( {
					color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
					side: THREE.DoubleSide, vertexColors: THREE.VertexColors
			} );

			var glBuffer = new qxthree.GLMeshModel("buffer1", null, geometry, material,
					function(){
                		this.setCanIntersect(true);
            		},
            		function(){
            			var time = Date.now() * 0.001;
            			this._threeModel.rotation.x = time * 0.15;
            			this._threeModel.rotation.y = time * 0.25;           			
            });

			this.GLWidget.addGLModel(glBuffer);            
			
            // Add selection layer                        
            var GLLine = new qxthree.BaseGLModel("selectLine", function(){
            	var geometry2 = new THREE.BufferGeometry();
            	geometry2.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( 4 * 3 ), 3 ) );
            	var material2 = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2, transparent: true } );
            	
                var line = new THREE.Line( geometry2, material2 );
                return line;
            }.bind(this), null, null);
            this.GLWidget.addGLModel(GLLine);
            		
            
            // Add the intersection method
            glBuffer.setIntersectMethod(function(){
            	if (this._intersectInfo && GLLine)
            	{            	
            		var face = this._intersectInfo.face;
            		
            		var line = GLLine.threeModel();
            		var mesh = this.threeModel();
					var linePosition = line.geometry.attributes.position;
					var meshPosition = mesh.geometry.attributes.position;
					
					linePosition.copyAt( 0, meshPosition, face.a );
					linePosition.copyAt( 1, meshPosition, face.b );
					linePosition.copyAt( 2, meshPosition, face.c );
					linePosition.copyAt( 3, meshPosition, face.a );

					mesh.updateMatrix();
					line.geometry.applyMatrix( mesh.matrix);
					line.visible = true;
            	}            	            	
            }); 
            
            glBuffer.setUnIntersectMethod(function(){
            	if(GLLine)
            	{
            		var line = GLLine.threeModel();
            		line.visible = false;
            	}
            });
            
            // create lights
            var GLDirLight1 = new qxthree.BaseGLModel("defaultLight", function(){
                var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
                light.position.set( 1, 1, 1 ); 
                return light;
            }.bind(this), null, null);
            this.GLWidget.addGLModel(GLDirLight1);
            
            var GLDirLight2 = new qxthree.BaseGLModel("defaultLight", function(){
                var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
                light.position.set( 1, -1, 1 ); 
                return light;
            }.bind(this), null, null);
            this.GLWidget.addGLModel(GLDirLight2);
            
			// Add rayCaster
            this.GLWidget.addRayCaster(true);
            this.GLWidget.animate(true);
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
            container.add(this.GLWidget, { flex : 1 });

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
        	if (this.GLWidget)
        		this.GLWidget.setBoundingBox(null);
        }       

    }
});

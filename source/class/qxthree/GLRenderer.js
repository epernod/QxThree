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

    construct: function(){
        this.base(arguments);
       
        this.addListener("scriptLoaded", this.__init, this);
        
        this.__setup();
        this.debug("setup END");
        this.addListener("track", this.__onTrack, this);
        
        this.set(
                {
                    backgroundColor: "green",
                    //canvasWidth: this.__width,
                    //canvasHeight: this.__height,
                    //syncDimension: false,
                    width: this.__width,
                    height: this.__height
                });
    },
    
    events : {
        sceneCreated: 'qx.event.type.Event'
    },

    members : {
        
        __height: 400,
        __width: 400,
        
        __camera: null,
        __scene: null,
        __renderer: null,
        __mesh: null,
        __logEvents: true,

        
        __init: function()
        {
            this.debug("MixinGLRenderer::init");
         
            qx.ui.core.queue.Manager.flush();
            this.canvasElement = this.getContentElement().getDomElement();
            if (!this.canvasElement){
                this.debug("Error: qxthree.GLRenderer: no DomElement found.")
//                return false;
            }

            this.__camera = new THREE.PerspectiveCamera( 70, this.__width / this.__height, 1, 1000 );
            this.__camera.position.z = 400;
            
            this.__scene = new THREE.Scene();
            
            var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
            var material = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } );
            
            this.__mesh = new THREE.Mesh( geometry, material );
            this.__scene.add( this.__mesh );
            
            this.__renderer = new THREE.WebGLRenderer();
            this.__renderer.setPixelRatio( 1 );
            this.__renderer.setSize( this.__width*0.5, this.__height );
            this.__renderer.render( this.__scene, this.__camera );
            /*
new MeshBasicMaterial( { color: Math.random() * 0xffffff })
                var texture = new THREE.TextureLoader().load( 'textures/crate.gif' );
                var material = new THREE.MeshBasicMaterial( { map: texture } );
                
                document.body.appendChild( renderer.domElement );

                //

                window.addEventListener( 'resize', onWindowResize, false );
*/
            //this.__animateTest();
            
            this.fireDataEvent('sceneCreated');
        },
        
        getRenderer: function(){
            var element =this.__renderer.domElement; 
            return this.__renderer.domElement;
        },
        
        helloWorld : function ()
        {
            var label1 = new qx.ui.basic.Label("Hellow World from GLRender").set({
                width: 200
              });
            
            return label1;
        },
        
        testMethod: function()
        {
            this.canvasElement = this.getContentElement().getDomElement();
            if (!this.canvasElement){
                this.debug("Error: qxthree.GLRenderer: no DomElement found.")
                return false;
            }
            else
                this.debug("Ok: qxthree.GLRenderer: DomElement found.")
        },
        
        update: function(){
            this.debug("qxthree.GLRenderer::update");
        },
        
        __onTrack: function(trackEvent){
            if (qx.core.Environment.get("qx.debug") && this.__logEvents){
                this.debug("Event: webGLController::__onTrack");
            }
//
//            requestAnimationFrame( animate );
//
            this.__mesh.rotation.x += 0.005;
            this.__mesh.rotation.y += 0.01;

            this.__renderer.render( this.__scene, this.__camera );
            
        },
        
        __animateTest: function()
        {
            //this.debug("qxthree.GLRenderer::__animateTest");
            //requestAnimationFrame( this.__animateTest );

            this.__mesh.rotation.x += 0.005;
            this.__mesh.rotation.y += 0.01;

            this.__renderer.render( this.__scene, this.__camera );
            
        }
    }
});


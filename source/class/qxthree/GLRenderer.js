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

    construct : function(W, H, parent)
    {
        this.base(arguments);
        this.__width = W;
        this.__height = H;
        this.__parent = parent;
        
        this.set(
                {
                    backgroundColor: "green",
//                    canvasWidth: W,
//                    canvasHeight: H,
//                    syncDimension: false,
                    width: W,
                    height: H
                });
       
        this.addListener("scriptLoaded", this.__initScene, this);
        this.addListener("track", this.__onTrack, this);
        this.addListener("appear", this.__webGLStart, this);
        
//        this.addListenerOnce('scriptLoaded',function(e){
//            var el = this.getContentElement().getDomElement();
//            
//            var scene = new THREE.Scene();
//            var camera = new THREE.PerspectiveCamera( 75, this.getBounds().width/this.getBounds().height, 0.1, 1000 );
//
//            var renderer = new THREE.WebGLRenderer();
//            renderer.setSize( this.getBounds().width,this.getBounds().height );
//            el.appendChild(renderer.domElement);
//      
//            var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//            var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//            var cube = new THREE.Mesh( geometry, material );
//            scene.add( cube );
//      
//            camera.position.z = 5;
//      
//            var render = function () {
//            requestAnimationFrame( render );
//              cube.rotation.x += 0.1;
//              cube.rotation.y += 0.1;
//              renderer.render(scene, camera);
//            };
//      
//            render();
//        },this);
        

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

        __webGLStart: function(){
            this.__setup();
            this.debug("setup END");
        },
        
        __initGL: function()
        {
            this.debug("GLRenderer::__initGL");
            qx.ui.core.queue.Manager.flush();
            this.canvasElement = this.getContentElement().getDomElement();
            if (!this.canvasElement){
                this.debug("Error: qxthree.GLRenderer: no DomElement found.")
//                return false;
            }
            else
                this.debug("cette fois ci c'est ok");
            
            
        },
        
        __initScene: function()
        {
            this.debug("GLRenderer::init");
            
            var el = this.getContentElement().getDomElement();
            if (!this.canvasElement){
                this.debug("Error: qxthree.GLRenderer: no DomElement found.")
//                return false;
            }
            else
                this.debug("cette fois ci c'est ok");
         
            

            this.__camera = new THREE.PerspectiveCamera( 70, this.__width / this.__height, 1, 1000 );
            this.__camera.position.z = 400;
            
            this.__scene = new THREE.Scene();
            
            var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
            var material = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } );
            
            this.__mesh = new THREE.Mesh( geometry, material );
            this.__scene.add( this.__mesh );
            
            this.__renderer = new THREE.WebGLRenderer();
            this.__renderer.setPixelRatio( 1 );
            this.__renderer.setSize( this.__width, this.__height );
            
            el.appendChild( this.__renderer.domElement );
            
            this.__renderer.render( this.__scene, this.__camera );
            
            /*
new MeshBasicMaterial( { color: Math.random() * 0xffffff })
                var texture = new THREE.TextureLoader().load( 'textures/crate.gif' );
                var material = new THREE.MeshBasicMaterial( { map: texture } );
                
                document.body.appendChild( renderer.domElement );

                //

                window.addEventListener( 'resize', onWindowResize, false );
*/
            this.__animateTest();
            
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
//            return function(){
//                var render = function(){
//                    requestAnimationFrame( render );
//                    this.__mesh.rotation.x += 0.005;
//                    this.__mesh.rotation.y += 0.01;
//
//                    this.__renderer.render( this.__scene, this.__camera );
//                };
//            };
            
            
        }
    }
});


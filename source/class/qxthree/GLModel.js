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
 * GLModel is the basic class for handling GL Model from Three.js inside qooxdoo framework
 */

qx.Class.define("qxthree.GLModel",
{
  extend : qx.core.Object,
  
  construct : function(id)
  {
      this.base(arguments);
      this.__id = id;
  },
  
  members :
  {   
      /** id of this GLModel to identify it in the scene */
      __id: "",
      
      /** Three.js mesh object */
      __threeMesh: null,
      
      __isInit: false,
      
      __isRegistered: false,
      
      /** @return {String} id of this model.*/
      id: function() {return this.__id;},
      
      /** @return {Boolean} init status of this model.*/
      isInit: function() {return this.__isInit;},
      
      /** @return {Boolean} init status of this model.*/
      isRegistered: function() {return this.__isRegistered;},
      setRegistered: function(value) {this.__isRegistered = value;},
      
      /** @return {Object} 3D Three mesh of this model.*/
      threeMesh: function(){return this.__threeMesh;},
      
      /**
       * Main method to init this object only when GL context is ready.
       * Will be called by {@link qxthree.GLWidget.initGLModels method}
       * Or will be called when object is added to the already running scene.
       */
      initGL: function()
      {
          this.debug("initGL GLModel, " + this.__id +" isInit: "+ this.__isInit);
          var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
          var texture = new THREE.TextureLoader().load( 'resource/crate.gif' );
          var material = new THREE.MeshBasicMaterial( { map: texture } );
          this.__threeMesh = new THREE.Mesh( geometry, material );
          this.__isInit = true;
      },
      
      /**
       * Main method to animate this object. 
       * will be called by {@link qxthree.GLWidget._animate method}
       */
      animate: function()
      {
          if (!this.__isInit)
              return;

          this.__threeMesh.rotation.x += 0.005;
          this.__threeMesh.rotation.y += 0.01;
      },

      update: function()
      {
          if (!this.__isInit)
              return;
          
          this.debug("update GLModel");
      }
  }
});
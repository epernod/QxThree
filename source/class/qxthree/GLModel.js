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
   
  construct : function(id, meshCreationMethod, geometry, material, postCreationMethod)
  {
      this.base(arguments);
      this.__id = id;
      this.__meshCreationMethod = meshCreationMethod;
      this.__geometry = geometry;
      this.__material = material;
      this.__postCreationMethod = postCreationMethod;
  },
  
  members :
  {   
      /** id of this GLModel to identify it in the scene */
      __id: "",
      
      /** Three.js mesh object */
      __threeMesh: null,
      
      __isInit: false,
      
      __isRegistered: false,
      
      /** Pointer to mesh creation method */
      __meshCreationMethod: null,
      
      __postCreationMethod: null,
      
      /** Pointer to the Three geometry object */
      __geometry: null,
      
      /** Pointer to the Three material object */
      __material: null,
      
      /** @return {String} id of this model.*/
      id: function() {return this.__id;},
      
      /** @return {Boolean} init status of this model.*/
      isInit: function() {return this.__isInit;},
      
      /** @return {Boolean} init status of this model.*/
      isRegistered: function() {return this.__isRegistered;},
      setRegistered: function(value) {this.__isRegistered = value;},
      
      /** @return {Object} 3D Three mesh of this model.*/
      threeMesh: function(){return this.__threeMesh;},
      
      setPosition: function(x, y, z){
          this.__threeMesh.position.x = x;
          this.__threeMesh.position.y = y;
          this.__threeMesh.position.z = z;
      },
      
      setRotation: function(rotX, rotY, rotZ){
          this.__threeMesh.rotation.x = rotX;
          this.__threeMesh.rotation.y = rotY;
          this.__threeMesh.rotation.z = rotZ;
      },
      
      setScale: function(sX, sY, sZ){
          this.__threeMesh.scale.x = sX;
          this.__threeMesh.scale.y = sY;
          this.__threeMesh.scale.z = sZ;
      },
            
           
      /**
       * Main method to init this object only when GL context is ready.
       * Will be called by {@link qxthree.GLWidget.initGLModels method}
       * Or will be called when object is added to the already running scene.
       */
      initGL: function()
      {
          if (this.__meshCreationMethod){
              this.__threeMesh = this.__meshCreationMethod();                         
              
              if(this.__postCreationMethod)
                  this.__postCreationMethod();
              
              this.__isInit = true;
          }
          else if (this.__geometry && this.__material)
          {
              this.__threeMesh = new THREE.Mesh( this.__geometry, this.__material );
              
              if(this.__postCreationMethod)
                  this.__postCreationMethod();
              
              this.__isInit = true;
          }
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
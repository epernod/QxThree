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

qx.Class.define("qxthree.BaseGLModel",
{
  extend : qx.core.Object,
   
  construct : function(id, creationMethod, postCreationMethod, updateMethod)
  {
      this.base(arguments);
      this._id = id;
      this._creationMethod = creationMethod;
      this._postCreationMethod = postCreationMethod;
      this._updateMethod = updateMethod;
  },
  
  members :
  {   
      /** id of this GLModel to identify it in the scene. */
      _id: "",
      
      /** {Boolean} value reflecting if creation methods have been done. */
      _isInit: false,

      /** {Boolean} value reflecting if three Model has is registered to the Three scene. */
      _isRegistered: false,
      
      /** Three.js object encapsulated. */
      _threeModel: null,
      
      /** Pointer to mesh creation method, If set will be called at scene creation. */
      _creationMethod: null,
      
      /** Pointer to mesh post creation method, If set will be called at the end of @see initGL method. */
      _postCreationMethod: null,
      
      /** Pointer to mesh update method, If set will be called at each animation step. */
      _updateMethod: null,

                
      /** @return {String} id of this model.*/
      id: function() {return this._id;},
      
      /** @return {Boolean} init status of this model.*/
      isInit: function() {return this._isInit;},
      
      /** @return {Boolean} @see _isRegistered status of this model.*/
      isRegistered: function() {return this._isRegistered;},
      /** Set {Boolean} @see _isRegistered status of this model.*/
      setRegistered: function(value) {this._isRegistered = value;},

      /** @return {Object} 3D Three model encapsulated by this class.*/
      threeModel: function(){return this._threeModel;},

      /** Set the 3D position of the Three model.*/
      setPosition: function(x, y, z){
          this._threeModel.position.x = x;
          this._threeModel.position.y = y;
          this._threeModel.position.z = z;
      },
      
      /** Set the 3D rotation of the Three model.*/
      setRotation: function(rotX, rotY, rotZ){
          this._threeModel.rotation.x = rotX;
          this._threeModel.rotation.y = rotY;
          this._threeModel.rotation.z = rotZ;
      },
      
      /** Set the 3D scale of the Three model.*/
      setScale: function(sX, sY, sZ){
          this._threeModel.scale.x = sX;
          this._threeModel.scale.y = sY;
          this._threeModel.scale.z = sZ;
      },
            
           
      /**
       * Main method to init this object only when GL context is ready.
       * Will be called by {@link qxthree.GLWidget.initGLModels method}
       * Or will be called when object is added to the already running scene.
       * Method will call:
       * @see _creationMethod if set in the constructor or @see _initGLImpl 
       * @see _initGLImpl should be overwrite by derived classes.
       * @see _postCreationMethod if set in the constructor
       */
      initGL: function()
      {
          // Call either this._creationMethod if set, otherwise call this._initGLImpl
          if (this._creationMethod)
              this._threeModel = this._creationMethod();
          else
              this._initGLImpl();
          
          // Call post processing method
          if(this._postCreationMethod)
              this._postCreationMethod();

          // Set object as init
          this._isInit = true;
          // Give the id name to the Three model
          this._threeModel.name = this._id;          
      },
      
      /**
       * Implicit method called by @see initGL. This method should be overwritten
       * by children classes
       */
      _initGLImpl: function()
      {
          
      },
      
      /**
       * Main method to animate this object. 
       * will be called by {@link qxthree.GLWidget._animate method}
       * Will call either @see this._updateMethod if set in constructor of @see _updateImpl
       * @see _updateImpl should be overwrite by derived classes.
       */
      animate: function()
      {
          // Quit if not init
          if (!this._isInit)
              return;

          // Call update method
          if (this._updateMethod)
              this._updateMethod();
          else
              this._updateImpl();
              
      },

      /**
       * Implicit method called by @see animate. This method should be overwritten
       * by children classes
       */
      _updateImpl: function()
      {
          if (!this._isInit)
              return;          
      }
  }
});
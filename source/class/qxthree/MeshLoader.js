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

qx.Class.define("qxthree.MeshLoader",
{
  extend : qx.core.Object,
   
  construct : function(id, url, onLoad, onProgress, onError)
  {
      this.base(arguments);
      this._id = id;
      this._url = url;
      this._onLoadMethod = onLoad;
      this._onProgressMethod = onProgress;
      this._onErrorMethod = onError;
  },
  
  members :
  {   
      /** id of this GLModel to identify it in the scene. */
      _id: "",
      
      /** url path of the the mesh to be loaded */
      _url:"",
      
      /** {Boolean} value reflecting if creation methods have been done. */
      _isInit: false,
      
      /** {Boolean} value reflecting if three Model has is registered to the Three scene. */
      _isRegistered: false,      
                  
      /** Three.js 3D Object loaded by this Object. */
      _threeModel: null,
      
      /** Three.js loader depending on the file set by @see this._url */
      _threeLoader: null,
      
      /** Pointer to mesh creation method, If set will be called at scene creation. */
      _onLoadMethod: null,
      
      /** Pointer to mesh post creation method, If set will be called at the end of @see initGL method. */
      _onProgressMethod: null,
      
      /** Pointer to mesh update method, If set will be called at each animation step. */
      _onErrorMethod: null,
      
      /** {Boolean} storing the status if mesh loading is done or not. */
      _loaded: false,

      /** {String} type of loader used in this class. */
      _loaderType:"",
                
      /** @return {String} id of this model.*/
      id: function() {return this._id;},
      
      /** @return {Boolean} loaded status of this loader.*/
      isLoaded: function() {return this._loaded;},
            
      /** @return {Object} 3D Three model encapsulated by this class.*/
      threeModel: function(){return this._threeModel;},
      
      /** @return {Boolean} init status of this model.*/
      isInit: function() {return this._isInit;},
      
      /** @return {Boolean} @see _isRegistered status of this model.*/
      isRegistered: function() {return this._isRegistered;},
      /** Set {Boolean} @see _isRegistered status of this model.*/
      setRegistered: function(value) {this._isRegistered = value;},


      
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
    	  // check the type of loader
    	  this._checkLoaderType();
    	  
    	  if(!this._threeLoader){
    		  this.debug( this._id + " Error: no loader found for file: " + this._url);
    		  return;
    	  }
    	  
    	  // check methods, define default if methods are null
    	  if (this._onProgressMethod == null){
    		  this._onProgressMethod = function(xhr){
    			  if (xhr.lengthComputable){
    				  var percentComplete = xhr.loaded / xhr.total * 100;
    				  this.debug( this._id + " loading progress: " + Math.round(percentComplete, 2) + "%.");
    			  }
    		  }.bind(this);
    	  } 
    	 
    	  if (this._onErrorMethod == null){
    		  this._onErrorMethod = function(xhr){
    			  this.debug( this._id + " Error: " + xhr.responseText);
    		  }.bind(this);
    	  }
    	  
    	  if (this._onLoadMethod == null){
    		  this._onLoadMethod = function(object){
    			  this._threeModel = object;
    			  // Set object as init
    			  this.debug( this._id + " onLoad: ");
    	          this._isInit = true;
    		  }.bind(this);
    	  }
    	
    	  
    	  // load the model    	  
    	  this._threeLoader.load(this._url, this._onLoadMethod, this._onProgressMethod, this._onErrorMethod);
      },
      
      /**
       * 
       */
      _checkLoaderType: function()
      {
          if (this._url == "")
              return;
          
          this._loaderType = this._url.substring(this._url.lastIndexOf(".")+1);
          this.debug("this._loaderType: " + this._loaderType);
          
          if (this._loaderType == "obj")
        	  this._threeLoader = new THREE.OBJLoader();
          else if (this._loaderType == "ctm")
        	  this._threeLoader = new THREE.CTMLoader();
      }
  }
});
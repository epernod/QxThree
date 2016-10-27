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

qx.Class.define("qxthree.GLMeshLoader",
{
  extend : qxthree.BaseGLModel,
   
  construct : function(id, url, onLoad, onProgress, onError, postCreationMethod, updateMethod)
  {
      this.base(arguments, id, null, postCreationMethod, updateMethod);
      this._url = url;
      this._onLoadMethod = onLoad;
      this._onProgressMethod = onProgress;
      this._onErrorMethod = onError;
  },
  
  members :
  {   
      /** url path of the the mesh to be loaded */
      _url:"",

      /** {String} type of loader used in this class. */
      _loaderType:"",

      /** Three.js loader depending on the file set by @see this._url */
      _threeLoader: null,
      
      /** Pointer to mesh creation method, If set will be called at scene creation. */
      _onLoadMethod: null,
      
      /** Pointer to mesh post creation method, If set will be called at the end of @see initGL method. */
      _onProgressMethod: null,
      
      /** Pointer to mesh update method, If set will be called at each animation step. */
      _onErrorMethod: null,
            
      /** @return {String} extension of the mesh to be loaded. */
      loaderType: function() {return this._loaderType;},
      
      /** @return {Object} Pointer to the Three.js Loader Object. */
      loaderType: function() {return this._loaderType;},

      
      /**
       * Implicit method called by @see initGL. This method should be overwritten
       * by children classes
       */
      _initGLImpl: function()
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
       * Implicit method called by @see animate. This method should be overwritten
       * by children classes
       */
      _updateImpl: function()
      {
          if (!this._isInit)
              return; 
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
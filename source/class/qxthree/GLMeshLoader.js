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
   
  construct : function(id, urlPath, filename, onLoad, onProgress, onError, postCreationMethod, updateMethod)
  {
      this.base(arguments, id, null, postCreationMethod, updateMethod);
      this._url = urlPath;
      this._filename = filename;
      this._onLoadMethod = onLoad;
      this._onProgressMethod = onProgress;
      this._onErrorMethod = onError;
  },
  
  members :
  {   
      /** url path of the directory where files are located */
      _url:"",
      
      /** filename of the mesh to be loaded*/
      _filename:"",

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
            
      /** Pointer to material to apply to the mesh.*/
      _materials: null,
      
      /** @return {String} extension of the mesh to be loaded. */
      loaderType: function() {return this._loaderType;},
      
      /** @return {Object} Pointer to the Three.js Loader Object. */
      loaderType: function() {return this._loaderType;},
      
      /** @return {Object} 3D Three Loader encapsulated by this class.*/
      threeLoader: function(){return this._threeLoader;},
      
      setMaterials: function(materials) {this._materials = materials;},
            
      /**
       * Implicit method called by @see initGL. This method should be overwritten
       * by children classes
       */
      _initGLImpl: function()
      {
    	  // check the type of loader
    	  this._checkLoaderType();
    	  
    	  if(!this._threeLoader){
    		  this.debug( this._id + " Error: no loader found for file: " + this._url + this._filename);
    		  return;
    	  }
    	  
    	  // check methods, define default if methods are null
    	  if (this._onProgressMethod == null){
    		  this._onProgressMethod = function(xhr){
    			  if (xhr.lengthComputable){
    				  var percentComplete = xhr.loaded / xhr.total * 100;
    				  if (qx.core.Environment.get("qx.debug"))
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
    			  this._fireInitEvent();
    		  }.bind(this);
    	  }
    	
    	  
    	  // load the model
    	  if (this._materials)
    	      this._threeLoader.setMaterials(this._materials);
    	  this._threeLoader.setPath(this._url);
    	  this._threeLoader.load(this._filename, this._onLoadMethod, this._onProgressMethod, this._onErrorMethod);
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
          if (this._filename == "")
              return;
          
          this._loaderType = this._filename.substring(this._filename.lastIndexOf(".")+1);
          if (qx.core.Environment.get("qx.debug"))
              this.debug("this._loaderType: " + this._loaderType);
          
          if (this._loaderType == "obj")
        	  this._threeLoader = new THREE.OBJLoader();
          else if (this._loaderType == "ctm")
        	  this._threeLoader = new THREE.CTMLoader();
          else if (this._loaderType == "mtl")
              this._threeLoader = new THREE.MTLLoader();
      }
  }
});
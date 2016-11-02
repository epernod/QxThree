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

qx.Class.define("qxthree.GLMeshModel",
{
  extend : qxthree.BaseGLModel,
   
  construct : function(id, meshCreationMethod, geometry, material, postCreationMethod, updateMethod)
  {
      this.base(arguments, id, meshCreationMethod, postCreationMethod, updateMethod);
      this._geometry = geometry;
      this._material = material;
  },
  
  members :
  {                     
      /** Pointer to the Three geometry object */
      _geometry: null,
      
      /** Pointer to the Three material object */
      _material: null,

      /**
       * Implicit method called by @see initGL. This method should be overwritten
       * by children classes
       */
      _initGLImpl: function()
      {
          // default creation of a Three mesh
          this._threeModel = new THREE.Mesh( this._geometry, this._material );
          
          // fire init event
          this._fireInitEvent();
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
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

    },

    members : {
        helloWorld : function ()
        {
            var label1 = new qx.ui.basic.Label("Hellow World from GLRender").set({
                width: 200
              });
            
            return label1;
        }
    }
});


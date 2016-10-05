/* ************************************************************************

   Copyright:


   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Erik Pernod (epernod)

************************************************************************ */

/* ************************************************************************

#asset(three/*)
#ignore(THREE)

************************************************************************ */

/**
 * 
 */
qx.Mixin.define("qxthree.MixinGLRenderer", {

    statics : 
    {
        INSTANCE_COUNTER : 0,
        /**
         * map of loaded scripts
         */
        LOADED: {},
        /**
         * map of objects in the process of loading a particular script
         */
        LOADING: {},
        /**
         * Default Options for graphs. They get merged (non overwriting to the graph object).
         */
        DEFAULT_OPTIONS: 
        {
            
        }
        
    },
    
    events :
    {
        /**
         * fires when a script is loaded
         */
        scriptLoaded: 'qx.event.type.Event'
    },
    
    members :
    {                      
        _hasPlugin: function(targetPlugin)
        {
            for (var scriptName in qxthree.MixinGLRenderer.LOADED){
                if (scriptName.includes(targetPlugin))
                    return true;
            } 
            return false;
        },
        
        __setup: function(plugins)
        {
            var min = '.min';
            if (qx.core.Environment.get("qx.debug")) {
              min = '';
            }
            /* I guess it would not be all that difficult to create a stripped
             * down jQuery object with all the bits required by jqPlot and use
             * this instead of full jQuery.
             */
            var codeArr = [
                  "three" + min + ".js"
            ];
            
            if (plugins) {
                for (var i = 0; i < plugins.length; i++) {
                    this.debug(plugins[i]);
                    codeArr.push('scripts/' + plugins[i] + '.js');
                }
            }
            
            
            this.__loadScriptArr(codeArr, qx.lang.Function.bind(this.__addCanvas.bind(this)));
        },
        
        __addCanvas: function (){
            this.debug("__addCanvas");
            
            this.fireDataEvent('scriptLoaded');
        },
        
        __loadScriptArr: function(codeArr,handler)
        {
            var script = codeArr.shift();
            if (!script){
                handler();
                return;
            }
            
            if (qxthree.MixinGLRenderer.LOADED[script]){
                /* got this script, go for the next in the array */
                 this.__loadScriptArr(codeArr,handler);
                 return;
            }
            if (qxthree.MixinGLRenderer.LOADING[script]){
                /* not loaded but it is already loading, so let's listen for it to arrive */
                qxthree.MixinGLRenderer.LOADING[script].addListenerOnce('scriptLoaded',function(){
                    this.__loadScriptArr(codeArr,handler);
                },this);
                return;
            }
            qxthree.MixinGLRenderer.LOADING[script] = this;

            var src = qx.util.ResourceManager.getInstance().toUri("three/"+script);

            if (qx.io.ScriptLoader){
                var sl = new qx.io.ScriptLoader();
                sl.load(src, function(status){
                    if (status == 'success'){
                        // this.debug("Dynamically loaded "+src+": "+status);
                        qxthree.MixinGLRenderer.LOADED[script] = true;
                        delete qxthree.MixinGLRenderer.LOADING[script];                        
                        this.__loadScriptArr(codeArr,handler);
                    }
                },this);
            }
            else {
                var req = new qx.bom.request.Script();
                req.on('load',function() {
                    qxthree.MixinGLRenderer.LOADED[script] = true;
                    delete qxthree.MixinGLRenderer.LOADING[script];
                    this.__loadScriptArr(codeArr,handler);
                },this);
                req.open("GET", src);
                req.send();
            }
        }
    }
});

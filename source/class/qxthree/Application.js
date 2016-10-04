/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "qxThree"
 *
 */
qx.Class.define("qxthree.Application",
{
    extend: qx.application.Inline,


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
      __webElement: null,
      __glRenderer: null,
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */

      // Document is the application root
      var doc = this.getRoot();

      this.__webElement = document.getElementById("qooxdooDiv");
      
      if(this.__webElement)
          this.__initDiv();
            
      
//      this.glRenderer = new qxthree.GLRenderer();
     // win.add(glRenderer.getRenderer());
          
  //    this.glRenderer.testMethod();

    
      
    },
    
    __initDiv: function()
    {
        var widthDiv = this.__webElement.getAttribute("width");
        var heightDiv = this.__webElement.getAttribute("height");
                              
        if (widthDiv)
            this.__webElement.style.width = widthDiv + "px";
        else {
            widthDiv = this.__webElement.clientWidth;
            
            if (widthDiv == null || widthDiv < 100)
                widthDiv = 800;
            
            this.__webElement.style.width = widthDiv + "px";
        }
            
        if (heightDiv)
            this.__webElement.style.height = heightDiv + "px";
        else {
            heightDiv = this.__webElement.clientHeight;
            
            if (heightDiv == null || heightDiv < 100)
                heightDiv = 600;
            
            this.__webElement.style.height = heightDiv + "px";
        }
               
        this.debug("widthDiv: " + widthDiv);
        this.debug("heightDiv: " + heightDiv);

               
        this.__inlineModule = new qx.ui.root.Inline(this.__webElement, true, true);
        this.__inlineModule.addListener("resize", this.__updateSize, this);
        this.__inlineModule.set({
            backgroundColor : "blue"
        });
        
        this.__glRenderer = new qxthree.GLRenderer(widthDiv, heightDiv, this);
        this.__glRenderer.addListener("sceneCreated", this.create3DScene, this);    
        //this.__glRenderer.init();

        
        var box = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
        box.set({
            backgroundColor : "blue",
                    width : 500,
                    allowShrinkY : false,
                    allowShrinkX : false,
                    height : 500
        });
        
        this.__inlineModule.add(this.__glRenderer);
        //this.__inlineModule.add(box);
    },
    
    
    __updateSize : function(event)
    {        
        this.debug("app::updateSize");
        var width = parseInt(qx.bom.element.Style.get(this.__webElement, 'width'));
        var height = parseInt(qx.bom.element.Style.get(this.__webElement, 'height'));
        
        this.debug("width: " + width);
        this.debug("height: " + height);
      
        if(this.__mainWindow) {
            this.__mainWindow.setWidth(width);
            this.__mainWindow.setHeight(height);    
        }
        
    },

    create3DScene : function(){
        
        
        
        this.debug("create3DScene");
       // return;
        
        
       

       // document.body.appendChild(this.__glRenderer.getRenderer());
        //win.add(chk);
        
//        var test = document.getElementById("qooxdooDiv");
//        if(test)
//            test.appendChild(this.glRenderer.getRenderer());
// 
//        if(chk)
//                chk.appenchild(this.glRenderer.getRenderer());

    }
  }
});

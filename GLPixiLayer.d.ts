
///<reference path="node_modules/@types/leaflet/index.d.ts" />
///<reference path="node_modules/@types/pixi.js/index.d.ts" />
///<reference path="node_modules/@types/gsap/index.d.ts" />
///<reference path="GLPixiLayerElements.ts" />


declare namespace GLPixLayer {

  
  class GLAPP extends PIXI.Application {
    objectContainer : PIXI.Container;
  }

  class GLPixLayer extends L.Layer {
     // public addElement(f : GeoJSON.Feature<GeoJSON.Point>) : GLPixLayer.GLElement;
     /**
      * add a new animated element in the layer
      * @param f the geopoint
      */
     public addAnimatedElement(f : GeoJSON.Feature<GeoJSON.Point>) : JQueryPromise<GLPixLayerElement.AnimatedGLElement>;

     /**
      * 
      * @param element the glelement to put on top of others (change the zindex)
      */
     public placeOnTop(element : GLPixLayer.GLElement) :void;
  }


  class GLElement extends PIXI.Sprite {
    public lon : number ;
    public lat : number ;
    public properties : Object;
    public timeline : gsap.TimelineLite;
    public associatedScale : Object;
  }




}

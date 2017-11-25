
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
     public addAnimatedElement(f : GeoJSON.Feature<GeoJSON.Point>) : JQueryPromise<GLPixLayerElement.AnimatedGLElement>;
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

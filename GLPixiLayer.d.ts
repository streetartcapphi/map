
///<reference path="node_modules/@types/leaflet/index.d.ts" />
///<reference path="node_modules/@types/pixi.js/index.d.ts" />
///<reference path="node_modules/@types/gsap/index.d.ts" />

///<reference path="GLPixiLayerElements.ts" />


declare namespace GLPixLayer {

  class GLAPP extends PIXI.Application {
    objectContainer : PIXI.Container;
  }

  type  UserDefinedDraw =  (
    layer : GLPixLayer,options: {
                            canvas   :HTMLCanvasElement,
                            bounds   : L.Bounds,
                            size     : L.Point,
                            zoomScale: Number,
                            zoom : Number,
                            options: any
                       }
  ) => void;

  class GLPixLayer extends L.Layer {
     public addElement(f : GeoJSON.Feature<GeoJSON.Point>) : GLPixLayer.GLElement;
     public addAnimatedElement(f : GeoJSON.Feature<GeoJSON.Point>) : GLPixLayerElement.AnimatedGLElement;
     public placeOnTop(element : GLPixLayer.GLElement) :void;
  }


  class GLElement extends PIXI.Sprite {
    public lon : Number ;
    public lat : Number ;
    public properties : object;
    public timeline : gsap.TimelineLite;
    public associatedScale : object;
  }




}

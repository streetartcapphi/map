

module GLPixLayerElement {

    class GLElement extends PIXI.Sprite {
      public lon : Number ;
      public lat : Number ;
      public properties : object;
      public timeline : gsap.TimelineLite;
      public associatedScale : object;
    }


   export class AnimatedGLElement extends GLElement {
      public state : State;
      public layer : any; // can't make a typed reference 
   }


   export class State {

      _context : AnimatedGLElement;
      constructor(context : AnimatedGLElement){
        this._context = context;
      };

      public onOver() : void {};
      public onOut() : void {};
      public onClick() : void {};
      public onReplaceElementOnContainer(newx:number, newy:number) : void {};

  }

}

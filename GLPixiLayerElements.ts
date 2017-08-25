

module GLPixLayerElement {

    class GLElement extends PIXI.Sprite {
      // lat / lon position of the element
      public lon : Number ;
      public lat : Number ;
      public properties : object;
      public timeline : gsap.TimelineLite;
      public associatedScale : object;
    }

   // GLElement with an associated state (for animation)
   export class AnimatedGLElement extends GLElement {

      public _state : State;

      public setState(state : State) : void {
      }

      public getState() : State {
        return null;
      }

      public hasState() : boolean {
        return true;
      }

      public setPosition (x:number, y:number) : void {

      }

      public layer : any; // can't make a typed reference
      // original width and hight of the image (permit to handle the scale)
      public originalWidth : number;
      public originalHeight : number;
      public linkAttribute : string;
   }

   // abstract base class for state handling
   export class State {

      // the associated animated element
      _context : AnimatedGLElement;
      
      constructor(context : AnimatedGLElement){
        this._context = context;
      };

      public onOver() : void {};
      public onOut() : void {};
      public onClick() : void {};
      public onReplaceElementOnContainer(newx:number, newy:number) : void {};
      public onChanged(): void {};

      // touch
      public onTouchStart() : void {};
      public onTouchEnd() : void {};
      public onTouchEndOutside() : void {};


  }

}

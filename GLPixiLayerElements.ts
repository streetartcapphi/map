

module GLPixLayerElement {

    class GLElement extends PIXI.Sprite {
      public lon : Number ;
      public lat : Number ;
      public properties : object;
      public timeline : gsap.TimelineLite;
      public associatedScale : object;
    }


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
      public originalWidth : number;
      public originalHeight : number;
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
      public onChanged(): void {};

      // touch
      public onTouchStart() : void {};
      public onTouchEnd() : void {};
      public onTouchEndOutside() : void {};


  }

}

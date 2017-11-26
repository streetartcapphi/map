/// <reference path="GLPixiLayer.ts"/>

module GLPixLayerElement {

  
  export class GLElement extends PIXI.Sprite {
    // lat / lon position of the element
    public lon: number;
    public lat: number;
    public properties: Object;
    public timeline: gsap.TimelineLite;
    public associatedScale: Object;
  }


  // GLElement with an associated state (for animation)
  /**
   * an animated gl element is an extension of a glelement
   containing a state object
   */
  export class AnimatedGLElement extends GLElement {

    public _state: State;

    public setState(state: State): void {
        this._state = state;
    }

    public getState(): State {
      return this._state;
    }

    public hasState(): boolean {
      return this._state != null;
    }

    public setPosition(x: number, y: number): void {
      this.x = x;
      this.y = y;
    }

    public layer: any; // can't make a typed reference
    // original width and hight of the image (permit to handle the scale)
    public originalWidth: number;
    public originalHeight: number;
    public linkAttribute: string;
  }

  // abstract base class for state handling
  export class State {

    // the associated animated element
    _context: AnimatedGLElement;

    constructor(context: AnimatedGLElement) {
      this._context = context;
    };

    public onOver(): void { };
    public onOut(): void { };
    public onClick(): void { };
    public onReplaceElementOnContainer(newx: number, newy: number): void { };
    public onChanged(): void { };

    // touch
    public onTouchStart(): void { };
    public onTouchEnd(): void { };
    public onTouchEndOutside(): void { };


  }

}

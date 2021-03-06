//  Copyright 2017 Patrice Freydiere

//  Permission is hereby granted, free of charge, to any person obtaining a 
//  copy of this software and associated documentation files (the "Software"), 
//  to deal in the Software without restriction, including without limitation 
//  the rights to use, copy, modify, merge, publish, distribute, sublicense, 
//  and/or sell copies of the Software, and to permit persons to whom the 
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in 
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
//  OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
//  DEALINGS IN THE SOFTWARE.


///<reference path="node_modules/@types/leaflet/index.d.ts" />
///<reference path="node_modules/@types/pixi.js/index.d.ts" />
///<reference path="node_modules/@types/gsap/index.d.ts" />
///<reference path="node_modules/@types/jquery/index.d.ts" />

///<reference path="GLPixiLayer.d.ts"/>
///<reference path="GLPixiLayerElements.ts"/>
///<reference path="startext.ts"/>


module App {

  /*
    ambiant declarations
  */
  declare var TweenLite: any;
  declare var Power3: any;
  declare var Elastic: any;
  declare var Bounce: any;
  declare var Sine: any;
  declare var TimelineLite: any;
  declare var TimelineMax: any;


  var glowTexture = PIXI.Texture.fromImage("glow-circle.png");

  /**
   * base class for hight light state, add a glow at the geographic position
   */
  class BaseHightLightState extends GLPixLayerElement.State {


    public glowTimeLine: gsap.TimelineMax;


    constructor(context: GLPixLayerElement.AnimatedGLElement) {
      super(context);
    }


    public addGlowing(): void {


      var s = new PIXI.Sprite(glowTexture);
      s.name = "glow";
      s.anchor.set(0.5);
      s.alpha = 0.7;
      const gscale = 0.5;
      s.scale.set(gscale);
      this._context.addChildAt(s, 0);


      var os: any = {};
      os.setScale = function (value: number) {
        s.scale.set(value);
      };
      os.getScale = function () {
        return s.scale.x;
      };


      this.glowTimeLine = new TimelineMax({
        repeat: 10, onComplete: function () {
          this.restart();
        }
      });

      const gspeed = 0.1;
      this.glowTimeLine.to(os, gspeed, {
        setScale: gscale,
        ease: Sine.easeIn
      }, gspeed).to(os, gspeed, {
        setScale: gscale / 3,
        ease: Sine.easeOut
      });


    }

    public removeGlowing(): void {

      var g = this._context.getChildByName("glow");
      if (g) {
        this._context.removeChild(g);
      }

      if (this.glowTimeLine) {
        this.glowTimeLine.kill();
        this.glowTimeLine = null;
      }

    }


  }


  class TouchHightLightState extends BaseHightLightState {

    public currentTween: gsap.TweenLite;
    public previousNormalState: NormalState;

    constructor(context: GLPixLayerElement.AnimatedGLElement, previousNormalState: NormalState) {
      super(context);
      this.previousNormalState = previousNormalState;
    }

    public onOver(): void {

      if (this.currentTween) {
        // currently on animation,
        // wait
        return;
      }

      // closure
      var t: GLPixLayerElement.AnimatedGLElement = this._context;
      var o: any = {};
      o.setScale = function (value: number) {
        t.scale.set(value);
      };
      o.getScale = function () {
        return t.scale.x;
      };

      // for z order
      (<GLPixLayer.GLPixLayer>t.layer).placeOnTop(t);
      var tthis = this;

      // glow and add associated text
      this.currentTween = TweenLite.to(o, 0.5, {
        setScale: 0.3,
        ease: Power3.easeOut,
        onComplete: function () {
          // at the end of the scaling,
          var st = new Decorators.StarText();
          t.addChild(st);
          st.scale.set(4);
          st.init((<any>t.properties).author as string);
          st.y = t.originalHeight;
          st.x = t.originalWidth / 2;
          st.name = "textarea";

          tthis.currentTween = null;

        }
      });

      // add hoover circle picture
      // with color rotation
      this.addGlowing();

    }

    public onChanged(): void {
      // console.log("on out" + this);
      if (this.currentTween != null) {
        this.currentTween.kill();
        this.currentTween = null;
      }

      var v = this._context.getChildByName("textContainer");
      if (v) {
        this._context.removeChild(v);
      }

      v = this._context.getChildByName("textarea");
      if (v) this._context.removeChild(v);

      this.removeGlowing();

    }

    public onTouchStart(): void {

      // console.log("on out" + this);
      if (this.currentTween != null) {
        this.currentTween.kill();
        this.currentTween = null;
      }

      var tthis = this;
      var t: GLPixLayerElement.AnimatedGLElement = this._context;

      var textContainer = t.getChildByName("textContainer");
      if (textContainer) t.removeChild(textContainer);

      var o: any = {};
      o.setScale = function (value: number) {
        t.scale.set(value);
      };
      o.getScale = function () {
        return t.scale.x;
      };

      // for z order
      (<GLPixLayer.GLPixLayer>t.layer).placeOnTop(t);

      // animate the scale
      this.currentTween = TweenLite.to(o, 0.5, {
        setScale: 0.05,
        ease: Power3.easeOut,
        onComplete: function () {
          // change state
          tthis._context.setState(tthis.previousNormalState);
          // back to move
          tthis.previousNormalState.restartYoyo();
        }
      });

      this.addGlowing();

    }

    public onReplaceElementOnContainer(newx: number, newy: number): void {

      this._context.setPosition(newx, newy);


    };

    public onClick(): void {

    }


  }



  /**
      highlight state handling
  */
  class HightLightState extends BaseHightLightState {

    public currentTween: gsap.TweenLite;
    public previousNormalState: NormalState;

    constructor(context: GLPixLayerElement.AnimatedGLElement, previousNormalState: NormalState) {
      super(context);
      this.previousNormalState = previousNormalState;
    }

    public onOver(): void {


      if (this.currentTween) {
        // currently on animation,
        // wait the end before restart the
        // highlight
        return;
      }

      var t: GLPixLayerElement.AnimatedGLElement = this._context;
      var o: any = {};
      o.setScale = function (value: number) {
        t.scale.set(value);
      };
      o.getScale = function () {
        return t.scale.x;
      };

      // for z order
      (<GLPixLayer.GLPixLayer>t.layer).placeOnTop(t);
      var tthis = this;

      // glow and add associated text
      this.currentTween = TweenLite.to(o, 0.5, {
        setScale: 0.3,
        ease: Power3.easeOut,
        onComplete: function () {

          // at the end of the scaling,
          // show the text

          var st = new Decorators.StarText();
          t.addChild(st);

          st.scale.set(4);
          st.init("by " + (<any>t.properties).author as string);
          st.y = t.originalHeight;
          st.x = t.originalWidth / 2;
          st.name = "textarea";

          tthis.currentTween = null;

        }
      });

      // add hoover circle picture
      // with color rotation
      this.addGlowing();

    }


    public onChanged(): void {
      // console.log("on out" + this);
      if (this.currentTween != null) {
        this.currentTween.kill();
        this.currentTween = null;
      }

      var v = this._context.getChildByName("textContainer");
      if (v) {
        this._context.removeChild(v);
      }

      v = this._context.getChildByName("textarea");
      if (v) {
        this._context.removeChild(v);
        v.destroy();
      }

      this.removeGlowing();

    }

    public onOut(): void {

      // console.log("on out" + this);
      if (this.currentTween != null) {
        this.currentTween.kill();
        this.currentTween = null;
      }

      var tthis = this;
      var t: GLPixLayerElement.AnimatedGLElement = this._context;

      var textContainer = t.getChildByName("textContainer");
      if (textContainer) t.removeChild(textContainer);

      var o: any = {};
      o.setScale = function (value: number) {
        t.scale.set(value);
      };
      o.getScale = function () {
        return t.scale.x;
      };
 
      // for z order
      (<GLPixLayer.GLPixLayer>t.layer).placeOnTop(t);

      // animate the scale
      this.currentTween = TweenLite.to(o, 0.5, {
        setScale: 0.05,
        ease: Power3.easeOut,
        onComplete: function () {
          // change state
          tthis._context.setState(tthis.previousNormalState);
          // back to move
          tthis.previousNormalState.restartYoyo();
        }
      });

    }

    public onReplaceElementOnContainer(newx: number, newy: number): void {
      this._context.setPosition(newx, newy);
    };

    public onClick(): void {
      var linkattribute = this._context.linkAttribute;
      if (this._context.properties.hasOwnProperty(linkattribute)) {
        window.open((<any>this._context.properties)[linkattribute], "_blank");
      } else {
        console.error("object does not have attribute " + linkattribute);
      }
    }

  }

  /**
      Normal state handling
  */
  class NormalState extends GLPixLayerElement.State {

    public currentTween: gsap.TweenLite;
    public timeline: gsap.TimelineMax;
    public randomJump: number;
    public originx: number;
    public originy: number;
    public speed: number;


    constructor(context: GLPixLayerElement.AnimatedGLElement) {
      super(context);
      this.randomJump = Math.random() * 50;
      this.speed = Math.random() + 0.2;
      this.originx = context.x;
      this.originy = context.y;

      // this.timeline.play();
      this.restartYoyo();

    }

    public restartYoyo() {

      if (this.timeline) {
        this.timeline.kill();
      }
      this.timeline = new TimelineMax({
        repeat: 10, onComplete: function () {
          this.restart();
        }
      });

      var t: GLPixLayerElement.AnimatedGLElement = this._context;
      this.timeline.to(t, this.speed, {
        y: t.y - this.randomJump,
        ease: Bounce.easeIn
      }, Math.random()).to(t, this.speed, {
        y: t.y,
        ease: Bounce.easeOut
      });

    }

    public onChanged(): void {

      /*
            if (this.currentTween != null) {
              this.currentTween.kill();
              this.currentTween = null;
            }
      */
      // stop timeline
      this.timeline.kill();

      this._context.setPosition(this.originx, this.originy);
    }


    public onOver(): void {

      // change State
      this._context.setState(new HightLightState(this._context, this));
      this._context.getState().onOver();

    };

    // in case of touch start
    public onTouchStart(): void {
      this._context.setState(new TouchHightLightState(this._context, this));
      this._context.getState().onOver();
    }

    public onOut(): void {

    };

    public onClick(): void {
      // console.log("on click " + this);
    };

    public onReplaceElementOnContainer(newx: number, newy: number): void {
      this.originx = newx;
      this.originy = newy;

      this._context.x = newx;
      this._context.y = newy;

      this.restartYoyo();
    };


  }




  export function main(mapDiv: string) {

    var leafletMap = L.map('map', <any>{
      smoothZoom: true,
      smoothZoomDelay: 1000 //Default to 1000
    }).setView([45.7484600, 4.8467100], 13);

    // create the tile layer with correct attribution
    //var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmUrl = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data @ <a href="http://openstreetmap.org">OpenStreetMap</a> contributors & stamen.com tiles';
    var osm = new L.TileLayer(osmUrl, { minZoom: 0, maxZoom: 19, attribution: osmAttrib })
      .addTo(leafletMap);

    var glLayer = (<GLPixLayer.GLPixLayer>(<any>L).pixiLayer())
      .addTo(leafletMap);

    //
    // add animated elements from json
    // factory method for adding elements
    //
    function addAnimatedElement(jsondata: GeoJSON.Feature<GeoJSON.Point>): JQueryPromise<GLPixLayerElement.AnimatedGLElement> {

      var e = glLayer.addAnimatedElement(jsondata);
      // console.log("load " + e.width + " x " + e.height);
      e.then((c) => {
        // add mask
        var roundedRect = new PIXI.Graphics();
        roundedRect.beginFill(0xcccccccc);

        var rectWidth = c.originalWidth;
        var rectHeight = c.originalHeight;

        roundedRect.drawRoundedRect(0, 0, rectWidth, rectHeight, rectWidth / 5);
        roundedRect.endFill();

        roundedRect.interactive = true;

        var contour = new PIXI.Graphics();
        contour.beginFill(0x000000, 0);
        contour.lineStyle(rectWidth / 100, 0xcccccc, 1);
        contour.drawRoundedRect(0, 0, rectWidth, rectHeight, rectWidth / 5);
        contour.endFill();

        // blur is VERY costy for tablets, deactivated
        //
        // var b = new PIXI.filters.BlurFilter(2);
        // contour.filters = [b];

        var arrow = new PIXI.Graphics();
        arrow.beginFill(0xFF0000);
        // arrow.lineStyle(rectWidth/15, 0x0, 1);
        arrow.moveTo(0, 0);
        arrow.lineTo(rectWidth / 10, 0);
        arrow.lineTo(0, rectWidth / 10);
        arrow.name = "arrow";
        arrow.endFill();



        c.addChild(roundedRect);
        c.addChild(contour);
        c.addChild(arrow);

        var sprite: PIXI.Sprite = <PIXI.Sprite>c.getChildByName("sprite");

        sprite.mask = roundedRect;


        c.scale.set(0.05);
    
      });


      var p = e.promise();

      p.then((e) => { e.setState(new NormalState(e)) });

      return p;
    }

    (<any>L.control).locate({
      strings: {
        title: "Show me where I am, yo!"
      }
    }).addTo(leafletMap);

    // extract parameters for file to display
    var search = location.search.substring(1);
    var URLparams = search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
      function (key, value) { return key === "" ? value : decodeURIComponent(value) }) : {}
    console.log("url params :");
    console.log(URLparams);

    var rel = URLparams.view || "views/cumulbydate/2months/content.geojson";

    var linkattribute = URLparams.linkattribute || "originURL";

    // load datas
    $.ajax({
      url: "https://streetartcapphi.github.io/locations/" + rel,
      dataType: "json"
    }).then(
      data => {
        if (data && data.features) {
          for (var f of data.features) {
            //  console.log("adding");
            //  console.log(f);
            if (f.properties.hasOwnProperty("imageURL") &&
              f.hasOwnProperty('geometry') && f.geometry.type === "Point") {

              var element = addAnimatedElement(f);

              element.then((e) => { e.linkAttribute = linkattribute; });


            } else {
              console.error("feature does not have the needed properties imageURL, and geometry");
              console.error(f);
            }

          }
        } else {
          console.log("error loading the datas");
        }
      }).fail(e => console.error(e));

  }





}

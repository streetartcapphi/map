
///<reference path="node_modules/@types/leaflet/index.d.ts" />
///<reference path="node_modules/@types/pixi.js/index.d.ts" />
///<reference path="node_modules/@types/gsap/index.d.ts" />
///<reference path="node_modules/@types/jquery/index.d.ts" />

///<reference path="GLPixiLayer.d.ts"/>
///<reference path="GLPixiLayerElements.ts"/>


module App {

  declare var TweenLite : any;
  declare var Power3 : any;
  declare var Elastic : any;
  declare var Bounce : any;
  declare var Sine : any;
  declare var TimelineLite : any;
  declare var TimelineMax : any;




    class BaseHightLightState extends GLPixLayerElement.State {

      public glowTimeLine : gsap.TimelineMax;


      constructor(context:GLPixLayerElement.AnimatedGLElement) {
         super(context);
       }


         public addGlowing() : void {


                     var s = PIXI.Sprite.fromImage("glow-circle.png");
                     s.name="glow";
                     s.anchor.set(0.5);
                     s.alpha=0.7;
                     const gscale = 0.5;
                     s.scale.set(gscale);
                     this._context.addChildAt(s,0);


                     var os : any = {};
                     os.setScale = function(value:number) {
                         s.scale.set(value);
                     };
                     os.getScale = function() {
                         return s.scale.x;
                     };


                     this.glowTimeLine  = new TimelineMax({repeat:1000, onComplete:function() {
                         this.restart();
                     }});

                     const gspeed = 0.1;
                     this.glowTimeLine.to(os, gspeed, { setScale: gscale,
                     ease:Sine.easeIn },gspeed).to(os, gspeed, { setScale : gscale/3,
                     ease:Sine.easeOut });


         }

           public removeGlowing():void {

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

    public currentTween : gsap.TweenLite;
    public previousNormalState : NormalState;

    constructor(context:GLPixLayerElement.AnimatedGLElement, previousNormalState : NormalState) {
       super(context);
       this.previousNormalState = previousNormalState;
    }

    public onOver() : void {

      if (this.currentTween) {
         // currently on animation,
         // wait
         return;
      }

      var t : GLPixLayerElement.AnimatedGLElement = this._context;
       var o : any = {};
       o.setScale = function(value:number) {
           t.scale.set(value);
       };
       o.getScale = function() {
           return t.scale.x;
       };

        // for z order
        (<GLPixLayer.GLPixLayer>t.layer).placeOnTop(t);
        var tthis = this;

        // glow and add associated text
        this.currentTween = TweenLite.to(o, 0.5, { setScale:0.3,
            ease:Power3.easeOut,
            onComplete : function () {
  /*
              var textContainer = new PIXI.Container();

              var props  =<any> t.properties;
              var content = "";
              for (var p in props ) {
                if (content != "") {
                  content = content + "\n";
                }
                content = content + p + ":" + props[p];
              }

              var textSample = new PIXI.Text(content, {
                  fontFamily: 'Arial',
                  fontSize: 100,
                  fill: 'black',
                  align: 'left'
              });
              textContainer.x = 800;
              textSample.y = - textSample.height / 2

              // background

              var infos = new PIXI.Graphics();
              infos.beginFill(0xFFFFFF);
              infos.moveTo(0,0);
              infos.lineStyle(2, 0xcccccc, 1);
              infos.lineTo(textSample.width,0);
              infos.lineTo(textSample.width,textSample.height);
              infos.lineTo(0,textSample.height);
              infos.lineTo(0,0);
              infos.endFill();
              infos.y = -textSample.height/2;

              textContainer.addChild(infos);
              textContainer.addChild(textSample);

              textContainer.alpha = 0;
              TweenLite.to(textContainer, 0.4, {alpha : 1});

              t.addChild(textContainer);
              textContainer.name = "textContainer";
  */
              tthis.currentTween = null;

            }
          });

          // add hoover circle picture
          // with color rotation
          this.addGlowing();

    }

    public onChanged() : void {
            // console.log("on out" + this);
            if (this.currentTween != null) {
              this.currentTween.kill();
              this.currentTween = null;
            }

            var v = this._context.getChildByName("textContainer");
            if (v) {
              this._context.removeChild(v);
            }

            this.removeGlowing();

    }

    public onTouchStart() : void {

      // console.log("on out" + this);
      if (this.currentTween != null) {
        this.currentTween.kill();
        this.currentTween = null;
      }

      var tthis = this;
      var t : GLPixLayerElement.AnimatedGLElement = this._context;

      var textContainer = t.getChildByName("textContainer");
      if (textContainer) t.removeChild(textContainer);

      var o : any = {};
      o.setScale = function(value:number) {
          t.scale.set(value);
      };
      o.getScale = function() {
          return t.scale.x;
      };

     // for z order
     (<GLPixLayer.GLPixLayer>t.layer).placeOnTop(t);

     // animate the scale
     this.currentTween = TweenLite.to(o, 0.5, { setScale:0.05,
         ease:Power3.easeOut,
         onComplete:function() {
           // change state
           tthis._context.setState(tthis.previousNormalState);
           // back to move
           tthis.previousNormalState.restartYoyo();
         }
         });

         this.addGlowing();

    }

    public onReplaceElementOnContainer(newx:number, newy:number) : void {

      this._context.setPosition(newx, newy);


    };

    public onClick() : void {

    }


  }



  /**
      highlight state handling
  */
  class HightLightState extends BaseHightLightState {

    public currentTween : gsap.TweenLite;
    public previousNormalState : NormalState;

    constructor(context:GLPixLayerElement.AnimatedGLElement, previousNormalState : NormalState) {
       super(context);
       this.previousNormalState = previousNormalState;
    }

    public onOver() : void {


      if (this.currentTween) {
         // currently on animation,
         // wait
         return;
      }

      var t : GLPixLayerElement.AnimatedGLElement = this._context;
       var o : any = {};
       o.setScale = function(value:number) {
           t.scale.set(value);
       };
       o.getScale = function() {
           return t.scale.x;
       };

        // for z order
        (<GLPixLayer.GLPixLayer>t.layer).placeOnTop(t);
        var tthis = this;

        // glow and add associated text
        this.currentTween = TweenLite.to(o, 0.5, { setScale:0.3,
            ease:Power3.easeOut,
            onComplete : function () {
/*
              var textContainer = new PIXI.Container();

              var props  =<any> t.properties;
              var content = "";
              for (var p in props ) {
                if (content != "") {
                  content = content + "\n";
                }
                content = content + p + ":" + props[p];
              }

              var textSample = new PIXI.Text(content, {
                  fontFamily: 'Arial',
                  fontSize: 100,
                  fill: 'black',
                  align: 'left'
              });
              textContainer.x = 800;
              textSample.y = - textSample.height / 2

              // background

              var infos = new PIXI.Graphics();
              infos.beginFill(0xFFFFFF);
              infos.moveTo(0,0);
              infos.lineStyle(2, 0xcccccc, 1);
              infos.lineTo(textSample.width,0);
              infos.lineTo(textSample.width,textSample.height);
              infos.lineTo(0,textSample.height);
              infos.lineTo(0,0);
              infos.endFill();
              infos.y = -textSample.height/2;

              textContainer.addChild(infos);
              textContainer.addChild(textSample);

              textContainer.alpha = 0;
              TweenLite.to(textContainer, 0.4, {alpha : 1});

              t.addChild(textContainer);
              textContainer.name = "textContainer";
*/
              tthis.currentTween = null;

            }
          });

          // add hoover circle picture
          // with color rotation
          this.addGlowing();

    }


    public onChanged() : void {
            // console.log("on out" + this);
            if (this.currentTween != null) {
              this.currentTween.kill();
              this.currentTween = null;
            }

            var v = this._context.getChildByName("textContainer");
            if (v) {
              this._context.removeChild(v);
            }

            this.removeGlowing();

    }

    public onOut() : void {

      // console.log("on out" + this);
      if (this.currentTween != null) {
        this.currentTween.kill();
        this.currentTween = null;
      }

      var tthis = this;
      var t : GLPixLayerElement.AnimatedGLElement = this._context;

      var textContainer = t.getChildByName("textContainer");
      if (textContainer) t.removeChild(textContainer);

      var o : any = {};
      o.setScale = function(value:number) {
          t.scale.set(value);
      };
      o.getScale = function() {
          return t.scale.x;
      };

     // for z order
     (<GLPixLayer.GLPixLayer>t.layer).placeOnTop(t);

     // animate the scale
     this.currentTween = TweenLite.to(o, 0.5, { setScale:0.05,
         ease:Power3.easeOut,
         onComplete:function() {
           // change state
           tthis._context.setState(tthis.previousNormalState);
           // back to move
           tthis.previousNormalState.restartYoyo();
         }
         });

    }

    public onReplaceElementOnContainer(newx:number, newy:number) : void {
      this._context.setPosition(newx, newy);
    };

    public onClick() : void {
        var linkattribute = this._context.linkAttribute;
        if (this._context.properties.hasOwnProperty(linkattribute)) {
          window.open( (<any> this._context.properties)[linkattribute], "_blank");
        } else {
          console.error("object does not have attribute " + linkattribute);
        }
    }

  }

  /**
      Normal state handling
  */
  class NormalState extends GLPixLayerElement.State {

    public currentTween : gsap.TweenLite;
    public timeline : gsap.TimelineMax;
    public randomJump : number;
    public originx : number;
    public originy : number;
    public speed : number;


    constructor(context:GLPixLayerElement.AnimatedGLElement ) {
      super(context);
      this.randomJump = Math.random() * 50;
      this.speed =Math.random() + 0.2;
      this.originx = context.x;
      this.originy = context.y;

        // this.timeline.play();
      this.restartYoyo();

    }

    public restartYoyo() {

      if (this.timeline) {
        this.timeline.kill();
      }
      this.timeline = new TimelineMax({repeat:10, onComplete:function() {
          this.restart();
      }});

      var t : GLPixLayerElement.AnimatedGLElement = this._context;
        this.timeline.to(t, this.speed, { y: t.y - this.randomJump,
        ease:Bounce.easeIn }, Math.random()).to(t, this.speed, { y: t.y,
        ease:Bounce.easeOut });

    }

    public onChanged() : void {

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


    public onOver() : void {

      // change State
      this._context.setState(new HightLightState(this._context, this));
      this._context.getState().onOver();

    };

    // in case of touch start
    public onTouchStart() : void {
      this._context.setState(new TouchHightLightState(this._context, this));
      this._context.getState().onOver();
    }

    public onOut() : void {

    };

    public onClick() : void {
      // console.log("on click " + this);
    };

    public onReplaceElementOnContainer(newx:number, newy:number) : void {
      this.originx = newx;
      this.originy = newy;

      this._context.x = newx;
      this._context.y = newy;

      this.restartYoyo();
    };


  }




  export function main(mapDiv : string) {

       var leafletMap = L.map('map',<any>{
            smoothZoom: true,
            smoothZoomDelay: 1000 //Default to 1000
        }).setView([45.7484600, 4.8467100], 13);

       // create the tile layer with correct attribution
       //var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
       var osmUrl='http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';
       var osmAttrib='Map data � <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
       var osm = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 19, attribution: osmAttrib})
                           .addTo(leafletMap);

       var glLayer = (<GLPixLayer.GLPixLayer>(<any> L).pixiLayer())
                      .addTo(leafletMap);

       //
       // add animated elements from json
       //
       function addAnimatedElement(jsondata : GeoJSON.Feature<GeoJSON.Point>) : GLPixLayerElement.AnimatedGLElement {
          var e = glLayer.addAnimatedElement(jsondata);
          // console.log("load " + e.width + " x " + e.height);
          e.setState(new NormalState(e));

          return e;
       }



   /*
       addElement({
                 "type": "Feature",
                 "properties": {
                   "marker-color": "#7e7e7e",
                   "marker-size": "medium",
                   "marker-symbol": "marker-stroked",
                   "imageURL": "https://scontent-cdg2-1.cdninstagram.com/t51.2885-15/e35/18094732_1291332437623744_8591123503372042240_n.jpg",
                   "author": "cap_phi",
                   "post_date": "2017-04-30",
                   "publish_date": "2017-05-30",
                   "iconURL": "https://scontent-cdg2-1.cdninstagram.com/t51.2885-15/e35/18094732_1291332437623744_8591123503372042240_n.jpg",
                   "duration_days": 60,
                   "location_precision_m": 5,
                   "originURL": "https://www.instagram.com/p/BTIuRx3BukU",
                   "calculated_end_date": "2017-06-30"
                 },
                 "geometry": {
                   "type": "Point",
                   "coordinates": [
                     4.8638105392456055,
                     45.76135569917077
                   ]
                 }
               });
   */

 // fromgist

 /*
       $.ajax({
           url:"https://api.github.com/gists/36c8fdc1e8c8341f1ffd27e54e36d43d",
           dataType:"json"
       }).then(
          data => {
                $.ajax({url:data.files["street_art_post.geojson"].raw_url ,
                         dataType:"json"
                       }).then(data => {
                                if (data && data.features) {
                                    for (var f of data.features) {
                                       //  console.log("adding");
                                       //  console.log(f);
                                        addAnimatedElement(f);
                                    }
                                } else {
                                    console.log("error loading the datas");
                                }
                            }).fail( e => console.error(e));

         }
       );
*/

//
// leafletMap.locate({setView: true, watch: true}) /* This will return map so you can do chaining */
//       .on('locationfound', function(e : any){
//           var marker = L.marker([e.latitude, e.longitude]).bindPopup('Your are here :)');
//           var circle = L.circle([e.latitude, e.longitude], e.accuracy/2, {
//               weight: 1,
//               color: 'blue',
//               fillColor: '#cacaca',
//               fillOpacity: 0.2
//           });
//           leafletMap.addLayer(marker);
//           leafletMap.addLayer(circle);
//       })
//      .on('locationerror', function(e){
//           console.log(e);
//           alert("Location access denied.");
//       });
//

      (<any>L.control).locate({
          strings: {
              title: "Show me where I am, yo!"
          }
      }).addTo(leafletMap);

      // extract parameters for file to display
      var search = location.search.substring(1);
      var URLparams = search?JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
                 function(key, value) { return key===""?value:decodeURIComponent(value) }):{}
      console.log("url params :" );
      console.log(URLparams);

      var rel = URLparams.view || "capphi.geojson";

      var linkattribute = URLparams.linkattribute || "originURL";

      // load datas
       $.ajax({
          url:"https://streetartcapphi.github.io/locations/" + rel,
            dataType:"json"
       }).then(
         data => {
                  if (data && data.features) {
                      for (var f of data.features) {
                         //  console.log("adding");
                         //  console.log(f);
                         if (f.properties.hasOwnProperty("imageURL") &&
                              f.hasOwnProperty('geometry') && f.geometry.type === "Point") {

                              var element = addAnimatedElement(f);
                              //
                              // var e = element.getChildByName("sprite");
                              // if (e) {
                              //     var blurFilter  = new PIXI.filters.BlurFilter();
                              //     blurFilter.blur = 0.5;
                              //     e.filters = [blurFilter];
                              // }
                              element.linkAttribute = linkattribute;

                         } else {
                           console.error("feature does not have the needed properties");
                           console.error(f);
                         }

                      }
                  } else {
                      console.log("error loading the datas");
                  }
              }).fail( e => console.error(e));

  }





}


///<reference path="node_modules/@types/leaflet/index.d.ts" />
///<reference path="node_modules/@types/pixi.js/index.d.ts" />
///<reference path="node_modules/@types/gsap/index.d.ts" />
///<reference path="node_modules/@types/jquery/index.d.ts" />

///<reference path="GLPixiLayer.d.ts"/>


module App {

  declare var TweenLite : any;
  declare var Power3 : any;
  declare var Elastic : any;
  declare var TimelineLite : any;



  class HightLightState extends GLPixLayerElement.State {

    constructor(context:GLPixLayerElement.AnimatedGLElement) {
       super(context);
    }


  }

  class NormalState extends GLPixLayerElement.State {
    constructor(context:GLPixLayerElement.AnimatedGLElement) {
      super(context);
    }

    public onOver() : void {
      console.log("on over " + this);
    };
    public onOut() : void {
      console.log("on out" + this);
    };
    public onClick() : void {
      console.log("on click " + this);
    };
    public onReplaceElementOnContainer(newx:number, newy:number) : void {
      this._context.x = newx;
      this._context.y = newy;
    };


  }




  export function main(mapDiv : string) {

       var leafletMap = L.map('map',<any>{
            smoothZoom: true,
            smoothZoomDelay: 1000 //Default to 1000
        }).setView([45.80, 4.8], 12);

       // create the tile layer with correct attribution
       //var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
       var osmUrl='http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';
       var osmAttrib='Map data � <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
       var osm = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 19, attribution: osmAttrib})
                           .addTo(leafletMap);

       var glLayer = (<GLPixLayer.GLPixLayer>(<any> L).pixiLayer())
                      .addTo(leafletMap);


       function addAnimatedElement(jsondata : GeoJSON.Feature<GeoJSON.Point>) {
           var e = glLayer.addAnimatedElement(jsondata);

          e.state = new NormalState(e);


       }



       function addElement(jsondata : GeoJSON.Feature<GeoJSON.Point>) {

                   var e = glLayer.addElement(jsondata);

                   var o : any = {};
                   o.setScale = function(value:number) {
                       e.scale.set(value);
                   };
                   o.getScale = function() {
                       return e.scale.x;
                   }
                   e.associatedScale = o;

                   // animate element
                   e.on('pointerover', function() {

                      // for z order
                      glLayer.placeOnTop(e);

                      TweenLite.to(o, 0.5, { setScale:0.3,
                          ease:Power3.easeOut
                          });

   /*
                       var tweens = TweenLite.getTweensOf(o);
                       console.log(tweens);
                       for (i of tweens) {
                           console.log("" + i + " active ? " + i.isActive());
                       }
   */

                       }).on('pointerout', function() {

                           TweenLite.to(o, 0.5, { setScale:0.05,
                                ease:Power3.easeOut
                           });
                       }).on("click", function() {
                           console.log("clicked");
                           window.open(this.properties.originURL, "_blank");
                       });

                        // apparition
                           TweenLite.from(e, 2, { x:-1000 - 500 * Math.random(),
                                ease:Elastic.easeOut ,
                                delay:2
                           });



                   e.on('touchstart', function() {

                      glLayer.placeOnTop(e);
                      var t : gsap.TimelineLite = e.timeline;
                      if (!t) {
                          t = new TimelineLite();
                      }

                      if (!t.isActive())
                      {
                      t.to(o, 1, { setScale:0.3,
                          ease:Power3.easeOut
                          });
                      var curry = e.y;
                      t.to(e, 1, { y:curry - 300,
                          ease:Power3.easeOut
                          }, "-=1");

                       t.to(o, 0.5, { setScale:0.05,
                                ease:Power3.easeOut
                           });
                      t.to(e, 0.5, { y:curry,
                          ease:Power3.easeOut
                          },"-=0.5");
                      }
                      e.timeline = t;
                   });

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


       $.ajax({
           url:"https://api.github.com/gists/36c8fdc1e8c8341f1ffd27e54e36d43d",
           dataType:"json",
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

  }





}

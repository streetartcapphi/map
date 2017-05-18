
///<reference path="node_modules/@types/leaflet/index.d.ts" />
///<reference path="node_modules/@types/pixi.js/index.d.ts" />
///<reference path="node_modules/@types/gsap/index.d.ts" />
///<reference path="GLPixiLayer.d.ts"/>
///<reference path="GLPixiLayerElements.ts"/>
///<reference path="node_modules/@types/jquery/index.d.ts" />


/*
 Based on Generic  Canvas Overlay for leaflet,
 Stanislav Sumbera, April , 2014

 integration of PIXI objects , Patrice Freydiere 2017-05

*/
declare var TweenLite : gsap.TweenLite;

(<any>L).PixiLayer = L.Layer.extend({

    initialize: function (userDefinedDraw?: GLPixLayer.UserDefinedDraw, options? : object) {
        this._userDrawFunc = userDefinedDraw;
        options = options || {
           zoomAnimation:false };
        (<any>L).setOptions(this, options);
    },

    drawing: function (userDrawFunc: GLPixLayer.UserDefinedDraw) {
        this._userDrawFunc = userDrawFunc;
        return this;
    },

    params:function(options : object) {
        (<any>L).setOptions(this, options);
        return this;
    },

    canvas: function () : HTMLCanvasElement {
        return this._canvas;
    },

    objectContainer: function() {
        if (this._app) {
            return this._app.objectContainer;
        }
        return null;
    },

    placeOnTop: function(element : GLPixLayer.GLElement) {
        var cont = this.objectContainer();
        if (cont) {
            cont.removeChild(element);
            cont.addChild(element);
        }
    },


    redraw: function () {
        if (!this._frame) {
            this._frame = L.Util.requestAnimFrame(this._redraw, this);
        }
        return this;
    },


    onAdd: function (map : L.Map) {
        this._map = map;
        this._canvas = L.DomUtil.create('canvas', 'leaflet-heatmap-layer');

        //this.addEventParent(map);

        var size = this._map.getSize();
        this._canvas.width = size.x;
        this._canvas.height = size.y;

        var animated = this._map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));


        (<any>map)._panes.overlayPane.appendChild(this._canvas);

        // create the pixi context
        //

        var app : GLPixLayer.GLAPP = <GLPixLayer.GLAPP>new PIXI.Application(this._canvas.clientWidth,
                                        this._canvas.clientHeight,
                                        {
                                            view: this._canvas,
                                            transparent: true
                                        });
        app.start();
        this._app = app;

        var container = new PIXI.Container();
        app.objectContainer = container;
        container.interactive = true;
        this._updateContainerPos();

        app.stage.addChild(container);

        // object container
        this._elements = [];


        /////////////////////////////////////////////
        // events

        map.on('moveend', this._reset, this);
        map.on('resize',  this._resize, this);

        if (map.options.zoomAnimation && L.Browser.any3d) {
            map.on('zoomanim', this._animateZoom, this);
        }

        this._reset();
    },

    _updateContainerPos: function() {
        var app = this._app;
        var container = app.objectContainer;

        container.x = (app.renderer.width - container.width) / 2;
        container.y = (app.renderer.height - container.height) / 2;
    },

    onRemove: function (map : L.Map) {

        if (this._app) {
            this._app.stop();
            this._app.destroy(false);
            this._app = null;
        }

        map.getPanes().overlayPane.removeChild(this._canvas);

        map.off('moveend', this._reset, this);
        map.off('resize', this._resize, this);

        if (map.options.zoomAnimation) {
            map.off('zoomanim', this._animateZoom, this);
        }



        this._canvas = null;

    },

    addAnimatedElement:function(f : GeoJSON.Feature<GeoJSON.Point>) : JQueryPromise< GLPixLayerElement.AnimatedGLElement> {
      // checks on elements

      var lon = f.geometry && f.geometry.coordinates[0];
      var lat = f.geometry && f.geometry.coordinates[1];
      var image = (<any>f.properties)['imageURL'];
      var texture : PIXI.Texture = PIXI.Texture.fromImage(image);
      var sprite : GLPixLayerElement.AnimatedGLElement = <GLPixLayerElement.AnimatedGLElement> (new PIXI.Sprite(texture));
      var c : GLPixLayerElement.AnimatedGLElement = <any>new PIXI.Container();
      c.interactive = true;

      var promise = $.Deferred();
      var tthis = this;

      //called when the texture is loaded
      function updateSize() {

          c.scale.set(0.05);
          c.originalWidth = texture.baseTexture.width;
          c.originalHeight = texture.baseTexture.height;
          // console.log(sprite.originalWidth + " x " + sprite.originalHeight);
            promise.resolve(c);
          tthis._app.objectContainer.addChild(c);


      }

      if (texture.baseTexture.hasLoaded) {
          //console.log("hasloaded");
          updateSize();
      } else {
          texture.baseTexture.addListener("update", updateSize);
      }

      c.lon = lon;
      c.lat = lat;
      c.interactive = true;
      c.properties = f.properties;


      sprite.name="sprite";
      c.addChild(sprite);


      c.layer = this;

      c.addChild(sprite);

      this._elements.push(c); // remember


      // add state behaviour

      c.on("pointerover", ()=>{
          if (c.hasState()) {
            c.getState().onOver();
          }
      });

      c.on("pointerout", ()=>{
          if (c.hasState()) {
            c.getState().onOut();
          }
      });

      c.on("click", ()=> {
        if (c.hasState()) {
          c.getState().onClick();
        }
      });

      // touch
      // .on('touchstart', onButtonDown)
            // .on('touchend', onButtonUp)
            // .on('touchendoutside', onButtonUp)
      c.on("touchstart", () => {
        if (c.hasState()) {
          c.getState().onTouchStart();
        }

      });

      c.on("touchend", () => {
        if (c.hasState()) {
          c.getState().onTouchEnd();
        }


      });

      c.on("touchendoutside", () => {
        if (c.hasState()) {
          c.getState().onTouchEndOutside();
        }


      });

      // mixin

      c.setState = (state : GLPixLayerElement.State) : void => {
        if (c._state) {
          c._state.onChanged();
          c._state = null;
        }
        c._state = state;
      }

      c.getState = () : GLPixLayerElement.State => {
        return c._state;
      }
      c.hasState = () : boolean => {
        return c._state != null && !(typeof c._state === 'undefined');
      }

      c.setPosition = (x:number, y:number) : void => {
        c.x = x;
        c.y = y;
      };

      c.setState(null);

      this._adjustSpritePosition(c);

      return promise.promise();
    },


    addTo: function (map:L.Map) {
        map.addLayer(this);
        return this;
    },

    _resize: function (resizeEvent : L.ResizeEvent) {
        this._canvas.width  = resizeEvent.newSize.x;
        this._canvas.height = resizeEvent.newSize.y;
        if (this._app) {
            var renderer = this._app.renderer;
            renderer.resize(this._canvas.clientWidth,
                            this._canvas.clientHeight);
            this._updateContainerPos();
        }
    },

    _reset: function () {
        var topLeft = (<L.Map>this._map).containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);
        this._redraw();
    },

    _redraw: function () {

        var size   : L.Point  = this._map.getSize();
        var bounds : L.LatLngBounds  = this._map.getBounds();
        var zoomScale : number  = (size.x * 180) / (20037508.34  * (bounds.getEast() - bounds.getWest())); // resolution = 1/zoomScale
        var zoom : number = this._map.getZoom();

        //console.time('process');

        if (this._userDrawFunc) {
            this._userDrawFunc(this,
                                {
                                    canvas   :this._canvas,
                                    bounds   : bounds,
                                    size     : size,
                                    zoomScale: zoomScale,
                                    zoom : zoom,
                                    options: this.options
                               });
        }


        if (this._app && this._map && this._app.objectContainer) {
            var container = (<GLPixLayer.GLAPP>this._app).objectContainer;
            // move the children
            for (var i in container.children) {
                  var s = container.children[i];
                  this._adjustSpritePosition(s);
            }
            this._app.render();
        }


        // console.timeEnd('process');
        this._frame = null;
    },

    _adjustSpritePosition: function(pixiObject:GLPixLayer.GLElement) {

          var canvas = this._canvas;
          var dot = this._map.latLngToContainerPoint([pixiObject.lat, pixiObject.lon]);

          // if (pixiObject.hasOwnProperty('_state')) { // animated mixin

              var a : GLPixLayerElement.AnimatedGLElement = <GLPixLayerElement.AnimatedGLElement>pixiObject;
              if (a.hasState()) {
                // delegate position to state
                a.getState().onReplaceElementOnContainer(dot.x - canvas.clientWidth/2, dot.y - canvas.clientHeight/2);
              } else {
                a.setPosition(dot.x - canvas.clientWidth/2, dot.y - canvas.clientHeight/2);
              }

          // }

          /*else {

              // if object has a timeline
              var timeline : gsap.TimelineLite = pixiObject.timeline;
              if (timeline) {
                  timeline.clear();
                 timeline.set(pixiObject, {x : dot.x - canvas.clientWidth/2});
                 timeline.set(pixiObject, {y : dot.y - canvas.clientHeight/2});
              } else {
                  (<any>TweenLite).set(pixiObject, {x : dot.x - canvas.clientWidth/2});
                  (<any>TweenLite).set(pixiObject, {y : dot.y - canvas.clientHeight/2});
              }

          }*/

    },

    _animateZoom: function (e : L.ZoomAnimEvent) {
        var scale = this._map.getZoomScale(e.zoom),
            offset = this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());

        //L.DomUtil.setTransform(this._canvas, offset,scale);

        //this._canvas.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';

    }
});


(<any>L).pixiLayer = function (userDrawFunc? : GLPixLayer.UserDefinedDraw, options? : object) {
    return new (<any>L).PixiLayer(userDrawFunc, options);
};

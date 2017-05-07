
/*
 Based on Generic  Canvas Overlay for leaflet, 
 Stanislav Sumbera, April , 2014


  

*/


L.PixiLayer = L.Layer.extend({

    initialize: function (userDefinedDraw, options) {
        this._userDrawFunc = userDefinedDraw;
        options = options ||{
           zoomAnimation:false }
        L.setOptions(this, options);
    },

    drawing: function (userDrawFunc) {
        this._userDrawFunc = userDrawFunc;
        return this;
    },

    params:function(options){
        L.setOptions(this, options);
        return this;
    },

    canvas: function () {
        return this._canvas;
    },

    redraw: function () {
        if (!this._frame) {
            this._frame = L.Util.requestAnimFrame(this._redraw, this);
        }
        return this;
    },

    getEvents: function() {
        
        return {
            'mousemove' : this.mouseMove
        };

    },    

    mouseMove: function (e) {

    },
  
    onAdd: function (map) {
        this._map = map;
        this._canvas = L.DomUtil.create('canvas', 'leaflet-heatmap-layer');

        //this.addEventParent(map);

        var size = this._map.getSize();
        this._canvas.width = size.x;
        this._canvas.height = size.y;

        var animated = this._map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));


        map._panes.overlayPane.appendChild(this._canvas);

        // create the pixi context
        //

        var app = new PIXI.Application(this._canvas.clientWidth,
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

    onRemove: function (map) {

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

    addElement:function(f) {
     
       // checks on elements
       var lon = f.geometry && f.geometry.coordinates[0];
       var lat = f.geometry && f.geometry.coordinates[1];
       var image = f.properties.imageURL;
       var sprite = PIXI.Sprite.fromImage(image);
       sprite.lon = lon;
       sprite.lat = lat;
       sprite.interactive = true;
       sprite.properties = f.properties;
       sprite.anchor.set(0.5);
       sprite.scale.set(0.05);

       this._elements.push(sprite); // remember
       this._adjustSpritePosition(sprite);
       this._app.objectContainer.addChild(sprite);
       return sprite;            
    },

    addTo: function (map) {
        map.addLayer(this);
        return this;
    },

    _resize: function (resizeEvent) {
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
        var topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);
        this._redraw();
    },

    _redraw: function () {
        var size     = this._map.getSize();
        var bounds   = this._map.getBounds();
        var zoomScale = (size.x * 180) / (20037508.34  * (bounds.getEast() - bounds.getWest())); // resolution = 1/zoomScale
        var zoom = this._map.getZoom();
     
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
            var container = this._app.objectContainer;
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

    _adjustSpritePosition: function(pixiObject) {
          var canvas = this._canvas;
          var dot = this._map.latLngToContainerPoint([pixiObject.lat, pixiObject.lon]);
          pixiObject.x = dot.x - canvas.clientWidth / 2;
          pixiObject.y = dot.y - canvas.clientHeight / 2;
    },

    _animateZoom: function (e) {
        var scale = this._map.getZoomScale(e.zoom),
            offset = this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());

        //L.DomUtil.setTransform(this._canvas, offset,scale);

        //this._canvas.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';

    } 
});

L.pixiLayer = function (userDrawFunc, options) {
    return new L.PixiLayer(userDrawFunc, options);
};



L.PixiLayer = L.Layer.extend({
    initialize: function (userDefinedDraw, options) {
        this._userDrawFunc = userDefinedDraw;
        options = options || {
            zoomAnimation: false
        };
        L.setOptions(this, options);
    },
    drawing: function (userDrawFunc) {
        this._userDrawFunc = userDrawFunc;
        return this;
    },
    params: function (options) {
        L.setOptions(this, options);
        return this;
    },
    canvas: function () {
        return this._canvas;
    },
    objectContainer: function () {
        if (this._app) {
            return this._app.objectContainer;
        }
        return null;
    },
    placeOnTop: function (element) {
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
    onAdd: function (map) {
        this._map = map;
        this._canvas = L.DomUtil.create('canvas', 'leaflet-heatmap-layer');
        var size = this._map.getSize();
        this._canvas.width = size.x;
        this._canvas.height = size.y;
        var animated = this._map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));
        map._panes.overlayPane.appendChild(this._canvas);
        var app = new PIXI.Application(this._canvas.clientWidth, this._canvas.clientHeight, {
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
        this._elements = [];
        map.on('moveend', this._reset, this);
        map.on('resize', this._resize, this);
        if (map.options.zoomAnimation && L.Browser.any3d) {
            map.on('zoomanim', this._animateZoom, this);
        }
        this._reset();
    },
    _updateContainerPos: function () {
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
    addElement: function (f) {
        var lon = f.geometry && f.geometry.coordinates[0];
        var lat = f.geometry && f.geometry.coordinates[1];
        var image = f.properties['imageURL'];
        var sprite = PIXI.Sprite.fromImage(image);
        sprite.lon = lon;
        sprite.lat = lat;
        sprite.interactive = true;
        sprite.properties = f.properties;
        sprite.anchor.set(0.5);
        sprite.scale.set(0.05);
        this._elements.push(sprite);
        this._adjustSpritePosition(sprite);
        this._app.objectContainer.addChild(sprite);
        return sprite;
    },
    addAnimatedElement: function (f) {
        var lon = f.geometry && f.geometry.coordinates[0];
        var lat = f.geometry && f.geometry.coordinates[1];
        var image = f.properties['imageURL'];
        var sprite = PIXI.Sprite.fromImage(image);
        sprite.lon = lon;
        sprite.lat = lat;
        sprite.interactive = true;
        sprite.properties = f.properties;
        sprite.anchor.set(0.5);
        sprite.scale.set(0.05);
        this._elements.push(sprite);
        this._adjustSpritePosition(sprite);
        this._app.objectContainer.addChild(sprite);
        sprite.state = null;
        sprite.on("pointerover", function () {
            if (sprite.state) {
                sprite.state.onOver();
            }
        });
        sprite.on("pointerout", function () {
            if (sprite.state) {
                sprite.state.onOut();
            }
        });
        sprite.on("click", function () {
            if (sprite.state) {
                sprite.state.onClick();
            }
        });
        return sprite;
    },
    addTo: function (map) {
        map.addLayer(this);
        return this;
    },
    _resize: function (resizeEvent) {
        this._canvas.width = resizeEvent.newSize.x;
        this._canvas.height = resizeEvent.newSize.y;
        if (this._app) {
            var renderer = this._app.renderer;
            renderer.resize(this._canvas.clientWidth, this._canvas.clientHeight);
            this._updateContainerPos();
        }
    },
    _reset: function () {
        var topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);
        this._redraw();
    },
    _redraw: function () {
        var size = this._map.getSize();
        var bounds = this._map.getBounds();
        var zoomScale = (size.x * 180) / (20037508.34 * (bounds.getEast() - bounds.getWest()));
        var zoom = this._map.getZoom();
        if (this._userDrawFunc) {
            this._userDrawFunc(this, {
                canvas: this._canvas,
                bounds: bounds,
                size: size,
                zoomScale: zoomScale,
                zoom: zoom,
                options: this.options
            });
        }
        if (this._app && this._map && this._app.objectContainer) {
            var container = this._app.objectContainer;
            for (var i in container.children) {
                var s = container.children[i];
                this._adjustSpritePosition(s);
            }
            this._app.render();
        }
        this._frame = null;
    },
    _adjustSpritePosition: function (pixiObject) {
        var canvas = this._canvas;
        var dot = this._map.latLngToContainerPoint([pixiObject.lat, pixiObject.lon]);
        if (pixiObject.hasOwnProperty('state')) {
            var a = pixiObject;
            if (a.state) {
                a.state.onReplaceElementOnContainer(dot.x - canvas.clientWidth / 2, dot.y - canvas.clientHeight / 2);
            }
        }
        else {
            var timeline = pixiObject.timeline;
            if (timeline) {
                timeline.clear();
                timeline.set(pixiObject, { x: dot.x - canvas.clientWidth / 2 });
                timeline.set(pixiObject, { y: dot.y - canvas.clientHeight / 2 });
            }
            else {
                TweenLite.set(pixiObject, { x: dot.x - canvas.clientWidth / 2 });
                TweenLite.set(pixiObject, { y: dot.y - canvas.clientHeight / 2 });
            }
        }
    },
    _animateZoom: function (e) {
        var scale = this._map.getZoomScale(e.zoom), offset = this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());
    }
});
L.pixiLayer = function (userDrawFunc, options) {
    return new L.PixiLayer(userDrawFunc, options);
};
//# sourceMappingURL=GLPixiLayer.js.map
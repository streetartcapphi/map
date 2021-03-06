L.PixiLayer = L.Layer.extend({
    initialize: function (options) {
        options = options || {
            zoomAnimation: false
        };
        L.setOptions(this, options);
    },
    drawing: function () {
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
    addAnimatedElement: function (f) {
        var lon = f.geometry && f.geometry.coordinates[0];
        var lat = f.geometry && f.geometry.coordinates[1];
        if (!f.properties) {
            throw new Error("geojson element must have non null properties");
        }
        var image = f.properties['imageURL'];
        if (!image) {
            throw new Error("image must have an imageURL property");
        }
        var texture = PIXI.Texture.fromImage(image);
        var sprite = (new PIXI.Sprite(texture));
        var c = new PIXI.Container();
        c.interactive = true;
        var promise = $.Deferred();
        var tthis = this;
        function updateSize() {
            c.scale.set(0.05);
            c.originalWidth = texture.baseTexture.width;
            c.originalHeight = texture.baseTexture.height;
            promise.resolve(c);
            tthis._app.objectContainer.addChild(c);
        }
        if (texture.baseTexture.hasLoaded) {
            updateSize();
        }
        else {
            texture.baseTexture.addListener("update", updateSize);
        }
        c.lon = lon;
        c.lat = lat;
        c.interactive = true;
        c.properties = f.properties;
        sprite.name = "sprite";
        c.layer = this;
        c.addChild(sprite);
        this._elements.push(c);
        var mmapping = {
            "pointerover": "onOver",
            "pointerout": "onOut",
            "click": "onClick",
            "touchstart": "onTouchStart",
            "touchend": "onTouchEnd",
            "touchendoutside": "onTouchEndOutside"
        };
        var _loop_1 = function () {
            var eventName = "" + p;
            var f_1 = function () {
                if (c.hasState()) {
                    var s = c.getState();
                    var m = s[mmapping[eventName]];
                    m.apply(s);
                }
            };
            c.on(eventName, f_1);
        };
        for (var p in mmapping) {
            _loop_1();
        }
        c.setState = function (state) {
            if (c._state) {
                c._state.onChanged();
                c._state = null;
            }
            c._state = state;
        };
        c.getState = function () {
            return c._state;
        };
        c.hasState = function () {
            return c._state != null && !(typeof c._state === 'undefined');
        };
        c.setPosition = function (x, y) {
            c.x = x;
            c.y = y;
        };
        c.setState(null);
        this._adjustSpritePosition(c);
        return promise.promise();
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
        this._center = this._map.getCenter();
        this._zoom = this._map.getZoom();
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
        var a = pixiObject;
        if (a.hasState()) {
            a.getState().onReplaceElementOnContainer(dot.x - canvas.clientWidth / 2, dot.y - canvas.clientHeight / 2);
        }
        else {
            a.setPosition(dot.x - canvas.clientWidth / 2, dot.y - canvas.clientHeight / 2);
        }
    },
    _animateZoom: function (e) {
        var center = e.center;
        var zoom = e.zoom;
        var scale = this._map.getZoomScale(zoom, this._zoom), position = L.DomUtil.getPosition(this._canvas), viewHalf = this._map._size.multiplyBy(0.5), currentCenterPoint = this._map.project(this._center, zoom), destCenterPoint = this._map.project(center, zoom), centerOffset = destCenterPoint.subtract(currentCenterPoint), topLeftOffset = viewHalf.multiplyBy(-scale).add(position).add(viewHalf).subtract(centerOffset);
        if (L.Browser.any3d) {
            L.DomUtil.setTransform(this._canvas, topLeftOffset, scale);
        }
        else {
            L.DomUtil.setPosition(this._canvas, topLeftOffset);
        }
    }
});
L.pixiLayer = function (options) {
    return new L.PixiLayer(options);
};
//# sourceMappingURL=GLPixiLayer.js.map
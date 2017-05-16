var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var App;
(function (App) {
    var TouchHightLightState = (function (_super) {
        __extends(TouchHightLightState, _super);
        function TouchHightLightState(context, previousNormalState) {
            var _this = _super.call(this, context) || this;
            _this.previousNormalState = previousNormalState;
            return _this;
        }
        TouchHightLightState.prototype.onOver = function () {
            var t = this._context;
            var o = {};
            o.setScale = function (value) {
                t.scale.set(value);
            };
            o.getScale = function () {
                return t.scale.x;
            };
            t.layer.placeOnTop(t);
            this.currentTween = TweenLite.to(o, 0.5, { setScale: 0.3,
                ease: Power3.easeOut,
                onComplete: function () {
                }
            });
        };
        TouchHightLightState.prototype.onChanged = function () {
            if (this.currentTween != null) {
                this.currentTween.kill();
                this.currentTween = null;
            }
            var v = this._context.getChildByName("textContainer");
            if (v) {
                this._context.removeChild(v);
            }
        };
        TouchHightLightState.prototype.onTouchStart = function () {
            if (this.currentTween != null) {
                this.currentTween.kill();
                this.currentTween = null;
            }
            var tthis = this;
            var t = this._context;
            var textContainer = t.getChildByName("textContainer");
            if (textContainer)
                t.removeChild(textContainer);
            var o = {};
            o.setScale = function (value) {
                t.scale.set(value);
            };
            o.getScale = function () {
                return t.scale.x;
            };
            t.layer.placeOnTop(t);
            this.currentTween = TweenLite.to(o, 0.5, { setScale: 0.05,
                ease: Power3.easeOut,
                onComplete: function () {
                    tthis._context.setState(tthis.previousNormalState);
                    tthis.previousNormalState.restartYoyo();
                }
            });
        };
        TouchHightLightState.prototype.onReplaceElementOnContainer = function (newx, newy) {
            this._context.setPosition(newx, newy);
        };
        ;
        TouchHightLightState.prototype.onClick = function () {
        };
        return TouchHightLightState;
    }(GLPixLayerElement.State));
    var HightLightState = (function (_super) {
        __extends(HightLightState, _super);
        function HightLightState(context, previousNormalState) {
            var _this = _super.call(this, context) || this;
            _this.previousNormalState = previousNormalState;
            return _this;
        }
        HightLightState.prototype.onOver = function () {
            if (this.currentTween) {
                return;
            }
            var t = this._context;
            var o = {};
            o.setScale = function (value) {
                t.scale.set(value);
            };
            o.getScale = function () {
                return t.scale.x;
            };
            t.layer.placeOnTop(t);
            var tthis = this;
            this.currentTween = TweenLite.to(o, 0.5, { setScale: 0.3,
                ease: Power3.easeOut,
                onComplete: function () {
                    tthis.currentTween = null;
                }
            });
        };
        HightLightState.prototype.onChanged = function () {
            if (this.currentTween != null) {
                this.currentTween.kill();
                this.currentTween = null;
            }
            var v = this._context.getChildByName("textContainer");
            if (v) {
                this._context.removeChild(v);
            }
        };
        HightLightState.prototype.onOut = function () {
            if (this.currentTween != null) {
                this.currentTween.kill();
                this.currentTween = null;
            }
            var tthis = this;
            var t = this._context;
            var textContainer = t.getChildByName("textContainer");
            if (textContainer)
                t.removeChild(textContainer);
            var o = {};
            o.setScale = function (value) {
                t.scale.set(value);
            };
            o.getScale = function () {
                return t.scale.x;
            };
            t.layer.placeOnTop(t);
            this.currentTween = TweenLite.to(o, 0.5, { setScale: 0.05,
                ease: Power3.easeOut,
                onComplete: function () {
                    tthis._context.setState(tthis.previousNormalState);
                    tthis.previousNormalState.restartYoyo();
                }
            });
        };
        HightLightState.prototype.onReplaceElementOnContainer = function (newx, newy) {
            this._context.setPosition(newx, newy);
        };
        ;
        HightLightState.prototype.onClick = function () {
            window.open(this._context.properties['originURL'], "_blank");
        };
        return HightLightState;
    }(GLPixLayerElement.State));
    var NormalState = (function (_super) {
        __extends(NormalState, _super);
        function NormalState(context) {
            var _this = _super.call(this, context) || this;
            _this.randomJump = Math.random() * 50;
            _this.speed = Math.random() + 0.2;
            _this.originx = context.x;
            _this.originy = context.y;
            _this.restartYoyo();
            return _this;
        }
        NormalState.prototype.restartYoyo = function () {
            if (this.timeline) {
                this.timeline.kill();
            }
            this.timeline = new TimelineMax({ repeat: 10, onComplete: function () {
                    this.restart();
                } });
            var t = this._context;
            this.timeline.to(t, this.speed, { y: t.y - this.randomJump,
                ease: Bounce.easeIn }, Math.random()).to(t, this.speed, { y: t.y,
                ease: Bounce.easeOut });
        };
        NormalState.prototype.onChanged = function () {
            this.timeline.kill();
            this._context.setPosition(this.originx, this.originy);
        };
        NormalState.prototype.onOver = function () {
            this._context.setState(new HightLightState(this._context, this));
            this._context.getState().onOver();
        };
        ;
        NormalState.prototype.onTouchStart = function () {
            this._context.setState(new TouchHightLightState(this._context, this));
            this._context.getState().onOver();
        };
        NormalState.prototype.onOut = function () {
        };
        ;
        NormalState.prototype.onClick = function () {
        };
        ;
        NormalState.prototype.onReplaceElementOnContainer = function (newx, newy) {
            this.originx = newx;
            this.originy = newy;
            this._context.x = newx;
            this._context.y = newy;
            this.restartYoyo();
        };
        ;
        return NormalState;
    }(GLPixLayerElement.State));
    function main(mapDiv) {
        var leafletMap = L.map('map', {
            smoothZoom: true,
            smoothZoomDelay: 1000
        }).setView([45.7484600, 4.8467100], 13);
        var osmUrl = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';
        var osmAttrib = 'Map data � <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, { minZoom: 0, maxZoom: 19, attribution: osmAttrib })
            .addTo(leafletMap);
        var glLayer = L.pixiLayer()
            .addTo(leafletMap);
        function addAnimatedElement(jsondata) {
            var e = glLayer.addAnimatedElement(jsondata);
            e.setState(new NormalState(e));
            return e;
        }
        L.control.locate({
            strings: {
                title: "Show me where I am, yo!"
            }
        }).addTo(leafletMap);
        $.ajax({
            url: "https://streetartcapphi.github.io/locations/capphi.geojson",
            dataType: "json"
        }).then(function (data) {
            if (data && data.features) {
                for (var _i = 0, _a = data.features; _i < _a.length; _i++) {
                    var f = _a[_i];
                    if (f.properties.hasOwnProperty("imageURL") &&
                        f.hasOwnProperty('geometry') && f.geometry.type === "Point") {
                        var element = addAnimatedElement(f);
                    }
                    else {
                        console.error("feature does not have the needed properties");
                        console.error(f);
                    }
                }
            }
            else {
                console.log("error loading the datas");
            }
        }).fail(function (e) { return console.error(e); });
    }
    App.main = main;
})(App || (App = {}));
//# sourceMappingURL=app.js.map
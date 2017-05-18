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
    var glowTexture = PIXI.Texture.fromImage("glow-circle.png");
    var BaseHightLightState = (function (_super) {
        __extends(BaseHightLightState, _super);
        function BaseHightLightState(context) {
            return _super.call(this, context) || this;
        }
        BaseHightLightState.prototype.addGlowing = function () {
            var s = new PIXI.Sprite(glowTexture);
            s.name = "glow";
            s.anchor.set(0.5);
            s.alpha = 0.7;
            var gscale = 0.5;
            s.scale.set(gscale);
            this._context.addChildAt(s, 0);
            var os = {};
            os.setScale = function (value) {
                s.scale.set(value);
            };
            os.getScale = function () {
                return s.scale.x;
            };
            this.glowTimeLine = new TimelineMax({ repeat: 10, onComplete: function () {
                    this.restart();
                } });
            var gspeed = 0.1;
            this.glowTimeLine.to(os, gspeed, { setScale: gscale,
                ease: Sine.easeIn }, gspeed).to(os, gspeed, { setScale: gscale / 3,
                ease: Sine.easeOut });
        };
        BaseHightLightState.prototype.removeGlowing = function () {
            var g = this._context.getChildByName("glow");
            if (g) {
                this._context.removeChild(g);
            }
            if (this.glowTimeLine) {
                this.glowTimeLine.kill();
                this.glowTimeLine = null;
            }
        };
        return BaseHightLightState;
    }(GLPixLayerElement.State));
    var TouchHightLightState = (function (_super) {
        __extends(TouchHightLightState, _super);
        function TouchHightLightState(context, previousNormalState) {
            var _this = _super.call(this, context) || this;
            _this.previousNormalState = previousNormalState;
            return _this;
        }
        TouchHightLightState.prototype.onOver = function () {
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
            this.addGlowing();
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
            this.removeGlowing();
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
            this.addGlowing();
        };
        TouchHightLightState.prototype.onReplaceElementOnContainer = function (newx, newy) {
            this._context.setPosition(newx, newy);
        };
        ;
        TouchHightLightState.prototype.onClick = function () {
        };
        return TouchHightLightState;
    }(BaseHightLightState));
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
            this.addGlowing();
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
            this.removeGlowing();
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
            var linkattribute = this._context.linkAttribute;
            if (this._context.properties.hasOwnProperty(linkattribute)) {
                window.open(this._context.properties[linkattribute], "_blank");
            }
            else {
                console.error("object does not have attribute " + linkattribute);
            }
        };
        return HightLightState;
    }(BaseHightLightState));
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
            e.then(function (c) {
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
                var arrow = new PIXI.Graphics();
                arrow.beginFill(0xFF0000);
                arrow.moveTo(0, 0);
                arrow.lineTo(rectWidth / 10, 0);
                arrow.lineTo(0, rectWidth / 10);
                arrow.name = "arrow";
                arrow.endFill();
                c.addChild(roundedRect);
                c.addChild(contour);
                c.addChild(arrow);
                var sprite = c.getChildByName("sprite");
                sprite.mask = roundedRect;
                c.scale.set(0.05);
            });
            var p = e.promise();
            p.then(function (e) { e.setState(new NormalState(e)); });
            return p;
        }
        L.control.locate({
            strings: {
                title: "Show me where I am, yo!"
            }
        }).addTo(leafletMap);
        var search = location.search.substring(1);
        var URLparams = search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) { return key === "" ? value : decodeURIComponent(value); }) : {};
        console.log("url params :");
        console.log(URLparams);
        var rel = URLparams.view || "capphi.geojson";
        var linkattribute = URLparams.linkattribute || "originURL";
        $.ajax({
            url: "https://streetartcapphi.github.io/locations/" + rel,
            dataType: "json"
        }).then(function (data) {
            if (data && data.features) {
                for (var _i = 0, _a = data.features; _i < _a.length; _i++) {
                    var f = _a[_i];
                    if (f.properties.hasOwnProperty("imageURL") &&
                        f.hasOwnProperty('geometry') && f.geometry.type === "Point") {
                        var element = addAnimatedElement(f);
                        element.then(function (e) { e.linkAttribute = linkattribute; });
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
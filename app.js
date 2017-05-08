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
    var HightLightState = (function (_super) {
        __extends(HightLightState, _super);
        function HightLightState(context, previousNormalState) {
            var _this = _super.call(this, context) || this;
            _this.previousNormalState = previousNormalState;
            return _this;
        }
        HightLightState.prototype.onOver = function () {
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
                    var textContainer = new PIXI.Container();
                    var props = t.properties;
                    var content = "";
                    for (var p in props) {
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
                    textSample.y = -textSample.height / 2;
                    var infos = new PIXI.Graphics();
                    infos.beginFill(0xFFFFFF);
                    infos.moveTo(0, 0);
                    infos.lineStyle(2, 0xcccccc, 1);
                    infos.lineTo(textSample.width, 0);
                    infos.lineTo(textSample.width, textSample.height);
                    infos.lineTo(0, textSample.height);
                    infos.lineTo(0, 0);
                    infos.endFill();
                    infos.y = -textSample.height / 2;
                    textContainer.addChild(infos);
                    textContainer.addChild(textSample);
                    textContainer.alpha = 0;
                    TweenLite.to(textContainer, 0.4, { alpha: 1 });
                    t.addChild(textContainer);
                }
            });
        };
        HightLightState.prototype.onOut = function () {
            if (this.currentTween != null) {
                this.currentTween.kill();
                this.currentTween = null;
            }
            var tthis = this;
            var t = this._context;
            t.removeChildren();
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
                    tthis._context.state = tthis.previousNormalState;
                    tthis.previousNormalState.restartYoyo();
                }
            });
        };
        HightLightState.prototype.onReplaceElementOnContainer = function (newx, newy) {
            this._context.x = newx;
            this._context.y = newy;
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
        NormalState.prototype.onOver = function () {
            if (this.currentTween != null) {
                this.currentTween.kill();
                this.currentTween = null;
            }
            this.timeline.kill();
            this._context.x = this.originx;
            this._context.y = this.originy;
            this._context.state = new HightLightState(this._context, this);
            this._context.state.onOver();
        };
        ;
        NormalState.prototype.onOut = function () {
        };
        ;
        NormalState.prototype.onClick = function () {
            console.log("on click " + this);
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
        }).setView([45.80, 4.8], 12);
        var osmUrl = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';
        var osmAttrib = 'Map data � <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, { minZoom: 0, maxZoom: 19, attribution: osmAttrib })
            .addTo(leafletMap);
        var glLayer = L.pixiLayer()
            .addTo(leafletMap);
        function addAnimatedElement(jsondata) {
            var e = glLayer.addAnimatedElement(jsondata);
            console.log("load " + e.width + " x " + e.height);
            e.state = new NormalState(e);
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
                    addAnimatedElement(f);
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
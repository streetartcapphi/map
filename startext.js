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
var Decorators;
(function (Decorators) {
    var StarText = (function (_super) {
        __extends(StarText, _super);
        function StarText() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.margin = 5;
            _this.ti = 0.6;
            return _this;
        }
        StarText.prototype.init = function (content) {
            var textContainer = new PIXI.Container();
            var textSample = new PIXI.Text(content, {
                fontFamily: 'Arial',
                fontSize: 13,
                fill: 'black',
                align: 'left'
            });
            textSample.y = 0 - textSample.height / 2 + this.margin;
            textSample.x = this.margin;
            this.textwidth = textSample.width;
            var g = new PIXI.Graphics();
            g.beginFill(0xcccccc);
            g.drawRoundedRect(0, -textSample.height / 2, textSample.width + 3 * this.margin, textSample.height + 2 * this.margin, 5);
            g.endFill();
            textContainer.addChild(g);
            textContainer.addChild(textSample);
            this.addChild(textContainer);
            textContainer.alpha = 0;
            textContainer.name = "textContainer";
            var s = new PIXI.Sprite(PIXI.Texture.fromImage("Star.png"));
            s.anchor.set(0.5);
            s.scale.set(0.01);
            this.addChild(s);
            var timeline = new TimelineMax();
            timeline.add(TweenLite.to(textContainer, this.ti, { alpha: 0 }));
            timeline.add(TweenLite.to(s, this.ti, { x: textSample.width + 3 * this.margin,
                y: -textSample.height / 2, ease: Bounce.easeOut }));
            timeline.add(TweenLite.to(textContainer, this.ti, { alpha: 1, ease: Power3.easeOut }), "=-" + this.ti);
            timeline.play();
        };
        return StarText;
    }(PIXI.Container));
    Decorators.StarText = StarText;
})(Decorators || (Decorators = {}));
//# sourceMappingURL=startext.js.map
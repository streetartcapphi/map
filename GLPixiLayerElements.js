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
var GLPixLayerElement;
(function (GLPixLayerElement) {
    var GLElement = (function (_super) {
        __extends(GLElement, _super);
        function GLElement() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return GLElement;
    }(PIXI.Sprite));
    var AnimatedGLElement = (function (_super) {
        __extends(AnimatedGLElement, _super);
        function AnimatedGLElement() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AnimatedGLElement;
    }(GLElement));
    GLPixLayerElement.AnimatedGLElement = AnimatedGLElement;
    var State = (function () {
        function State(context) {
            this._context = context;
        }
        ;
        State.prototype.onOver = function () { };
        ;
        State.prototype.onOut = function () { };
        ;
        State.prototype.onClick = function () { };
        ;
        State.prototype.onReplaceElementOnContainer = function (newx, newy) { };
        ;
        return State;
    }());
    GLPixLayerElement.State = State;
})(GLPixLayerElement || (GLPixLayerElement = {}));
//# sourceMappingURL=GLPixiLayerElements.js.map
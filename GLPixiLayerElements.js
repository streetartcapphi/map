var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GLPixLayerElement;
(function (GLPixLayerElement) {
    var GLElement = (function (_super) {
        __extends(GLElement, _super);
        function GLElement() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return GLElement;
    }(PIXI.Sprite));
    GLPixLayerElement.GLElement = GLElement;
    var AnimatedGLElement = (function (_super) {
        __extends(AnimatedGLElement, _super);
        function AnimatedGLElement() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AnimatedGLElement.prototype.setState = function (state) {
            this._state = state;
        };
        AnimatedGLElement.prototype.getState = function () {
            return this._state;
        };
        AnimatedGLElement.prototype.hasState = function () {
            return this._state != null;
        };
        AnimatedGLElement.prototype.setPosition = function (x, y) {
            this.x = x;
            this.y = y;
        };
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
        State.prototype.onChanged = function () { };
        ;
        State.prototype.onTouchStart = function () { };
        ;
        State.prototype.onTouchEnd = function () { };
        ;
        State.prototype.onTouchEndOutside = function () { };
        ;
        return State;
    }());
    GLPixLayerElement.State = State;
})(GLPixLayerElement || (GLPixLayerElement = {}));
//# sourceMappingURL=GLPixiLayerElements.js.map
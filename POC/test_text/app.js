var TestApp;
(function (TestApp) {
    function main(divName) {
        var e = document.getElementById(divName);
        var app = new PIXI.Application(e.clientWidth, e.clientHeight, {
            view: e,
            transparent: true
        });
        var s = new Decorators.StarText();
        s.y = 300;
        s.x = 40;
        app.stage.addChild(s);
        s.init("caphi");
    }
    TestApp.main = main;
})(TestApp || (TestApp = {}));
//# sourceMappingURL=app.js.map
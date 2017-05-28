
///<reference path="../../node_modules/@types/pixi.js/index.d.ts" />
///<reference path="../../node_modules/@types/gsap/index.d.ts" />
///<reference path="../../node_modules/@types/jquery/index.d.ts" />
///<reference path="startext.ts" />

module TestApp {



  export function main(divName: string) {

    var e = document.getElementById(divName);

    var app = new PIXI.Application(e.clientWidth,
      e.clientHeight,
      {
        view: <any>e,
        transparent: true
      });

    var s :Decorators.StarText = new Decorators.StarText();
    s.y = 300;
    s.x = 40;
    app.stage.addChild(s);
    s.init("caphi");


  }



}

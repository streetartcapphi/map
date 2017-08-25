

module Decorators {


    declare var TweenLite : any;
    declare var Power3 : any;
    declare var Elastic : any;
    declare var Bounce : any;
    declare var Sine : any;
    declare var TimelineLite : any;
    declare var TimelineMax : any;



  export class StarText extends PIXI.Container {

    margin = 5;


    public init(content : string) {


            var textContainer = new PIXI.Container();

            var textSample = new PIXI.Text(content, {
                fontFamily: 'Arial',
                fontSize: 13,
                fill: 'black',
                align: 'left'
            });


            textSample.y = 0 - textSample.height/2 + this. margin;
            textSample.x = this.margin;


            // background

            var g = new PIXI.Graphics();
            g.beginFill(0xcccccc);
            g.drawRoundedRect(0,-textSample.height/2,textSample.width + 3 * this.margin,textSample.height + 2*this.margin, 5);
            g.endFill();


           textContainer.addChild(g);
            textContainer.addChild(textSample);
            this.addChild(textContainer);

            textContainer.alpha = 0;
            // TweenLite.to(textContainer, 0.4, {alpha : 1});


            textContainer.name = "textContainer";


            var s = new PIXI.Sprite(PIXI.Texture.fromImage("Star.png"));
            s.anchor.set( 0.5);
            s.scale.set(0.01);
            // s.y = -textSample.height/2;

            this.addChild(s);

            var ti = 1;
            let timeline : gsap.TimelineMax = new TimelineMax();

            timeline.add(TweenLite.to(textContainer,ti,{alpha:0}));

            timeline.add(TweenLite.to(s,ti, {x:textSample.width + 3*this.margin,
              y : -textSample.height/2, ease: Bounce.easeOut}));
            timeline.add(TweenLite.to(textContainer, ti, {alpha : 1, ease: Power3.easeOut}), "=-" + ti);

            timeline    .play();

    }


  }


}

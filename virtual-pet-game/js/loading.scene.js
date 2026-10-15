/// <reference path="./types/index.d.ts" />


class LoadingScene extends Phaser.Scene {
    init(){
        this.bg = this.add.rectangle(0,0,this.sys.game.config.width,this.sys.game.config.height,0x0095ff);
        this.bg.setOrigin(0,0);

        this.bgBar = this.add.rectangle(0,0,200,30,0xA9A9A9);
        Phaser.Display.Align.In.Center(this.bgBar,this.bg);

        this.progressBar = this.add.rectangle(0,0,0,30,0x03fc0f);
        Phaser.Display.Align.In.LeftCenter(this.progressBar,this.bgBar);

        this.load.on(Phaser.Loader.Events.PROGRESS, (progress) => {
            this.progressBar.setSize(progress*200,30);
            Phaser.Display.Align.In.LeftCenter(this.progressBar,this.bgBar);
        });
    }

    preload(){
        for (let i = 0; i < 1000; i++) {
            this.load.image('apple'+i,'assets/apple.png');
            
        }
        this.load.image('apple','assets/apple.png');
        this.load.image('candy','assets/candy.png');
        this.load.image('rotate','assets/rotate.png');
        this.load.image('duck','assets/rubber_duck.png');
        this.load.image('background','assets/backyard.png');
        

        this.load.spritesheet('pet','assets/pet.png',{
            frameWidth:97,
            frameHeight:83,
            spacing:1,
            margin:1
        });
    }

    create(){
        this.scene.start('home');
    }

}
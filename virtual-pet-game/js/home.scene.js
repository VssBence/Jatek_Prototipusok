/// <reference path="./types/index.d.ts" />

class HomeSchene extends Phaser.Scene {
    create(){
        this.bg = this.add.sprite(0,0,'background').setOrigin(0,0);

        this.homeText = this.add.text(0,0,'START GAME',{
            fontFamily: 'Arial',
            fontSize: 28
        });
        this.homeText.setDepth(1);

        Phaser.Display.Align.In.Center(this.homeText,this.bg);

        this.textBg = this.add.rectangle(
            0,0,
            this.homeText.width + 20, 
            this.homeText.height + 20,
            0x000000,0.5);
        Phaser.Display.Align.In.Center(this.textBg,this.homeText);

        this.input.on(Phaser.Input.Events.POINTER_DOWN,() => this.scene.start('game'));
    }
}
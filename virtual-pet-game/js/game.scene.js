/// <reference path="./types/index.d.ts" />

class GameScene extends Phaser.Scene{
    init(){
        this.stats = { health: 100,fun:100};
        this.selectedItem = null;
        this.uiBlocked = false;
        this.statsDecay = {
            health: -10,
            fun: -10
        }
    }



    create(){
        this.bg = this.add.sprite(0,0,'background').setOrigin(0,0).setInteractive();

        this.bg.on(Phaser.Input.Events.POINTER_DOWN,(pointer,x,y) =>{
            this.placeItem(x,y);
        })

        this.pet = this.add.sprite(100,200,'pet').setInteractive({draggable: true});

        this.anims.create({
            key: 'fun',
            frames: this.anims.generateFrameNames('pet',{
                frames:[1, 2, 3]
            }),
            frameRate:7,
            yoyo:true
        });

        this.input.on(Phaser.Input.Events.DRAG,(pointer,gameObj,dragX,dragY) => {
            gameObj.setPosition(dragX,dragY);
        });

        this.createUi();

        this.statsText = this.add.text(80,20,'Health: 100 Fun: 100', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#F00'
        });


        this.displayStats();

        this.decreaseStats = this.time.addEvent({
            delay:1000,
            repeat: -1,
            callback: () => {
                this.updateStats(this.statsDecay);
            }
        })
    }

    createUi(){
        this.appleBtn = this.add.sprite(72,570,'apple').setInteractive();
        this.appleBtn.on(Phaser.Input.Events.POINTER_DOWN, () => this.pickItem(this.appleBtn));
        this.appleBtn.setData('stats',{health:20,fun:0});

        this.candyBtn = this.add.sprite(144,570,'candy').setInteractive();
        this.candyBtn.on(Phaser.Input.Events.POINTER_DOWN, () => this.pickItem(this.candyBtn));
        this.candyBtn.setData('stats',{health:-10,fun:20});


        this.toyBtn = this.add.sprite(216,570,'duck').setInteractive();
        this.toyBtn.on(Phaser.Input.Events.POINTER_DOWN, () => this.pickItem(this.toyBtn));
        this.toyBtn.setData('stats',{health:5,fun:10});

        this.rotateBtn = this.add.sprite(288,570,'rotate').setInteractive();
        this.rotateBtn.on(Phaser.Input.Events.POINTER_DOWN, () => this.rotatePet());
        this.rotateBtn.setData('stats',{health:0,fun:10});

    }

    setUiReady(){
        this.selectedItem = null;
        this.appleBtn.setAlpha(1);
        this.candyBtn.setAlpha(1);
        this.toyBtn.setAlpha(1);
        this.rotateBtn.setAlpha(1);
        this.uiBlocked = false;
    }

    pickItem(item){

        if(this.uiBlocked){
            return;
        }
        this.setUiReady();
        this.selectedItem = item;
        item.setAlpha(0.7);
        
    }

    placeItem(x,y){
        if(!this.selectedItem || this.uiBlocked){
            return;
        }
        this.uiBlocked = true;

        const newItem = this.add.sprite(x,y,this.selectedItem.texture.key);

        this.tweens.add({
            targets:this.pet,
            x: newItem.x,
            y: newItem.y,
            duration:500,
            onComplete: () => {
                newItem.destroy();
                this.pet.play('fun');

                this.pet.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.updateStats(this.selectedItem.getData('stats'));
                    this.setUiReady();
                    this.pet.removeAllListeners(Phaser.Animations.Events.ANIMATION_COMPLETE);
                })


            }
        })

    }

    rotatePet(){
        if(this.uiBlocked){
            return;
        }
        this.setUiReady();
        this.uiBlocked = true;
        this.selectedItem = this.rotateBtn;
        this.rotateBtn.setAlpha(0.7);

        this.tweens.add({
            targets: this.pet,
            angle: 360,
            duration: 700,
            onComplete: () => {
                this.updateStats(this.selectedItem.getData('stats'));
                this.setUiReady();
            }
        })

    }

    updateStats(delta){
        this.stats.health += delta.health;
        this.stats.fun += delta.fun;

        if(this.stats.health <=0 || this.stats.fun <=0){
            this.stats.health = 0;
            this.stats.fun = 0;

            this.gameOver();
        }


        console.log(this.stats);
        this.displayStats();
    }

    displayStats(){
        this.statsText.setText(`Health: ${this.stats.health} Fun: ${this.stats.fun}`);
    }

    gameOver(){
        this.decreaseStats.destroy();

        this.tweens.killTweensOf(this.pet);

        this.pet.stop();

        this.pet.setFrame(4);

        this.uiBlocked = true;

        this.time.addEvent({
            delay: 2000,
            repeat: 0,
            callback: () => {
                this.scene.start('home');
            }
        })

    }
}
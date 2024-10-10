class EscenaHorizontal extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaHorizontal' });
        this.jugador = null;
        this.cursors = null;
        this.puntaje = 0;
        this.textoPuntaje = 0;
    }

    preload() {
        this.load.image('space2', '/public/resources/space2.png');
        this.load.image('proyectil', '/public/resources/bullet1.png');
        //this.load.image('nave', '/public/resources/SS2.png');
        this.load.image('meteoro2', '/public/resources/meteoroA.png');
        this.load.audio('MusicaFondo', '/public/resources/MusicaFondo.mp3');
        this.load.audio('disparo', '/public/resources/disparoS.mp3');
        this.load.audio('explosion', '/public/resources/explosion1.mp3');
        this.load.spritesheet('nave', '/public/resources/sheep-Sheet.png', { frameWidth: 32, frameHeight: 30 })
    }

    create() {
        this.add.image(400, 300, 'space2');
        this.jugador = this.physics.add.sprite(20, 300, 'nave');
        this.jugador.setCollideWorldBounds(true);

        this.grupoProyectiles = this.physics.add.group(); // Crear el grupo de proyectiles
        this.teclaDisparo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.teclaEspacio = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.grupoMeteoros = this.physics.add.group();
        this.time.addEvent({ delay: 1000, callback: this.generarMeteoros, callbackScope: this, loop: true });
        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.jugador, this.grupoMeteoros, this.gameOver, null, this);
        this.physics.add.collider(this.grupoProyectiles, this.grupoMeteoros, this.destruirMeteoro, null, this);

        this.anims.create({
            key: 'down',
            frames: [{ key: 'nave', frame: 0 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'normal',
            frames: [{ key: 'nave', frame: 1 }],
            frameRate: 20
        })

        this.anims.create({
            key: 'up',
            frames: [{ key: 'nave', frame: 2 }],
            frameRate: 20
        })

        this.textoPuntaje = this.add.text(16, 16, 'Puntaje: 0', { fontSize: '32px', fill: '#fff' });

        this.MusicaFondo = this.sound.add('MusicaFondo', { loop: true });
        this.MusicaFondo.play();
    }

    

    generarMeteoros() {
        const y = Phaser.Math.Between(0, 600);
        const meteoro = this.grupoMeteoros.create(600, y, 'meteoro2');
        meteoro.setVelocityX(-100);
    }

    gameOver(jugador) {
        this.physics.pause(); 
        jugador.setTint(0xff0000);
        console.log('Game Over');
        this.scene.start('GameOver', { puntaje: this.puntaje });
        this.MusicaFondo.stop();
    }
    disparar() {
        const proyectil = this.grupoProyectiles.create(this.jugador.x, this.jugador.y, 'proyectil');
        proyectil.setVelocityX(400); // Ajusta la velocidad hacia arriba (puedes modificar este valor)
        this.sound.play('disparo');
    }
    destruirMeteoro(proyectil, meteoro) {
        proyectil.destroy(); // Destruye el proyectil
        meteoro.destroy(); // Destruye el meteoro
        this.sound.play('explosion');
        this.puntaje += 400; // Aumenta el puntaje o realiza cualquier otra acción que desees
        this.textoPuntaje.setText('Puntaje: ' + this.puntaje); // Actualiza el puntaje en pantalla
    }

    update() {
        this.jugador.setVelocityX(0);
        this.jugador.setVelocityY(0);
        
        if (this.cursors.right.isDown) {
            this.jugador.setVelocityX(200);
        }else if(this.cursors.left.isDown){
            this.jugador.setVelocityX(-200)
        }

        if (this.cursors.up.isDown) {
            this.jugador.setVelocityY(-150);
            this.jugador.anims.play('up', true);
        } else if (this.cursors.down.isDown) {
            this.jugador.setVelocityY(150);
            this.jugador.anims.play('down', true);
        }else{
            this.jugador.anims.play('normal', true);
        }

        this.puntaje += 1;
        this.textoPuntaje.setText('Puntaje: ' + this.puntaje); 

        if (Phaser.Input.Keyboard.JustDown(this.teclaDisparo) || Phaser.Input.Keyboard.JustDown(this.teclaEspacio)) {
            this.disparar();
        }
    }
}
export default EscenaHorizontal;
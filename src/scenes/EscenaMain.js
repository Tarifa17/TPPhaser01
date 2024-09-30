class EscenaMain extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaMain' });
        this.jugador = null;
        this.cursors = null;
        this.puntaje = 0;
        this.textoPuntaje = 0;
    }

    preload() {
        this.load.image('cielo', '/public/resources/sky.jpeg');
        this.load.image('nave', '/public/resources/SS2.png');
        this.load.image('meteoro2', '/public/resources/meteoroA.png');
    }

    create() {
        this.add.image(400, 300, 'cielo');
        this.jugador = this.physics.add.sprite(400, 550, 'nave');
        this.jugador.setCollideWorldBounds(true);
        this.grupoMeteoros = this.physics.add.group();
        this.time.addEvent({ delay: 1000, callback: this.generarMeteoros, callbackScope: this, loop: true });
        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.jugador, this.grupoMeteoros, this.gameOver, null, this);

        this.textoPuntaje = this.add.text(16,16,'Puntaje: 0', {fontSize : '32px', fill: 'fff'});
    }

    generarMeteoros() {
        const x = Phaser.Math.Between(0, 800);
        const meteoro = this.grupoMeteoros.create(x, 0, 'meteoro2');
        meteoro.setVelocityY(200);
    }

    gameOver(jugador) {
        this.physics.pause();//pausa el juego
        jugador.setTint(0xff0000);//cambia el color 
        console.log('Game Over');
        this.scene.start('GameOver', {puntaje:this.puntaje});
    }

    update() {
        this.jugador.setVelocityX(0);
        if (this.cursors.left.isDown) {
            this.jugador.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.jugador.setVelocityX(300);
        }
        this.puntaje += 1;
        this.textoPuntaje.setText('Puntaje: ' + this.puntaje);
    }

 
}

export default EscenaMain;

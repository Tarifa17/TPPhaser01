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
        //this.load.image('nave', '/public/resources/SS2.png');
        this.load.image('meteoro2', '/public/resources/meteoroA.png');
        this.load.image('Coin', '/public/resources/Coin.png');
        this.load.audio('MusicaFondo','/public/resources/MusicaFondo.mp3');
    }

    create() {
        this.add.image(400, 300, 'cielo');
        this.jugador = this.physics.add.sprite(400, 550, 'nave');
    
        this.jugador.setCollideWorldBounds(true);
        this.grupoMeteoros = this.physics.add.group();
        this.grupoObjetoEspecial = this.physics.add.group(); // Grupo para el objeto especial
        this.time.addEvent({ delay: 1000, callback: this.generarMeteoros, callbackScope: this, loop: true });
        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.jugador, this.grupoMeteoros, this.gameOver, null, this);
// Detectar colisión entre jugador y monedas
this.physics.add.overlap(this.jugador, this.grupoObjetoEspecial, this.recogerObjetoEspecial, null, this);

this.anims.create({
    key: 'izquierda',
    frames: [{key: 'nave', frame: 0}],
    frameRate: 20
});

this.anims.create({
    key: 'normal',
    frames: [{key: 'nave', frame:1}],
    frameRate: 20
})

this.anims.create({
    key: 'derecha',
    frames: [{key: 'nave', frame:2}],
    frameRate:20
})

        this.textoPuntaje = this.add.text(16,16,'Puntaje: 0', { fontSize: '32px', fill: '#fff' });
        
        // Generar bonus después de 10 segundos
        this.time.addEvent({
            delay: 30000, 
            callback: this.generarObjetoEspecial, // Llama al método para generar el objeto
            callbackScope: this,
            loop: false 
        });
        //musica de fondo
        this.MusicaFondo =this.sound.add ('MusicaFondo',{loop :true});
    this.MusicaFondo.play();
    }

    // Método para generar el objeto en una posición aleatoria
    generarObjetoEspecial() {
        const x = Phaser.Math.Between(0, 800);
        const bonus = this.grupoObjetoEspecial.create(x, 0, 'Coin'); 
        bonus.setVelocityY(200);
        
    }
    recogerObjetoEspecial(jugador, coin) {
        coin.destroy(); // Elimina la moneda (Coin) una vez recogida
        console.log("Moneda recogida!");
        this.scene.start('EscenaBonus', { puntaje: this.puntaje }); // Cambia a la escena "EscenaBonus" y pasa el puntaje
        this.MusicaFondo.play();
    }
    //metodo para usarse al volver del EScenaBonus
    init(data) {
        this.puntaje = data.puntaje || 0; // Si no hay puntaje recibido, lo deja en 0
    }
    

    generarMeteoros() {
        const x = Phaser.Math.Between(0, 800);
        const meteoro = this.grupoMeteoros.create(x, 0, 'meteoro2');
        meteoro.setVelocityY(200);
    }

    gameOver(jugador) {
        this.physics.pause(); 
        jugador.setTint(0xff0000);
        console.log('Game Over');
        this.scene.start('GameOver', { puntaje: this.puntaje });
        this.MusicaFondo.stop();
    }

    update() {
        this.jugador.setVelocityX(0);
        this.jugador.setVelocityY(0);
        
        if (this.cursors.left.isDown) {
            this.jugador.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.jugador.setVelocityX(300);
        }

        if (this.cursors.up.isDown) {
            this.jugador.setVelocityY(-150);
        } else if (this.cursors.down.isDown) {
            this.jugador.setVelocityY(150);
        }

        this.puntaje += 1;
        this.textoPuntaje.setText('Puntaje: ' + this.puntaje); 
        
    }
}

export default EscenaMain;

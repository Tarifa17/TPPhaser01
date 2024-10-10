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
        this.load.image('proyectil', '/public/resources/bullet1.png');//cargando la imagen bala

        this.load.image('meteoro2', '/public/resources/meteoroA.png');
        this.load.image('Coin', '/public/resources/Coin.png');
        this.load.audio('MusicaFondo','/public/resources/MusicaFondo.mp3');
        this.load.audio('disparo', '/public/resources/disparoS.mp3');
        this.load.audio('explosion', '/public/resources/explosion1.mp3');
        this.load.spritesheet('nave', '/public/resources/sheep-Sheet.png', {frameWidth:32, frameHeight: 30})
    }

    create() {
        this.add.image(400, 300, 'cielo');
        this.jugador = this.physics.add.sprite(400, 550, 'nave');
        //proyectiles---------------------------------------------------------------------
        this.grupoProyectiles = this.physics.add.group(); // Crear el grupo de proyectiles
        this.teclaDisparo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.teclaEspacio = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
     

        this.jugador.setCollideWorldBounds(true);
        this.grupoMeteoros = this.physics.add.group();
        this.grupoObjetoEspecial = this.physics.add.group(); // Grupo para el objeto especial
        this.time.addEvent({ delay: 1000, callback: this.generarMeteoros, callbackScope: this, loop: true });
        this.cursors = this.input.keyboard.createCursorKeys();
        //collision jugador meteoros
        this.physics.add.collider(this.jugador, this.grupoMeteoros, this.gameOver, null, this);
// Detectar colisión entre jugador y monedas
this.physics.add.overlap(this.jugador, this.grupoObjetoEspecial, this.recogerObjetoEspecial, null, this);
//collision meteoros y bullet
this.physics.add.collider(this.grupoProyectiles, this.grupoMeteoros, this.destruirMeteoro, null, this);

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

    //metodo para el disparo ----------------------------------------------

    disparar() {
        const proyectil = this.grupoProyectiles.create(this.jugador.x, this.jugador.y, 'proyectil');
        proyectil.setVelocityY(-400); // Ajusta la velocidad hacia arriba (puedes modificar este valor)
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
        
        if (this.cursors.left.isDown) {
            this.jugador.setVelocityX(-300);
            this.jugador.anims.play('izquierda', true);
        } else if (this.cursors.right.isDown) {
            this.jugador.setVelocityX(300);
            this.jugador.anims.play('derecha', true);
        }else{
            this.jugador.anims.play('normal', true);
        }

        if (this.cursors.up.isDown) {
            this.jugador.setVelocityY(-150);
        } else if (this.cursors.down.isDown) {
            this.jugador.setVelocityY(150);
        }

        this.puntaje += 1;
        this.textoPuntaje.setText('Puntaje: ' + this.puntaje); 

        if (this.puntaje >= 20000) {
            console.log('Cambiando a EscenaHorizontal');
            this.MusicaFondo.stop(); // Detener la música de fondo
            this.scene.start('EscenaHorizontal', { puntaje: this.puntaje }); // Cambiar a la escena "EscenaHorizontal" y pasar el puntaje
        }
        if (Phaser.Input.Keyboard.JustDown(this.teclaDisparo) || Phaser.Input.Keyboard.JustDown(this.teclaEspacio)) {
            this.disparar();
        }
        
    }
}

export default EscenaMain;

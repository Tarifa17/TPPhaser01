class GameOver extends Phaser.Scene{
    constructor(){
        super('GameOver');
    }

    init(data){ //Sirve para capturar datos de otra escena
        this.puntaje = data.puntaje;
    }

    create(){
        this.add.text(400,200, 'GameOver', {fontSize: '64px', fill:'fff'}).serOrigin(0.5);
    }
}
export default GameOver;
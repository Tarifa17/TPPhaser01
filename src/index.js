import EscenaBonus from "./scenes/EscenaBonus.js";
import EscenaHorizontal from "./scenes/EscenaHorizontal.js";
import EscenaMain from "./scenes/EscenaMain.js"; // Asegúrate de que esta ruta sea correcta
import GameOver from "./scenes/GameOver.js";

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    physics: { // Corrige la propiedad "Physics" a "physics"
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [EscenaMain, GameOver,EscenaBonus,EscenaHorizontal]
};

let game = new Phaser.Game(config);

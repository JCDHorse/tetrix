import './index.css';
import { TetrisGame, TetrisCellState } from "./tetris";
import { TetrisView, DESIRED_WIDTH, GRID_WIDTH, GRID_HEIGHT, RATIO } from "./tetrisview";

function resizeCanvas() {
    const margin = 20;
    const minHeight= 600;  // Taille minimale pour bien jouer
    const maxHeight = window.innerHeight - margin;

    let height = Math.max(minHeight, Math.min(maxHeight, DESIRED_WIDTH * RATIO));
    let width = height / RATIO;
    const maxWidth = window.innerWidth - margin;

    if (width > maxWidth) {
        width = maxWidth;
        height = width * RATIO;
    }

    cnvTetris.width = Math.floor(width);
    cnvTetris.height = Math.floor(height);
}

//
// ** Rendering and events **
//

const cnvTetris: HTMLCanvasElement = document.querySelector('#tetrisCanva');
cnvTetris.width = DESIRED_WIDTH;
cnvTetris.height = Math.floor(DESIRED_WIDTH * RATIO);
const body = document.querySelector('body');

resizeCanvas();

const tetrisGame = new TetrisGame();
const tetris = new TetrisView(cnvTetris);

window.addEventListener('resize', () => {
    resizeCanvas();
    tetris.drawTetris(tetrisGame);
});

tetris.drawTetris(tetrisGame);

setInterval(() => {
    tetrisGame.tick();
    tetris.drawTetris(tetrisGame);
}, 500);

body.addEventListener("keydown", (e) => {
    if (e.key === 'ArrowLeft') {
        tetrisGame.left();
        tetris.drawTetris(tetrisGame);
    }
    else if (e.key === 'ArrowRight') {
        tetrisGame.right();
        tetris.drawTetris(tetrisGame);
    }
    else if (e.key === 'ArrowDown') {
        tetrisGame.down();
        tetris.drawTetris(tetrisGame);
    }
    else if (e.key === 'ArrowUp') {
        tetrisGame.rotate();
        tetris.drawTetris(tetrisGame);
    }
    else if (e.code === 'Space') {
        tetrisGame.pause_switch();
        tetris.drawTetris(tetrisGame);
    }
})
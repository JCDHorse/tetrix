import './index.css';
import { TetrisGame, TetrisCellState } from "./tetris";
import { TetrisView, DESIRED_WIDTH, GRID_WIDTH, GRID_HEIGHT, RATIO } from "./tetrisview";

function resizeCanvas() {
    const margin = 0;
    const maxHeight = window.innerHeight - margin;
    const maxWidth = window.innerWidth - margin;

    let height= maxHeight;
    let width = height / RATIO;

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


const tetrisGame = new TetrisGame();
const tetris = new TetrisView(cnvTetris);

window.addEventListener('resize', () => {
    resizeCanvas();
    tetris.updateCellSize();
    tetris.drawTetris(tetrisGame);
});


resizeCanvas();
tetris.updateCellSize();
tetris.drawTetris(tetrisGame);

setInterval(() => {
    tetrisGame.tick();
    tetris.drawTetris(tetrisGame);
}, 500);

body.addEventListener("keydown", (e) => {
    if (!tetrisGame.get_state().started) {
        if (e.code === 'Space') {
            tetrisGame.start();
        }
    }
    else {
        if (e.key === 'ArrowLeft') {
            tetrisGame.left();
        } else if (e.key === 'ArrowRight') {
            tetrisGame.right();
        } else if (e.key === 'ArrowDown') {
            tetrisGame.down();
        } else if (e.key === 'ArrowUp') {
            tetrisGame.rotate();
        } else if (e.code === 'Space') {
            tetrisGame.pause_switch();
        }
    }
    tetris.drawTetris(tetrisGame);
})

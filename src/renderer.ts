import './index.css';
import { TetrisGame, TetrisCellState } from "./tetris";

const GRID_WIDTH = 12;
const GRID_HEIGHT = 42;
const RATIO = GRID_HEIGHT / GRID_WIDTH;
const DESIRED_WIDTH = 800;

const cnvTetris: HTMLCanvasElement = document.querySelector('#tetrisCanva');
cnvTetris.width = DESIRED_WIDTH;
cnvTetris.height = Math.floor(DESIRED_WIDTH * RATIO);
const cnvCtx = cnvTetris.getContext('2d');
const body = document.querySelector('body');

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

class TetrisView {
    private static TETRIS_WIDTH = GRID_WIDTH - 2;
    private static TETRIS_HEIGHT = GRID_HEIGHT - 2;
    private static RATIO = TetrisView.TETRIS_HEIGHT / TetrisView.TETRIS_WIDTH;
    private static DESIRED_WIDTH = DESIRED_WIDTH;

    private context: CanvasRenderingContext2D;

    private cellSize: number;
    private offsetX: number;
    private offsetY: number;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
        this.updateCellSize();
    }

    public updateCellSize() {
        this.cellSize = this.context.canvas.width / GRID_WIDTH;
    }

    public drawTetris(game: TetrisGame) {
        // Background
        this.context.fillStyle = "black";
        for (let i = 0; i < GRID_HEIGHT; i++) {
            for (let j = 0; j < GRID_WIDTH; j++) {
                this.drawCell(j, i, "black")
            }
        }

        const color = "yellow";

        // Game area
        for (let i = 0; i < GRID_WIDTH+ 1; i++) {
            this.drawCell(i,0, color);
            this.drawCell(i, GRID_HEIGHT - 1, color);
        }
        for (let i = 0; i < GRID_HEIGHT; i++) {
            this.drawCell(0, i, color);
            this.drawCell(GRID_WIDTH - 1, i - 1, color);
        }

        let cells = tetrisGame.get_cells();
        for (let i = 0; i < TetrisGame.HEIGHT; i++) {
            for (let j = 0; j < TetrisGame.WIDTH; j++) {
                this.drawTetrisCell(j, i, cells[i][j]);
            }
        }
    }

    public drawCell(x: number, y: number, fillStyle: string, strokeStyle: string = "white") {
        this.context.fillStyle = fillStyle;
        this.context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
        /*
        this.context.strokeStyle = strokeStyle;
        this.context.lineWidth = 1;
        this.context.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
         */
    }

    public drawTetrisCell(x: number, y: number, cell: TetrisCellState) {
        let color = "black"
        if (cell != false) {
            color = cell;
        }
        this.drawCell(x + 1, y + 1, color);
    }
}

resizeCanvas();

const tetrisGame = new TetrisGame();
const tetris = new TetrisView(cnvCtx);

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
})
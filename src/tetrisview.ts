import {TetrisCellState, TetrisGame, TetrisState} from "./tetris";

const GRID_WIDTH = 12;
const GRID_HEIGHT = 42;
const RATIO = GRID_HEIGHT / GRID_WIDTH;
const DESIRED_WIDTH = 200;

export { GRID_HEIGHT, GRID_WIDTH, DESIRED_WIDTH, RATIO };

export class TetrisView {
    private static TETRIS_WIDTH = GRID_WIDTH - 2;
    private static TETRIS_HEIGHT = GRID_HEIGHT - 2;
    private static RATIO = TetrisView.TETRIS_HEIGHT / TetrisView.TETRIS_WIDTH;
    private static DESIRED_WIDTH = DESIRED_WIDTH;

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private cellSize: number;
    private offsetX: number;
    private offsetY: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.updateCellSize();
    }

    public updateCellSize() {
        this.cellSize = this.context.canvas.width / GRID_WIDTH;
    }

    public draw_text(text: string, font_size_px: number, char_len = 5) {
        this.context.fillStyle = "#FFF";
        this.context.font = `${font_size_px}px Arial`;
        this.context.fillText(text, (this.context.canvas.width / 2) - (text.length * char_len) , 80);
    }

    public draw_tuto() {
        let text = "Tetris"
        this.context.fillStyle = "#FFF";
        this.context.font = `20px Arial`;
        this.context.fillText(text, (this.context.canvas.width / 2) - (text.length * 5), 80);

        this.context.font = `12px Arial`;
        text = "Barre d'espace";
        this.context.fillText(text, (this.context.canvas.width / 2) - (text.length * 3), 100);

        text = "pour lancer la partie"
        this.context.fillText(text, (this.context.canvas.width / 2) - (text.length * 2.5), 110);

    }

    public draw_game_over() {
        const game_over = "Game Over !";
        this.draw_text(game_over, 20);
    }

    public draw_score(score: number) {
        const scoreStr = `${score}`;
        this.draw_text(scoreStr, 25);
    }

    public draw_current_game(state: TetrisState) {
        if (!state.started) {
            this.draw_tuto();
            return;
        }
        if (state.game_over) {
            this.draw_game_over();
            return;
        }
        this.draw_score(state.score);
        for (let i = 0; i < state.cells.length; i++) {
            for (let j = 0; j < state.cells[i].length; j++) {
                if (state.cells[i][j] != false) {
                    this.drawTetrisCell(j, i, state.cells[i][j]);
                }
            }
        }
    }

    public draw_current_tetromino(state: TetrisState) {
        for (let i = 0; i < state.current_tetr.type.dimensions.h; i++) {
            for (let j = 0; j < state.current_tetr.type.dimensions.w; j++) {
                const { y, x } = state.current_tetr.cell_coords(i, j);
                if (y < state.cells.length && x < state.cells[y].length) {
                    if (state.current_tetr.type.shape[state.current_tetr.rotation][i][j] != false) {
                        this.drawTetrisCell(x, y, state.current_tetr.type.state);
                    }
                }
            }
        }
    }

    public draw_current_tetromino_shadow(state: TetrisState) {
        for (let i = 0; i < state.current_tetr.type.dimensions.h; i++) {
            for (let j = 0; j < state.current_tetr.type.dimensions.w; j++) {
                const { y, x } = state.current_tetr.cell_coords(i, j);
                this.drawTetrisCell(x, y, "grey");
            }
        }
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

        // Game state
        const state = game.get_state();
        this.draw_current_game(state);
        this.draw_current_tetromino(state);
    }

    public drawCell(x: number, y: number, fillStyle: string, strokeStyle = "white") {
        this.context.fillStyle = fillStyle;
        this.context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
        /* // Debug : show grid
        */
        this.context.strokeStyle = "grey";
        this.context.lineWidth = 0.2;
        this.context.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }

    public drawTetrisCell(x: number, y: number, cell: TetrisCellState) {
        let color = "black"
        if (cell != false) {
            color = cell;
        }
        this.drawCell(x + 1, y + 1, color);
    }
}
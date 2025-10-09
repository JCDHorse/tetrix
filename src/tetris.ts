import {TetrisCellState, Tetromino, TetrominoRotation, TETROMINOS} from "./dominos";

type TetrisState = {
    current_tetr: Tetromino;
    cells: TetrisCellState[][];
};

class TetrisGame {
    public static WIDTH = 10;
    public static HEIGHT = 40;

    private static SHAPE_NAMES = [ "T", "I", "J", "L", "Z", "S", "O" ];

    private cells: TetrisCellState[][];
    private cur_tetr: Tetromino;

    private pause = false;

    constructor() {
        this.cells = Array.from({length: TetrisGame.HEIGHT}, () => Array(TetrisGame.WIDTH).fill(false));
        this.new_tetromino();
    }

    public new_tetromino() {
        const randShape = TetrisGame.SHAPE_NAMES[Math.floor(Math.random() * TetrisGame.SHAPE_NAMES.length)];
        //const randShape = "T";
        this.cur_tetr = new Tetromino(
            TETROMINOS[randShape],
            TetrominoRotation.UP,
            TetrisGame.WIDTH / 2,
            1
        );
    }

    public fix_tetromino() {
        for (let i = 0; i < this.cur_tetr.heigth(); i++) {
            for (let j = 0; j < this.cur_tetr.width(); j++) {
                const { y, x } = this.cur_tetr.cell_coords(i, j);
                if (y < this.cells.length && x < this.cells[y].length) {
                    if (this.cur_tetr.type.shape[this.cur_tetr.rotation][i][j] != false) {
                        this.cells[y][x] = this.cur_tetr.type.state;
                    }
                }
            }
        }
    }

    public get_state() : TetrisState {
        return {
            current_tetr: this.cur_tetr,
            cells: this.cells,
        };
    }

    public can_movedown(): boolean {
        const tetr_w = this.cur_tetr.type.dimensions.w;
        const tetr_h = this.cur_tetr.type.dimensions.h;
        const shape = this.cur_tetr.type.shape[this.cur_tetr.rotation];

        for (let i = tetr_h - 1; i >= 0; i--) {
            for (let j = 0; j < tetr_w; j++) {
                if (shape[i][j] != false) {
                    const { x, y } = this.cur_tetr.cell_coords(i, j);
                    if (y >= TetrisGame.HEIGHT - 1) {
                        return false;
                    }
                    if (this.cells[y + 1][x] != false) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    public can_moveleft(): boolean {
        const tetr_w = this.cur_tetr.type.dimensions.w;
        const tetr_h = this.cur_tetr.type.dimensions.h;
        const shape = this.cur_tetr.type.shape[this.cur_tetr.rotation];

        for (let i = 0; i < tetr_h; i++) {
            for (let j = 0; j < tetr_w; j++) {
                if (shape[i][j] != false) {
                    const {x, y} = this.cur_tetr.cell_coords(i, j);
                    if (x == 0) {
                        return false;
                    }
                    if (this.cells[y][x - 1] != false) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    public can_moveright(): boolean {
        const tetr_w = this.cur_tetr.type.dimensions.w;
        const tetr_h = this.cur_tetr.type.dimensions.h;
        const shape = this.cur_tetr.type.shape[this.cur_tetr.rotation];

        for (let i = tetr_h - 1; i >= 0; i--) {
            for (let j = tetr_w - 1; j >= 0; j--) {
                if (shape[i][j] != false) {
                    const {x, y} = this.cur_tetr.cell_coords(i, j);
                    if (x == TetrisGame.WIDTH - 1) {
                        return false;
                    }
                    if (this.cells[y][x + 1] != false) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    public check_lines(): boolean[] {
        const lines_ok = new Array<boolean>(TetrisGame.HEIGHT);
        for (let i = 0; i < TetrisGame.HEIGHT; i++) {
            let line_ok = true;
            for (let j = 0; j < TetrisGame.WIDTH; j++) {
                if (this.cells[i][j] == false) {
                    line_ok = false;
                    break;
                }
            }
            lines_ok[i] = line_ok;
        }
        return lines_ok;
    }

    public lines_score(lines_ok: Array<boolean>): number {
        const scoresLevels = [0, 100, 300, 500, 800];
        let score = 0;
        let chain = 0;
        for (let i = lines_ok.length - 1; i >= 0; i--) {
            if (lines_ok[i]) {
                chain++;
            }
            else {
                if (chain > 0 && chain <= 4) {
                    score += scoresLevels[chain];
                }
                chain = 0;
            }
        }
        // Last group is not handled by loop
        if (chain > 0 && chain <= 4) {
            score += scoresLevels[chain];
        }
        return score;
    }

    public tick(){
        if (this.pause) {
            return;
        }

        if (!this.can_movedown()) {
            this.fix_tetromino();
            this.new_tetromino();
        }
        else {
            this.down();
        }
        const score = this.lines_score(this.check_lines())
        console.log(score);
    }

    public rotate() {
        this.cur_tetr.rotation = (this.cur_tetr.rotation + 1) % TetrominoRotation.ROT_MAX;
    }

    public left() {
        if (this.can_moveleft()) {
            this.cur_tetr.x--;
        }
    }

    public right() {
        if (this.can_moveright()) {
            this.cur_tetr.x++;
        }
    }

    public down() {
        if (this.can_movedown()) {
            this.cur_tetr.y++;
        }
    }

    public pause_switch() {
        this.pause = !this.pause;
    }
}

export { TetrisGame, TetrisCellState, TetrisState };
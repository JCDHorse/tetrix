type TetrisCellState = "red" | "green" | "blue" | "yellow" | "purple" | "orange" | "cyan" | false;

type TetrominoType = {
    shape: boolean[][][],
    pivot: {
        x: number,
        y: number,
    },
    state: TetrisCellState,
}

type Tetrominos = {
    [name: string]: TetrominoType
}

enum TetrominoRotation {
    UP = 0,
    RIGHT = 1,
    DOWN = 2,
    LEFT = 3,
    ROT_MAX = 4,
}

const TETROMINOS: Tetrominos = {
    "T": {
        shape: [
            [
                [false, true, false],
                [true, true, true],
                [false, false, false],
            ],
            [
                [false, true, false],
                [false, true, true],
                [false, true, false],
            ],
            [
                [false, false, false],
                [true, true, true],
                [false, true, false],
            ],
            [
                [false, true, false],
                [true, true, false],
                [false, true, false],
            ],
        ],
        pivot: { x: 1, y: 1 },
        state: "purple",
    },
    "J": {
        shape: [
            [
                [true, false, false],
                [true, true, true],
                [false, false, false],
            ],
            [
                [false, true, true],
                [false, true, false],
                [false, true, false],
            ],
            [
                [false, false, false],
                [true, true, true],
                [false, false, true],
            ],
            [
                [false, true, false],
                [false, true, false],
                [true, true, false],
            ],
        ],
        pivot: { x: 1, y: 1 },
        state: "blue",
    },
    "L": {
        shape: [
            [
                [false, false, true],
                [true, true, true],
                [false, false, false],
            ],
            [
                [false, true, false],
                [false, true, false],
                [false, true, true],
            ],
            [
                [false, false, false],
                [true, true, true],
                [true, false, false],
            ],
            [
                [true, true, false],
                [false, true, false],
                [false, true, false],
            ],
        ],
        pivot: { x: 1, y: 1 },
        state: "orange",
    },
    "Z": {
        shape: [
            [
                [false, true, true],
                [true, true, false],
                [false, false, false],
            ],
            [
                [false, true, false],
                [false, true, true],
                [false, false, true],
            ],
            [
                [false, false, false],
                [false, true, true],
                [true, true, false],
            ],
            [
                [true, false, false],
                [true, true, false],
                [false, true, false],
            ],
        ],
        pivot: { x: 1, y: 1 },
        state: "green",
    },
    "S": {
        shape: [
            [
                [true, true, false],
                [false, true, true],
                [false, false, false],
            ],
            [
                [false, false, true],
                [false, true, true],
                [false, true, false],
            ],
            [
                [false, false, false],
                [true, true, false],
                [false, true, true],
            ],
            [
                [false, true, false],
                [true, true, false],
                [true, false, false],
            ],
        ],
        pivot: { x: 1, y: 1 },
        state: "red",
    },
    "O": {
        shape: [
            [
                [true, true, false],
                [true, true, false],
                [false, false, false],
            ],
            [
                [true, true, false],
                [true, true, false],
                [false, false, false],
            ],
            [
                [true, true, false],
                [true, true, false],
                [false, false, false],
            ],
            [
                [true, true, false],
                [true, true, false],
                [false, false, false],
            ],
        ],
        pivot: { x: 0, y: 0 },
        state: "yellow",
    },
    "I": {
        shape: [
            [
                [false, false, false, false],
                [true, true, true, true],
                [false, false, false, false],
                [false, false, false, false],
            ],
            [
                [false, false, true, false],
                [false, false, true, false],
                [false, false, true, false],
                [false, false, true, false],
            ],
            [
                [false, false, false, false],
                [false, false, false, false],
                [true, true, true, true],
                [false, false, false, false],
            ],
            [
                [false, true, false, false],
                [false, true, false, false],
                [false, true, false, false],
                [false, true, false, false],
            ],
        ],
        pivot: { x: 1, y: 1 },
        state: "cyan",
    },

}

class Tetromino {
    public type: TetrominoType;
    public rotation: TetrominoRotation;
    public x: number;
    public y: number;

    public constructor(type: TetrominoType, rotation: TetrominoRotation, x: number, y: number) {
        this.type = type;
        this.rotation = rotation;
        this.x = x;
        this.y = y;
    }

    public heigth() {
        return this.type.shape[this.rotation].length;
    }

    public width() {
        let width = 0;
        for (let i = 0; i < this.heigth(); i++) {
            if (width < this.type.shape[this.rotation][i].length) {
                width = this.type.shape[this.rotation][i].length;
            }
        }
        return width;
    }

    public cell_coords(y: number, x: number) {
        return {
            y: this.y + y - this.type.pivot.y,
            x: this.x + x - this.type.pivot.x,
        }
    }
}

class TetrisGame {
    public static WIDTH = 10;
    public static HEIGHT = 40;

    private cells: TetrisCellState[][];
    private cur_tetr: Tetromino;

    constructor() {
        this.cells = Array.from({length: TetrisGame.HEIGHT}, () => Array(TetrisGame.WIDTH).fill(false));
        this.new_tetromino();
    }

    public new_tetromino() {
        const SHAPES = [ "T", "I", "J", "L", "Z", "S", "O" ];
        const randShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        //const randShape = "T";
        this.cur_tetr = new Tetromino(
            TETROMINOS[randShape],
            TetrominoRotation.UP,
            TetrisGame.WIDTH / 2,
            1
        );
    }

    public draw_current_tetromino(cells: TetrisCellState[][]) {
        for (let i = 0; i < this.cur_tetr.heigth(); i++) {
            for (let j = 0; j < this.cur_tetr.width(); j++) {
                const { y, x } = this.cur_tetr.cell_coords(i, j);
                if (y < cells.length && x < cells[y].length) {
                    if (this.cur_tetr.type.shape[this.cur_tetr.rotation][i][j] != false) {
                        cells[y][x] = this.cur_tetr.type.state;
                    }
                }
            }
        }
    }

    public fix_tetromino() {
        this.draw_current_tetromino(this.cells);
    }

    public get_cells() : TetrisCellState[][] {
        const cells = this.cells.map(row => row.slice());
        this.draw_current_tetromino(cells);
        return cells;
    }

    public can_movedown(): boolean {
        let can_move = true;
        this.cur_tetr.y++;
        const shape = this.cur_tetr.type.shape[this.cur_tetr.rotation];

        for (let i = 0; i < this.cur_tetr.heigth(); i++) {
            for (let j = 0; j < this.cur_tetr.width(); j++) {
                const { y, x } = this.cur_tetr.cell_coords(i, j);
                if (shape[i][j] != false) {
                    if (y >= TetrisGame.HEIGHT || this.cells[y][x] != false) {
                        can_move = false;
                    }
                }
            }
        }

        this.cur_tetr.y--;
        return can_move;
    }

    public tick(){
        this.cur_tetr.y++;

        if (!this.can_movedown()) {
            this.fix_tetromino();
            this.new_tetromino();
        }
    }

    public rotate() {
        this.cur_tetr.rotation = (this.cur_tetr.rotation + 1) % TetrominoRotation.ROT_MAX;
    }

    public left() {
        this.cur_tetr.x--;
    }

    public right() {
        this.cur_tetr.x++;
    }

    public down() {
        if (this.can_movedown()) {
            this.cur_tetr.y++;
        }
        else {
            this.fix_tetromino();
            this.new_tetromino();
        }
    }
}

export { TetrisGame, TetrisCellState };
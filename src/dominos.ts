type TetrisCellState = "red" | "green" | "blue" | "yellow" | "purple" | "orange" | "cyan" | false;

type TetrominoType = {
    shape: boolean[][][],
    dimensions: {
        w: number,
        h: number,
    },
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
        dimensions: { w: 3, h: 3 },
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
        dimensions: { w: 3, h: 3 },
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
        dimensions: { w: 3, h: 3 },
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
        dimensions: { w: 3, h: 3 },
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
        dimensions: { w: 3, h: 3 },
        pivot: { x: 1, y: 1 },
        state: "red",
    },
    "O": {
        shape: [
            [
                [true, true],
                [true, true],
            ],
            [
                [true, true],
                [true, true],
            ],
            [
                [true, true],
                [true, true],
            ],
            [
                [true, true],
                [true, true],
            ],
        ],
        dimensions: { w: 2, h: 2 },
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
        dimensions: { w: 4, h: 4 },
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

export { TetrominoType, TetrominoRotation, Tetromino, TETROMINOS, Tetrominos, TetrisCellState  };

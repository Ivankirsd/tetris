
class Figure {
    constructor() {
        this.dX = 6;
        this.dY = 0;
    }

    getFigure() {
        return this.figure;
    }

    setFigure(figure) {
        this.figure = figure;
    }

    getFigurePosition() {
        const midX = Math.floor(this.figure[0].length / 2);
        const midY = Math.floor(this.figure.length / 2);

        return this.figure.map((row, i) => {
            return row.map((cell, j) => {
                return cell ? [
                    i - midY + this.dY,
                    j - midX + this.dX
                ] : null;
            })
        });
    }

    moveLeft(){
        this.dX--;
    }

    moveRight(){
        this.dX++;
    }

    moveDown(){
        this.dY++;
    }

    flip(){
        const fig = [];
        const figureYLength = this.figure.length

        this.figure.forEach((row, i) => {
            row.forEach((cell, j) => {
                if(i === 0) {
                    fig.push([ this.figure[figureYLength - 1 - i][j] ]);
                } else {
                    fig[j].push( this.figure[figureYLength - 1 - i][j] );
                }
            })
        });
        this.figure = fig;
    }
}


class Figure1 extends Figure {
    constructor() {
        super();
        this.figure = [
            [1, 1, null],
            [null,1,1]
        ]
    }
}

class Figure2 extends Figure {
    constructor() {
        super();
        this.figure = [
            [null, 1, 1],
            [1,1, null]
        ];
    }
}

class Figure3 extends Figure {
    constructor() {
        super();
        this.figure = [
            [1, 1, 1],
            [null, 1 , null]
        ];
    }
}

class Figure4 extends Figure {
    constructor() {
        super();
        this.figure = [
            [1, 1],
            [1, 1]
        ];
    }

    flip() {}
}

class Figure5 extends Figure {
    constructor() {
        super();
        this.figure = [
            [1, 1, 1, 1]
        ];
    }
}

class Figure6 extends Figure {
    constructor() {
        super();
        this.figure = [
            [1, 1, 1],
            [1,null, null]
        ];
    }
}

class Figure7 extends Figure {
    constructor() {
        super();
        this.figure = [
            [1, 1, 1],
            [null,null, 1]
        ];
    }
}

export function generateRandomFigure(){
    const number = random(1, 7);
    const startFlip = random(0, 3);
    let fig = null;

    switch(number) {
        case 1: {
            fig = new Figure1();
            break;
        }
        case 2: {
            fig = new Figure2();
            break;
        }
        case 3: {
            fig = new Figure3();
            break;
        }
        case 4: {
            fig = new Figure4();
            break;
        }
        case 5: {
            fig = new Figure5();
            break;
        }
        case 6: {
            fig = new Figure6();
            break;
        }
        case 7: {
            fig = new Figure7();
            break;
        }
        default: {
            throw Error('Unknown Figure type');
        }
    }

    for (let i = 0; i < startFlip; i++) {
        fig.flip();   
    }
    return fig;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var FigureModule = (function() {
    'use strict';


  
    // WORK WITH FIGURES ---------
    function Figure() {
        this.dX = 6;
        this.dY = 0;
    }

    Figure.prototype.getFigure = function() {
        return this.figure;
    }

    Figure.prototype.setFigure = function(figure) {
        this.figure = figure;
    }

    Figure.prototype.getFigurePosition = function() {
        var midX = Math.floor(this.figure[0].length / 2);
        var midY =  Math.floor(this.figure.length / 2);

        var fig = [];
        for (var i = 0; i < this.figure.length; i++) {
            var row = []
            for (var j = 0; j < this.figure[i].length; j++) {
                if (this.figure[i][j]) {
                    row.push([
                        i - midY + this.dY,
                        j - midX + this.dX
                    ]);
                } else {
                    row.push(null);
                }
            }        
            fig.push(row);
            row = null;
        }
        return fig;
    }

    Figure.prototype.moveLeft = function(){
        this.dX--;
    }

    Figure.prototype.moveRight = function(){
        this.dX++;
    }

    Figure.prototype.moveDown = function(){
        this.dY++;
    }

    Figure.prototype.flip = function(){
        var fig = [];

        for (var i = 0; i < this.figure.length; i++) {
            for (var j = 0; j < this.figure[i].length; j++) {

                if (i === 0) {
                    fig.push([ 
                        this.figure[this.figure.length - 1 - i][j] !== null ?
                        1 :
                        null
                    ]);
                } else {
                    fig[j].push(
                        this.figure[this.figure.length - 1 - i][j] !== null ? 1 : null
                    );
                }
            }        
        }
        this.figure = fig;
    }

    function Figure1() {
        this.figure = [
            [1, 1, null],
            [null,1,1]
        ]
        Figure.call(this);
    }
    Figure1.prototype = Object.create(Figure.prototype);
    Figure1.prototype.constructor = Figure1;

    function Figure2() {

        this.figure = [
            [null, 1, 1],
            [1,1, null]
        ];
        Figure.call(this);
    }
    Figure2.prototype = Object.create(Figure.prototype);
    Figure2.prototype.constructor = Figure2;

    function Figure3() {
        this.figure = [
            [1, 1, 1],
            [null, 1 , null]
        ];
        Figure.call(this);
    }
    Figure3.prototype = Object.create(Figure.prototype);
    Figure3.prototype.constructor = Figure3;

    function Figure4() {
        this.figure = [
            [1, 1],
            [1, 1]
        ];
        Figure.call(this);
    }
    Figure4.prototype = Object.create(Figure.prototype);
    Figure4.prototype.constructor = Figure4;

    function Figure5() {
        this.figure = [
            [1, 1, 1, 1]
        ];
        Figure.call(this);
    }
    Figure5.prototype = Object.create(Figure.prototype);
    Figure5.prototype.constructor = Figure5;

    function Figure6() {
        this.figure = [
            [1, 1, 1],
            [1,null, null]
        ];
        Figure.call(this);
    }
    Figure6.prototype = Object.create(Figure.prototype);
    Figure6.prototype.constructor = Figure6;

    function Figure7() {
        this.figure = [
            [1, 1, 1],
            [null,null, 1]
        ];
        Figure.call(this);
    }
    Figure7.prototype = Object.create(Figure.prototype);
    Figure7.prototype.constructor = Figure7;
    // END WORK WITH FIGURES -----

    function generateRandomFigure(){
        var number = random(1, 7);

        var fig = null;
        var startFlip = random(0, 3);

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
        }

        for (var i = 0; i < startFlip; i++) {
            fig.flip();   
        }
        return fig;
    }

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    return {
        generateRandomFigure: generateRandomFigure
    };

})();


import TETRIS_CONSTANTS from '/tetrisConstants.js';

const playingAreaRef = document.getElementById('playing-area');
const scoreRef = document.getElementById('score');
const figuresRef = document.getElementById('figures');

function generatePlayingArea(syzeX = TETRIS_CONSTANTS.PLAYING_AREA_SYZE_X, syzeY = TETRIS_CONSTANTS.PLAYING_AREA_SYZE_Y) {
    return Array(syzeY).fill(null).map(row => {
        return Array(syzeX).fill(null);
    });
}

function removeFullRowFromPlayingArea(playingArea, index) {

    if(!playingArea || index < 0 || index > playingArea.length ) {
        return;
    }

    playingArea.splice(index, 1);
    const rowLength = playingArea[0].length

    const newRow = Array(rowLength).fill(null);
    playingArea.unshift(newRow);
}

function canSetFigureToPlayingArea(playingArea, positionX = null, positionY = null, figure) {

    if(!playingArea || positionX === null || positionY === null || !figure) {
        return false;
    }
    
    const midX = Math.floor(figure[0].length / 2);
    const midY =  Math.floor(figure.length / 2);

    return figure.every((row, i) => {
        return row.every((cell, j) => {
            if (!cell || i + positionY - midY < 0 ) {
                return true;
            }
            if(
                (i + positionY - midY < 0) ||
                (i + positionY - midY > playingArea.length - 1) ||
                (j + positionX - midX < 0) ||
                (j + positionX - midX > playingArea[0].length - 1) ||
                (playingArea[i + positionY - midY][j + positionX - midX] !== null)
            ) {
                return false;
            }
            return true;
        });
    });

}

function setFigureToPlayingArea(playingArea, figure) {

    if (!playingArea || !figure) {
        return;
    }

    figure.forEach(row => {
        row.forEach((cell) => {
            if (cell && cell[0] > -1) {
                playingArea[ cell[0] ][ cell[1] ] = 1;
            }
        });
    });
}

function renderPlayingAreaTemplate(playingArea) {

    if(!playingArea) {
        return;
    }

    playingAreaRef.innerHTML = playingArea.map((row, i) => {
        return `<div class="row">${
            row.map((cell, j) => {
                return `<div id="${i}_${j}" class="cell${playingArea[i][j] ? ' active-cell' : ''}"></div>`;
            }).join('')
        }</div>`
    }).join('');
}

function viewFigure(playingArea, figure) {   

    if (!playingArea || !figure) {
        return;
    }

    const playingAreaRowLength = playingArea[0].length;

    figure.forEach(row => {
        row.forEach((cell) => {
            if(cell &&
                cell[0] > -1 &&
                cell[1] > -1 && cell[1] < playingAreaRowLength
            ){
                const playingAreaCell = document.getElementById(`${ cell[0] }_${ cell[1] }`);
                if(playingAreaCell) {
                    playingAreaCell.classList.add('active-cell');
                }
            }
        });
    });
}

function hideFigure(playingArea, figure) {

    if(!playingArea || !figure) {
        return;
    }

    const playingAreaRowLength = playingArea[0].length;

    figure.forEach(row => {
        row.forEach((cell) => {
            if(
                cell &&
                cell[0] > -1 &&
                cell[1] > -1 && cell[1] < playingAreaRowLength ) {
                const playingAreaCell = document.getElementById(`${ cell[0] }_${ cell[1] }`);
                if(playingAreaCell) {
                    playingAreaCell.classList.remove('active-cell');
                }
            }
        });
    })
}

function updateScore(score = 0) {
    scoreRef.innerText = `Score: ${score}`;
}

function renderFiguresArrayTemplate(figures) {

    if(!figures || !Array.isArray(figures)) {
        return;
    }

    figuresRef.innerHTML = figures.map( figure => {

        const fig = figure.getFigure();

        return `<div class="figure">${
            fig.map(row => {
                return `<div class="row">${
                    row.map( cell => `<div class="cell${cell ? ' active-cell' : ''}"></div>`).join('')
                }</div>`;
            }).join('')
        }</div>`
    }).join('');
}

function addEventListeners({pauseGame = null}) {
    if(pauseGame) {
        document.getElementById('pause-btn').addEventListener('click', pauseGame);
    }
}

function flipFigure(playingArea, focusedFigure) {

    if(!playingArea || !focusedFigure) {
        return;
    }

    hideFigure(playingArea, focusedFigure.getFigurePosition());

    const oldFig = focusedFigure.getFigure();
    focusedFigure.flip();
    const fig = focusedFigure.getFigure();

    if (!canSetFigureToPlayingArea(playingArea, focusedFigure.dX, focusedFigure.dY, fig)) {
        const midX = Math.floor(fig[0].length / 2);

        for (let i = 1; i < midX + 1; i++) {
            if(canSetFigureToPlayingArea(playingArea, focusedFigure.dX - midX + i - 1, focusedFigure.dY, fig)) {
                focusedFigure.dX -=i;
                viewFigure(playingArea, focusedFigure.getFigurePosition());
                return;
            }
            if(canSetFigureToPlayingArea(playingArea, focusedFigure.dX + i, focusedFigure.dY, fig)) {
                focusedFigure.dX +=i;
                viewFigure(playingArea, focusedFigure.getFigurePosition());
                return;
            }
        }
        focusedFigure.setFigure(oldFig);
    }
    viewFigure(playingArea, focusedFigure.getFigurePosition());
}

function moveFigureDown(playingArea, focusedFigure) {

    if(!playingArea) {
        throw Error(`playingArea is ${playingArea}.`)
    }

    if(!focusedFigure) {
        throw Error(`focusedFigure is ${focusedFigure}.`)
    }

    if(canSetFigureToPlayingArea(playingArea, focusedFigure.dX, focusedFigure.dY + 1, focusedFigure.getFigure())) {
        hideFigure(playingArea, focusedFigure.getFigurePosition());
        focusedFigure.moveDown();
        viewFigure(playingArea, focusedFigure.getFigurePosition());
        return true
    } else {
        setFigureToPlayingArea(playingArea, focusedFigure.getFigurePosition());
        return false;
    }
}

function moveFigureLeft(playingArea, focusedFigure) {
    if(!playingArea || !focusedFigure) {
        return;
    }

    if(canSetFigureToPlayingArea(playingArea, focusedFigure.dX - 1, focusedFigure.dY, focusedFigure.getFigure())) {
        hideFigure(playingArea, focusedFigure.getFigurePosition());
        focusedFigure.moveLeft();
        viewFigure(playingArea, focusedFigure.getFigurePosition());
    }
}

function moveFigureRight(playingArea, focusedFigure) {

    if(!playingArea || !focusedFigure) {
        return;
    }

    if(canSetFigureToPlayingArea(playingArea, focusedFigure.dX + 1, focusedFigure.dY, focusedFigure.getFigure())) {
        hideFigure(playingArea, focusedFigure.getFigurePosition());
        focusedFigure.moveRight();
        viewFigure(playingArea, focusedFigure.getFigurePosition());
    }
}

export default {
    generatePlayingArea,
    removeFullRowFromPlayingArea,
    canSetFigureToPlayingArea,
    setFigureToPlayingArea,
    renderPlayingAreaTemplate,
    viewFigure,
    hideFigure,
    renderFiguresArrayTemplate,
    updateScore,
    addEventListeners,
    flipFigure,
    moveFigureDown,
    moveFigureLeft,
    moveFigureRight,
}
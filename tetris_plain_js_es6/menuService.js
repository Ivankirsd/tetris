import TETRIS_CONSTANTS from '/tetrisConstants.js';


const modalRef = document.getElementById('start-stop-modal');
const scoreResultRef = document.getElementById('score-result');
const continueBtnContainerRef = document.getElementById('continue-btn-container');

function viewMenu(gameStatus = null, score = 0) {

    if(!gameStatus) {
        return;
    }

    modalRef.style = 'display: flex';

    switch (gameStatus) {
        case TETRIS_CONSTANTS.GAME_STATUSES.START: {
            continueBtnContainerRef.style = 'display: none';  
            break;
        }
        case TETRIS_CONSTANTS.GAME_STATUSES.PAUSE: {
            scoreResultRef.innerText = `Score ${score}`;
            continueBtnContainerRef.style = 'display: flex';
            break;
        }
        case TETRIS_CONSTANTS.GAME_STATUSES.END: {
            scoreResultRef.innerHTML = `<div>Game over!</div><div>Your score is ${score}</div>`;
            continueBtnContainerRef.style = 'display: none';
            break;
        }
        default:
            break;
    }
}

function hideMenu() {
    modalRef.style = 'display: none';
}

function addEventListeners({startGame = null, continueGame = null}) {
    if(startGame) {
        document.getElementById('start-btn').addEventListener('click', startGame);
    }
    if(continueGame) {
        document.getElementById('continue-btn').addEventListener('click', continueGame);
    }
}


export default {
    viewMenu,
    hideMenu,
    addEventListeners
}
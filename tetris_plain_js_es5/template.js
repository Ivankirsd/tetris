var TeplateModule = (function() {
    'use strict';

    var modalRef = document.getElementById('start-stop-modal');
    var scoreResultRef = document.getElementById('score-result');
    var continueBtnContainerRef = document.getElementById('continue-btn-container');
    var scoreRef = document.getElementById('score');
    var figuresRef = document.getElementById('figures');
    var playingAreaRef = document.getElementById('playing-area');


    function viewMenu(gameStatus, score) {
        modalRef.style = 'display: flex';

        switch (gameStatus) {
            case 'start': {
                continueBtnContainerRef.style = 'display: none';  
                break;
            }
            case 'pause': {
                scoreResultRef.innerText = 'Score ' + score;
                continueBtnContainerRef.style = 'display: flex';
                break;
            }
            case 'end': {
                scoreResultRef.innerHTML = '<div>Game over!</div><div>Your score is ' + score + '</div>';
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
    
    function updateScore(score) {
        scoreRef.innerText = 'Score: ' + score;
    }

    function viewFigure(figure, playingArea) {
        for (var i = 0; i < figure.length; i++) {
            for (var j = 0; j < figure[i].length; j++) {
                if (figure[i][j] &&
                    figure[i][j][0] > -1 &&
                    figure[i][j][1] > -1 &&
                    figure[i][j][1] < playingArea[0].length) {
                    var cell = document.getElementById( figure[i][j][0] + '_' + figure[i][j][1]);
                    cell.classList.add('active-cell');
                }
            }
        }
    }

    function hideFigure(figure, playingArea) {
        for (var i = 0; i < figure.length; i++) {
            for (var j = 0; j < figure[i].length; j++) {

                if (figure[i][j] &&
                    figure[i][j][0] > -1 &&
                    figure[i][j][1] > -1 &&
                    figure[i][j][1] < playingArea[0].length) {
                    var cell = document.getElementById( figure[i][j][0] + '_' + figure[i][j][1]);
                    cell.classList.remove('active-cell');
                }
            }
        }
    }

    function renderFiguresArrayTemplate(figures) {
        var result = [];

        for (var f = 0; f < figures.length; f++) {
            result.push('<div class="figure">');
            var fig = figures[f].getFigure();
            
            for (var i = 0; i < fig.length; i++) {
                result.push('<div class="row">');
                for (var j = 0; j < fig[i].length; j++) {
                    result.push('<div class="cell '+ (fig[i][j] ? 'active-cell' : '') +'"></div>');
                }
                result.push('</div>');           
            }
            result.push('</div>');
        }
        figuresRef.innerHTML = result.join('');
    }

    function renderPlayingAreaTemplate(playingArea) {

        // TO DO  result array

        var innerHTML = '';
        for (var i = 0; i < playingArea.length; i++) {
            innerHTML += '<div class="row">'
            for (var j = 0; j < playingArea[0].length; j++) {
                innerHTML += '<div id="'+ i + '_'+ j +'" class="cell ' + (playingArea[i][j] ? 'active-cell' : '') + '"></div>'
            }
            innerHTML += '</div>'
            
        }
        playingAreaRef.innerHTML = innerHTML;
    }

    function addEventListeners(handlers) {
        // checkPressedKey, startGame, continueGame, pauseGame
        document.addEventListener('keydown', handlers.checkPressedKey);
        document.getElementById('start-btn').addEventListener('click', handlers.startGame);
        document.getElementById('continue-btn').addEventListener('click', handlers.continueGame);
        document.getElementById('pause-btn').addEventListener('click', handlers.pauseGame);
    }

    return {
        addEventListeners: addEventListeners,
        viewFigure: viewFigure,
        hideFigure: hideFigure,
        renderFiguresArrayTemplate: renderFiguresArrayTemplate,
        renderPlayingAreaTemplate: renderPlayingAreaTemplate,
        updateScore: updateScore,
        viewMenu: viewMenu,
        hideMenu: hideMenu
    };
})()
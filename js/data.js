import Flux from './flux.js';

let gameState = {
    notMines: 0,
    uncovered: 0
};

let width = 25;
let height = 25;

let mines = Array.from(new Array(width), () => 0);
mines.forEach((item, index, array) => {
    array[index] = Array.from(new Array(height), () => 0);
});

let dificulty = 0.1;

Flux.register('resetListener', payload => {
    if (payload.action === 'resetgame') {
        data.started = false;
        data.over = false;
        gameState.notMines = 0;
        gameState.uncovered = 0;
    }
});

const uncover = () => {
    gameState.uncovered++;
    if (gameState.uncovered === gameState.notMines) {
        console.log('youwin');
        Flux.dispatch({
            action: 'gameover',
            result: 'win'
        });
    }
};

const flagCount = ( () => {
    let counter = 0;
    let value = 0;
    return {
        reset: v => {
            value = v;
            counter = 0;
        },
        add: () => {
            counter++;
        },
        getCount: () => {
            console.log(value === counter);
            return (value === counter);
        }
    }
}) ();

const populateData = (startx, starty, callback) => {
    console.log(startx, ' ', starty);

    for (let i = 0; i < width; i++) {
        mines[i] = [];
        for (let j = 0; j < height; j++) {
            mines[i][j] = (Math.random() < dificulty) ? 9 : 0;
        }
    }

    mines[startx][starty] = 0;
    if (startx > 0 && starty > 0) mines[startx - 1][starty - 1] = 0;
    if (startx > 0) mines[startx - 1][starty] = 0;
    if (startx > 0 && starty < height - 1) mines[startx - 1][starty + 1] = 0;
    if (startx < width - 1 && starty > 0) mines[startx + 1][starty - 1] = 0;
    if (startx < width - 1) mines[startx + 1][starty] = 0;
    if (startx < width - 1 && starty < height - 1) mines[startx + 1][starty + 1] = 0;
    if (starty < height - 1) mines[startx][starty + 1] = 0;
    if (starty > 0) mines[startx][starty - 1] = 0;
    gameState.notMines = 0;

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (mines[i][j] === 0) {
                gameState.notMines++;
                let count = 0;
                if (mines[i - 1] && mines[i - 1][j - 1] && mines[i - 1][j - 1] === 9) count ++;
                if (mines[i][j - 1] && mines[i][j - 1] === 9) count ++;
                if (mines[i + 1] && mines[i + 1][j - 1] && mines[i + 1][j - 1] === 9) count ++;
                if (mines[i - 1] && mines[i - 1][j] === 9) count ++;
                if (mines[i - 1] && mines[i - 1][j + 1] && mines[i - 1][j + 1] === 9) count ++;
                if (mines[i][j + 1] && mines[i][j + 1] === 9) count ++;
                if (mines[i + 1] && mines[i + 1][j + 1] && mines[i + 1][j + 1] === 9) count ++;
                if (mines[i + 1] && mines[i + 1][j] === 9) count ++;
                mines[i][j] = count;
            }
        }
    }

    data.started = true;
    Flux.dispatch({
        action: 'updatemines',
        callback: callback
    });
};



let data = {
    reset: populateData,
    mines: mines,
    started: false,
    over: false,
    flags: flagCount,
    uncover: uncover
};


export default data;

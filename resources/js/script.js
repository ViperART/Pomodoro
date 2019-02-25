const 
    work = document.querySelector('.work'),
    breakShort = document.querySelector('.break-short'),
    breakLong = document.querySelector('.break-long'),
    rounds = document.querySelector('.rounds'),
    workTime = document.getElementById('work-time'),
    breakShortTime = document.getElementById('break-short-time'),
    breakLongTime = document.getElementById('break-long-time'),
    roundsCount = document.getElementById('rounds-count'),
    reset = document.getElementById('reset'),
    time = document.querySelector('#time'),
    start = document.querySelector('#start'),
    state = document.querySelector('#state'),
    wrapRed = document.querySelector('.wrap-red'),
    wrapBlue = document.querySelector('.wrap-blue'),
    wrapGreen = document.querySelector('.wrap-green'),
    wrapViolet = document.querySelector('.wrap-violet'),
    audio = document.querySelector('audio'),
    stop = document.querySelector('#stop');

let stateOfTimers = 0;
let countOfLaps = 0;
let stateOfApp = 0;

class Timer {
    constructor(timeWork, timeShortB, timeLongB, numRounds) {
        this.timeWork = parseInt(timeWork);
        this.timeShortB = parseInt(timeShortB);
        this.timeLongB = parseInt(timeLongB);
        this.numRounds = parseInt(numRounds);
    }
    
    timerBasic(min, sec = 60) {
        let maximumLaps = this.numRounds;
        let timerino = setInterval(function() {
            stop.addEventListener('click', () => {
                clearInterval(timerino);
            });
            sec--;
            time.innerHTML = `${`${min}`.length > 1 ? min : `0${min}`}:${`${sec}`.length > 1 ? sec : `0${sec}`}`;
            if (sec == 0 && min == 0) {
                clearInterval(timerino);
                audio.play();
                if (stateOfTimers == 1 && countOfLaps == maximumLaps) {
                    stateOfTimers = 4;
                } else if (stateOfTimers == 1) {
                    stateOfTimers = 2;
                } else if (stateOfTimers == 3 && countOfLaps != maximumLaps) {
                    stateOfTimers = 0;
                } else if (stateOfTimers == 5) {
                    state.innerHTML = 'Finish!';
                }
            }
            if (sec == -1) {
                min--;
                sec = 59;
            }
        }, 1000);
    }

    setTimerWork() {
        stateOfTimers = 1;
        countOfLaps++;
        state.innerHTML = 'Work';
        let min = this.timeWork - 1;
        this.timerBasic(min);
    }

    setTimerShortB() {
        stateOfTimers = 3;
        state.innerHTML = 'Short Break';
        let min = this.timeShortB - 1;
        this.timerBasic(min);
    }

    setTimerLongB() {
        stateOfTimers = 5;
        state.innerHTML = 'Long Break';
        let min = this.timeLongB - 1;
        this.timerBasic(min);
    }

}

start.addEventListener('click', () => {
    if (stateOfApp == 0) {
        stateOfTimers = 0;
    }
    stateOfApp = 1;
    // create timer
    let timer = new Timer(work.value, breakShort.value, breakLong.value, rounds.value);
    // if rested of just started
    let stage1 = setInterval(() => {
        if (stateOfTimers == 0) {
            timer.setTimerWork();
        }
    }, 100);
    // if just worked and NOT finished
    let stage2 = setInterval(() => {
        if (stateOfTimers == 2) {
            timer.setTimerShortB();
        }
    }, 100);
    // if just worked AND finished
    let stage3 = setInterval(() => {
        if (stateOfTimers == 4) {
            timer.setTimerLongB();
        }
    }, 100);
    // change background
    let stageBG = setInterval(() => {
        if (state.innerHTML == 'Work') {
            wrapRed.style.opacity = '1';
            wrapBlue.style.opacity = '0';
            wrapGreen.style.opacity = '0';
            wrapViolet.style.opacity = '0';
        } else if (state.innerHTML == 'Short Break') {
            wrapRed.style.opacity = '0';
            wrapBlue.style.opacity = '1';
            wrapGreen.style.opacity = '0';
            wrapViolet.style.opacity = '0';
        } else if (state.innerHTML == 'Long Break') {
            wrapRed.style.opacity = '0';
            wrapBlue.style.opacity = '0';
            wrapGreen.style.opacity = '1';
            wrapViolet.style.opacity = '0';
        } else {
            wrapRed.style.opacity = '0';
            wrapBlue.style.opacity = '0';
            wrapGreen.style.opacity = '0';
            wrapViolet.style.opacity = '1';
        }
    }, 200);
    
    stop.addEventListener('click', () => {
        clearInterval(stage1);
        clearInterval(stage2);
        clearInterval(stage3);
        clearInterval(stageBG);
        stateOfTimers = 0;
        countOfLaps = 0;
        stateOfApp = 0;
        time.innerHTML = '';
        state.innerHTML = 'Preparing';
        wrapRed.style.opacity = '0';
        wrapBlue.style.opacity = '0';
        wrapGreen.style.opacity = '0';
        wrapViolet.style.opacity = '1';
    });
});

function restoreDefaults() {
    workTime.innerHTML = '25:00';
    breakShortTime.innerHTML = '05:00';
    breakLongTime.textContent = '15:00';
    roundsCount.innerHTML = 4;
    work.value = 25;
    breakShort.value = 5;
    breakLong.value = 15;
    rounds.value = 4;
}

reset.addEventListener('click', restoreDefaults);

document.addEventListener('input', e => {
    if (e.target.classList.contains('work')) {
        workTime.innerHTML = `${e.target.value.length > 1 ? e.target.value : `0${e.target.value}`}:00`;
    } else if (e.target.classList.contains('break-short')) {
        breakShortTime.innerHTML = `${e.target.value.length > 1 ? e.target.value : `0${e.target.value}`}:00`;
    } else if (e.target.classList.contains('break-long')) {
        breakLongTime.innerHTML = `${e.target.value.length > 1 ? e.target.value : `0${e.target.value}`}:00`;
    } else if (e.target.classList.contains('rounds')) {
        roundsCount.innerHTML = e.target.value;
    }
});

function scrollTo(element) {
    const y = element.getBoundingClientRect().top + element.parentElement.scrollTop;
    element.parentElement.scroll({
        top: y - element.parentElement.offsetHeight,
        behavior: 'smooth'
    });
}

function countLetters(text) { 
    // Count the characters in a str without spaces (includes punctuation)
    let length = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] != ' ') {
            length++;
        }
    }

    return length;

}

class ChallengeTextLineGroup {
    constructor(lines, selected = 0) {
        this.lines = lines // Array of ChallengeTextLine
        this.selected = selected // Int representing the index of the selected line (zero-indexed)
    }

    toHTML() {
        let ret = "";
        for (let i = 0; i < this.lines.length; i++) {
            if /*(Math.abs(i - this.selected) < 3)*/ (true) {
                ret += `<div class="challenge-text" id="challenge-line-${i+1}">${i+1}. <span class="${(i == this.selected) ? 'challenge-text-selected-line' : ''}">${this.lines[i]}</span></div><br>`
            }   
        }
        return ret;
    }

}

function lineSplit(text) {
    // Split a one-line string into an array of lines
    const LINE_WORD_COUNT = 10;
    let lines = [];
    words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
        if (lines.length == 0) {
            lines.push("");
        }

        if (lines[lines.length - 1].split(' ').length < LINE_WORD_COUNT) {
            lines[lines.length - 1] = lines[lines.length - 1] + words[i] + ' ';
        }
        else if (words[i] && words[i] != ' ' && words[i] != '\n') {
            lines.push(words[i] + ' ');
        }
    }

    return new ChallengeTextLineGroup(lines);
}

function renderChallengeText(lines) {
    // Take a ChallengeTextLineGroup and display the lines in the challenge text div
    let box = document.getElementById("challenge-text");
    box.innerHTML = lines.toHTML();
}

var level_running = false;
var lines = null;
const LPS = 2.5; // Letters per second
var difficulty; // Difficulty is in seconds. Letter count = seconds * 2.5.
var countdownTarget;

function setDifficulty(d) { 
    // Take a number of seconds as input and update the difficulty text
    difficulty = d;
    document.getElementById("difficulty").textContent = `${Math.round(difficulty * LPS)} letters / ${difficulty + Math.round(0.05 * LPS * difficulty)} seconds`;
}

function genText() { 
    // Generate the text to be written
    const REQUIRED_LEN = Math.round(difficulty * LPS);
    text = txtgen.sentence();

    
    while (countLetters(text) != REQUIRED_LEN) {
        if (countLetters(text) > REQUIRED_LEN) {
            text = text.slice(0, -1);
        }

        else {
            text = text + " " + txtgen.sentence();
        }
    }

    return text;
}

function toggleKeyHints(b) {
    // Take in a boolean as input and enable/disable key hints
    keyhints = document.getElementsByClassName('keyhint');
    for (let i = 0; i < keyhints.length; i++) {
        keyhints[i].style.visibility = b ? null : 'hidden';
        //console.log(i.toString() + '. ' + keyhints[i].style.visibility);
    }
}

function startTimer() {

    startButton = document.getElementById("timer-start");

    if (startButton.style.visibility == 'hidden') {
        return;
    }

    startButton.style.visibility = 'hidden';
    toggleKeyHints(true);
    document.getElementById("timer-text").innerText = " Get ready! Starting in 3...";

    let getReadyCountdownTarget = (new Date()).getTime() + 4000;
    let getReadyCountdown = setInterval(function() {
        let now = (new Date()).getTime();
        let distance = Math.floor((getReadyCountdownTarget - now) / 1000);
        document.getElementById("timer-text").innerText = " Get ready! Starting in " + distance.toString() + "...";

        if (distance < 1) {
            document.getElementById("timer-text").innerText = " Starting now!";
            clearInterval(getReadyCountdown);
            countdownTarget = (new Date()).getTime() + (1000 * difficulty) + (Math.round(0.05 * LPS * difficulty) * 1000);
            level_running = true;
        }

    }, 1000);
}

function setupLevel(d) {
    // Take a number of seconds as input and set up level
    try {
        window.clearTimer("Loading...");
    }
    catch (e) {
        if (!(e instanceof TypeError)) {
            throw e;
        }
    }
    setDifficulty(d);
    toggleKeyHints(false);
    level_running = false;
    lines = lineSplit(genText());
    renderChallengeText(lines);
    scrollTo(document.getElementById(`challenge-line-1`));
    console.log('Level starting with difficulty ' + d.toString());
    document.getElementById("timer-seconds").innerText = (difficulty + Math.round(0.05 * LPS * difficulty)).toString().padStart(4, '0')
    document.getElementById("timer-start").style.visibility = null;

    let timer = setInterval(function() {
        if (!level_running) {
            return;
        }
        let now = (new Date()).getTime();
        let distance = countdownTarget - now;
        document.getElementById("timer-seconds").innerText = (Math.floor(distance/1000)).toString().padStart(4, '0')
        //document.getElementById("timer-text").innerText = humanizeDuration(Math.floor(distance/1000) * 1000);
        document.getElementById("timer-text").innerText = " seconds"

        function clearTimer(message) {
            clearInterval(timer);
            document.getElementById("timer-seconds").innerText = '0000';
            document.getElementById("timer-text").innerText =  ' ' + message;
            toggleKeyHints(false);
            document.getElementsByClassName('keyhint'); // For some reason the visibility does not change properly when this is not present
        }
        window.clearTimer = clearTimer;

        if (distance <= 1000) {
            clearTimer("Time's up!");
        }

    }, 1000);


    document.onkeydown = (e) => {

        if (e.repeat || !level_running) {
            return;
        }

        if (e.key == " ") {
            e.preventDefault();
        }

        if (e.key == "Enter" || e.key == " ") {
            lines.selected++;
        }
    
        else if (e.key == 'Backspace' && lines.selected > 0) {
            lines.selected--;
        }
        else {
            return;
        }
    
        if (lines.selected + 1 > lines.lines.length) {
            level_running = false;
            document.onkeydown = null;
            window.clearTimer("Challenge complete!");
        }
        else {
            //document.getElementById(`challenge-line-${lines.selected+1}`).scrollIntoView();
            scrollTo(document.getElementById(`challenge-line-${lines.selected+1}`));
        }
    
        renderChallengeText(lines);
        
    }

}

setupLevel(100);
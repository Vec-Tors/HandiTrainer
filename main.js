
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
    for (i = 0; i < text.length; i++) {
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
        for (i = 0; i < this.lines.length; i++) {
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
    for (i = 0; i < words.length; i++) {
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

function setDifficulty(d) { 
    // Take a number of seconds as input and update the difficulty text
    difficulty = d;
    document.getElementById("difficulty").textContent = `${Math.round(difficulty * LPS)} letters / ${difficulty} seconds`;
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

function startLevel(d) {
    // Take a number of seconds as input and set up level
    setDifficulty(d);
    level_running = true;
    lines = lineSplit(genText());
    renderChallengeText(lines);
    console.log('Level starting with difficulty ' + d.toString());

    document.onkeydown = (e) => {

        if (e.repeat || !level_running) {
            return;
        }

        if (e.key == "Enter") {
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
        }
        else {
            //document.getElementById(`challenge-line-${lines.selected+1}`).scrollIntoView();
            scrollTo(document.getElementById(`challenge-line-${lines.selected+1}`));
        }
    
        renderChallengeText(lines);
        
    }
}

startLevel(1000);
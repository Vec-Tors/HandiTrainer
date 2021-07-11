
const LPS = 2.5; // Letters per second
var difficulty; // Difficulty is in seconds. Letter count = seconds * 2.5.

function setDifficulty(d) { 
    // Take a number of seconds as input and update the difficulty text
    difficulty = d;
    document.getElementById("difficulty").textContent = `${Math.round(difficulty * LPS)} letters / ${difficulty} seconds`;
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
        else {
            lines.push(words[i] + ' ');
        }
    }

    return lines;
}

function renderChallengeText(lines) {
    // Take an array of strings and display them in the challenge text div
    let box = document.getElementById("challenge-text");
    box.innerHTML = "";
    for (i = 0; i < lines.length; i++) {
        box.innerHTML += `<br><p class="challenge-text">${lines[i]}</p>`
    }
}

setDifficulty(20);
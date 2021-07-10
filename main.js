
const LPS = 2.5; // Letters per second
var difficulty; // Difficulty is in seconds. Letter count = seconds * 2.5.

function setDifficulty(d) { 
    // Take a number of seconds as input and update the difficulty text
    difficulty = d;
    document.getElementById("difficulty").textContent = `${Math.round(difficulty * LPS)} letters / ${difficulty} seconds`;
}

function countLetters(text) { 
    // Count the characters in a str without spaces (includes punctuation)
    var length = 0;
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

setDifficulty(20);
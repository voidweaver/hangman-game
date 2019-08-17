var words = [];
var words_raw;

function preload() {
    words_raw = loadStrings("google-10000-english-usa-no-swears.txt");
}

var game;

function setup() {
    for (let i = 0; i < words_raw.length; i++) {
        let word = words_raw[i];
        if (word.length >= 3 && word.length <= 10) {
            words.push(word);
        }
    }

    let w = document.documentElement.clientWidth;
    let h = document.documentElement.clientHeight - 68 - 24;
    createCanvas(w, h);
    smooth();
    game = new Hangman(words);
}

function draw() {
    background(255);
    game.draw();
}

function keyPressed() {
    if (key.length == 1 && key.match(/[a-zA-Z]/))
        game.guess(key);
    else if (key == ' ' && game.completed) {
        game.next();
    }
}

class Hangman {
    constructor(dict) {
        this.dict = dict;

        this.word = "";
        this.underscores = "";
        this.difficulty = "";
        this.knownIndex = [];
        this.guessedChars = [];
        this.completed = false;
        this.usedIndex = [];

        this.next();
    }

    draw() {
        fill(0);
        textAlign(CENTER);
        textSize(120);
        textFont("Poppins");
        text(this.underscores, width / 2, height / 2);
        textSize(40);
        text("Difficulty:\t" + this.difficulty, width / 2, height / 6);
        textSize(30);
        text("Guessed characters:\n" + this.getFormattedGuesses(), width / 2, height * 17 / 24);
        if (this.completed) {
            text("Press [SPACE] for next word", width / 2, height * 22 / 24)
        }
    }

    guess(ch) {
        if (!this.completed) {
            let foundOne = false;
            for (let i = 0; i < this.word.length; i++) {
                if (this.word[i] != " " && this.word[i] == ch.toUpperCase() && !this.knownIndex.includes(i)) {
                    this.knownIndex.push(i);
                    foundOne = true;
                }
            }
            if (foundOne) {
                this.underscores = this.getUnderscores(this.word);
                this.checkCompleted();
            }
            if (!this.guessedChars.includes(ch.toUpperCase()))
                this.guessedChars.push(ch.toUpperCase());
        }
    }

    checkCompleted() {
        if (this.knownIndex.length == this.word.replace(' ', '').length) {
            this.completed = true;
        }
    }

    next() {
        if (this.usedIndex.length == words.length) {
            this.usedIndex = [];
        }
        let i = Math.floor(Math.random() * words.length);
        while (this.usedIndex.includes(i)) {
            i = Math.floor(Math.random() * words.length);
        }
        let quotient = i / words.length;
        if (quotient <= 1 / 3)
            this.difficulty = "Easy";
        else if (quotient <= 2 / 3)
            this.difficulty = "Medium";
        else
            this.difficulty = "Hard";
        this.word = words[i].toUpperCase();
        this.usedIndex.push(i);
        this.knownIndex = [];
        this.guessedChars = [];
        this.underscores = this.getUnderscores(this.word);
        this.completed = false;
    }

    getUnderscores(word) {
        let underscores = "";
        for (let i = 0; i < word.length; i++) {
            if (this.knownIndex.includes(i)) {
                underscores += word[i] + " ";
            } else {
                if (word[i] != " ") {
                    underscores += "＿ ";
                } else {
                    underscores += "   ";
                }
            }
        }
        return underscores.substring(0, underscores.length - 1);
    }

    getFormattedGuesses() {
        let output = "";
        for (let i = 0; i < this.guessedChars.length; i++) {
            output += this.guessedChars[i] + ", ";
        }
        output = output.substring(0, output.length - 2);
        output = output == "" ? "None" : output;
        return output;
    }
}
const words = ["CUITELO", "PEIXE", "SURRIA", "CABILDRO", "NORDÉS", "CACHELO", "CANELA", "CANCELLA", "CHEPA", "CANAVEIRA"];

let secretWord = words[Math.floor(Math.random() * words.length)]; // Seleccionar palabra aleatoria
let attemptsLeft = 5;

function checkWord() {
    let input = document.getElementById("guessInput");
    let guess = input.value.toUpperCase().trim();
    let attemptsDiv = document.getElementById("attempts");
    let message = document.getElementById("message");

    if (guess.length !== secretWord.length) {
        message.innerText = `La palabra debe tener ${secretWord.length} letras.`;
        return;
    }

    if (guess === secretWord) {
        message.innerHTML = `<span class="correct">¡Acertaste! La palabra era ${secretWord} ??</span>`;
        input.disabled = true;
        return;
    }

    let resultDiv = document.createElement("div");
    for (let i = 0; i < guess.length; i++) {
        let letterSpan = document.createElement("span");
        letterSpan.classList.add("letter");
        letterSpan.innerText = guess[i];

        if (guess[i] === secretWord[i]) {
            letterSpan.classList.add("correct");
        } else if (secretWord.includes(guess[i])) {
            letterSpan.classList.add("present");
        } else {
            letterSpan.classList.add("absent");
        }

        resultDiv.appendChild(letterSpan);
    }

    attemptsDiv.appendChild(resultDiv);
    attemptsLeft--;

    if (attemptsLeft === 0) {
        message.innerHTML = `<span class="absent">Te quedaste sin intentos. La palabra era ${secretWord} ??</span>`;
        input.disabled = true;
    }

    input.value = "";
}

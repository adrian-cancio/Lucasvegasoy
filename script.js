document.addEventListener('DOMContentLoaded', () => {

    const RAW_FILES = "https://raw.githubusercontent.com/Lucasvegasoy/Lucasvegasoy/";    
    
    // =======================
    // 0. Textos (para facilitar traducciones)
    // =======================
    const TEXTS = {
        HEADER_TITLE: "ADIVÍA A PALABRA",
        DARK_MODE_BTN: "🌓",
        NEW_WORD_BTN: "Nova Palabra",
        ENTER_BTN: "Probar",
        MSG_INCOMPLETE: "Faltánche letras",
        MSG_INVALID: "Usa outra palabra",
        FINAL_TITLE_WIN: "¡Noraboa!",
        FINAL_TITLE_LOSE: "Perdiche...",
        FINAL_TEXT: "A palabra érache: "
    };

    // Insertar textos en los elementos HTML
    document.querySelector('.header-title').textContent = TEXTS.HEADER_TITLE;
    document.getElementById('dark-mode-btn').textContent = TEXTS.DARK_MODE_BTN;
    document.getElementById('new-word-btn').textContent = TEXTS.NEW_WORD_BTN;
    document.getElementById('enter-btn').textContent = TEXTS.ENTER_BTN;
    document.getElementById('final-restart').textContent = TEXTS.NEW_WORD_BTN;

    // =======================
    // 1. Variables globales
    // =======================
    let words = [];
    let targetWord = '';
    let rows = 6;         // Cantidad de intentos
    let cols = 5;         // Se redefine según la palabra objetivo
    let currentRow = 0;
    let currentCol = 0;
    let accentNext = false; // La próxima vocal se acentuará si es true

    // Referencias a elementos del DOM
    const boardContainer = document.getElementById('board-container');
    const keyboardContainer = document.getElementById('keyboard-container');
    const newWordBtn = document.getElementById('new-word-btn');
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const messageContainer = document.getElementById('message-container');
    const finalContainer = document.getElementById('final-container');
    const finalTitle = document.getElementById('final-title');
    const finalText = document.getElementById('final-text');
    const finalRestart = document.getElementById('final-restart');

    // Botón para forzar el teclado móvil y el input oculto
    const mobileKeyboardBtn = document.getElementById('mobile-keyboard-btn');
    const mobileInput = document.getElementById('mobile-input');



    // Mapa para añadir acentos a vocales mayúsculas
    const accentMap = {
        'A': 'Á',
        'E': 'É',
        'I': 'Í',
        'O': 'Ó',
        'U': 'Ú'
    };

    // ============================
    // 2. Funciones de ayuda
    // ============================
    function removeAccents(str) {
        return str.normalize("NFD")
            .replace(/(?<![nN])[\u0300-\u036f]/g, "")
            .normalize("NFC");
    }

    function isWordValid(guess) {
        const guessNorm = removeAccents(guess.toLowerCase());
        return words.some(original => {
            return removeAccents(original) === guessNorm;
        });
    }

    function setAccentNext() {
        accentNext = true;
    }

    // ============================
    // 3. Construir tablero
    // ============================
    function createBoard() {
        boardContainer.innerHTML = '';
        for (let r = 0; r < rows; r++) {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('board-row');
            rowDiv.style.gridTemplateColumns = `repeat(${cols}, 62px)`;
            for (let c = 0; c < cols; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                rowDiv.appendChild(cell);
            }
            boardContainer.appendChild(rowDiv);
        }
    }

    // ============================
    // 4. Cargar palabras
    // ============================
    function loadWords() {
        return fetch(RAW_FILES + 'refs/heads/main/words.txt')
            .then(response => response.text())
            .then(text => {
                const allWords = text.split('\n')
                    .map(w => w.trim().toLowerCase())
                    .filter(w => w.length > 0);
                return allWords;
            });
    }

    // ============================
    // 5. Obtener palabra aleatoria
    // ============================
    function getRandomWord(wordList) {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        return wordList[randomIndex];
    }

    // ============================
    // 6. Iniciar el juego
    // ============================
    function startGame() {
        currentRow = 0;
        currentCol = 0;
        targetWord = getRandomWord(words);
        cols = targetWord.length;
        createBoard();
        console.log('Palabra objetivo:', targetWord);
        finalContainer.classList.add('hidden');
    }

    // ============================
    // 7. Manejo de teclas
    // ============================
    function handleKey(letter) {
        if (currentRow >= rows) return;
        if (accentNext && accentMap[letter]) {
            letter = accentMap[letter];
        }
        accentNext = false;
        if (currentCol < cols) {
            const row = boardContainer.children[currentRow];
            const cell = row.children[currentCol];
            cell.textContent = letter.toUpperCase();
            currentCol++;
        }
    }

    function handleBackspace() {
        if (currentRow >= rows) return;
        if (currentCol > 0) {
            currentCol--;
            const row = boardContainer.children[currentRow];
            const cell = row.children[currentCol];
            cell.textContent = '';
        }
    }

    function showMessage(msg) {
        messageContainer.textContent = msg;
        messageContainer.classList.add('show');
        setTimeout(() => {
            messageContainer.classList.remove('show');
        }, 2000);
    }

    function showFinalMessage(won, word) {
        if (won) {
            finalTitle.textContent = TEXTS.FINAL_TITLE_WIN;
        } else {
            finalTitle.textContent = TEXTS.FINAL_TITLE_LOSE;
        }
        finalText.textContent = TEXTS.FINAL_TEXT + word.toUpperCase();
        finalContainer.classList.remove('hidden');
    }

    // ============================
    // 8. Validar intento (Enter)
    // ============================
    function handleEnter() {
        if (currentRow >= rows) return;
        if (currentCol < cols) {
            showMessage(TEXTS.MSG_INCOMPLETE);
            return;
        }
        const row = boardContainer.children[currentRow];
        let guess = '';
        for (let c = 0; c < cols; c++) {
            guess += row.children[c].textContent;
        }
        guess = guess.toLowerCase();
        if (!isWordValid(guess)) {
            showMessage(TEXTS.MSG_INVALID);
            return;
        }
        const guessNorm = removeAccents(guess);
        const targetNorm = removeAccents(targetWord.toLowerCase());

        for (let i = 0; i < cols; i++) {
            const cell = row.children[i];
            const guessLetterNorm = guessNorm[i];
            const targetLetter = targetWord[i];
            const targetLetterNorm = targetNorm[i];
            if (guessLetterNorm === targetLetterNorm) {
                cell.classList.add('correct');
                cell.textContent = targetLetter.toUpperCase();
            } else if (targetNorm.includes(guessLetterNorm)) {
                cell.classList.add('present');
            } else {
                cell.classList.add('absent');
            }
        }
        if (guessNorm === targetNorm) {
            showFinalMessage(true, targetWord);
            currentRow = rows;
            return;
        }
        currentRow++;
        currentCol = 0;
        if (currentRow === rows) {
            showFinalMessage(false, targetWord);
        }
    }

    // ============================
    // 9. Eventos
    // ============================
    // Capturamos las teclas físicas (o del teclado móvil nativo tras focus)
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if (key === 'Dead' || key === '´') {
            setAccentNext();
        } else if (/^[a-zñA-ZÑ]$/.test(key)) {
            handleKey(key.toUpperCase());
        } else if (key === 'Backspace') {
            handleBackspace();
        } else if (key === 'Enter') {
            handleEnter();
        }
    });

    // Teclado virtual
    keyboardContainer.addEventListener('click', (event) => {
        if (!event.target.classList.contains('key')) return;
        const keyPressed = event.target.textContent.trim();
        if (keyPressed === TEXTS.ENTER_BTN) {
            handleEnter();
        } else if (keyPressed === '⌫') {
            handleBackspace();
        } else if (keyPressed === '´') {
            setAccentNext();
        } else {
            handleKey(keyPressed);
        }
    });

    // Botón para generar una palabra nueva
    newWordBtn.addEventListener('click', () => {
        startGame();
    });

    // Botón para tema oscuro
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Botón para reiniciar tras ganar/perder
    finalRestart.addEventListener('click', () => {
        finalContainer.classList.add('hidden');
        startGame();
    });

    // Botón para forzar teclado móvil
    mobileKeyboardBtn.addEventListener('click', () => {
        // Enfoca el input oculto para que el móvil muestre su teclado
        mobileInput.focus();
    });

    // ============================
    // 10. Flujo inicial
    // ============================
    loadWords()
        .then((wordList) => {
            words = wordList;
            startGame();
        })
        .catch(err => console.error('Error al cargar palabras:', err));

    // ============================
    // 11. Prevenir foco en botones
    // ============================
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('mousedown', e => e.preventDefault());
    });
});

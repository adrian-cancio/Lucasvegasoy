document.addEventListener('DOMContentLoaded', () => {
    // Variables globales
    let words = [];
    let targetWord = '';
    let rows = 6;        // Cantidad de intentos
    let cols = 5;        // Se redefinirá en función de la palabra objetivo
    let currentRow = 0;
    let currentCol = 0;

    // Referencias a elementos del DOM
    const boardContainer = document.getElementById('board-container');
    const keyboardContainer = document.getElementById('keyboard-container');
    const newWordBtn = document.getElementById('new-word-btn');

    function removeAccents(str) {
        // Convierte a forma de descomposición Unicode (NFD) y elimina los acentos
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function getRandomWord(wordList) {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        return wordList[randomIndex]; // "canción" tal cual
    }

    function isWordValid(guess) {
        // Normaliza el intento
        const guessNorm = removeAccents(guess.toLowerCase());

        // Recorre la lista y ve si alguna coincide en su forma normalizada
        return words.some(original => {
            return removeAccents(original) === guessNorm;
        });
    }



    // 1. Construir tablero (6 filas x [cols dinámicas])
    function createBoard() {
        boardContainer.innerHTML = ''; // Limpia el tablero si existe

        for (let r = 0; r < rows; r++) {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('board-row');

            // Ajusta la cuadrícula para la cantidad de columnas
            rowDiv.style.gridTemplateColumns = `repeat(${cols}, 62px)`;

            for (let c = 0; c < cols; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                rowDiv.appendChild(cell);
            }
            boardContainer.appendChild(rowDiv);
        }
    }

    // 2. Cargar palabras desde words.txt (o URL externa)
    function loadWords() {
        fetch('https://raw.githubusercontent.com/adrian-cancio/Lucasvegasoy/refs/heads/main/words.txt')
            .then(response => response.text())
            .then(text => {
                words = text.split('\n')
                    .map(w => w.trim().toLowerCase())
                    .filter(w => w.length > 0);
                return words;
            });
    }

    // 3. Elegir una palabra al azar
    function getRandomWord(wordList) {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        return wordList[randomIndex];
    }

    // 4. Iniciar juego con una palabra nueva
    function startGame() {
        // Reiniciar estado
        currentRow = 0;
        currentCol = 0;

        // Escoger palabra
        targetWord = getRandomWord(words);
        // Redefinir cols según la longitud de la palabra
        cols = targetWord.length;

        createBoard();
        console.log('Palabra objetivo:', targetWord); // Para pruebas
    }

    // 5. Manejar entrada de letras
    function handleKey(letter) {
        if (currentRow >= rows) return;  // Si ya no hay más intentos

        if (currentCol < cols) {
            // Colocar la letra en la celda correspondiente
            const row = boardContainer.children[currentRow];
            const cell = row.children[currentCol];
            cell.textContent = letter.toUpperCase();
            currentCol++;
        }
    }

    // 6. Eliminar última letra (Backspace)
    function handleBackspace() {
        if (currentCol > 0) {
            currentCol--;
            const row = boardContainer.children[currentRow];
            const cell = row.children[currentCol];
            cell.textContent = '';
        }
    }

    // 7. Validar intento (Enter)
    function handleEnter() {
        if (currentCol < cols) {
            alert('Completa todas las letras antes de validar.');
            return;
        }

        // Construimos el guess tal cual lo escribió el usuario (con acentos si puso)
        const row = boardContainer.children[currentRow];
        let guess = '';
        for (let c = 0; c < cols; c++) {
            guess += row.children[c].textContent;  // "canción" o "cancion"
        }
        guess = guess.toLowerCase();

        // 1. Verificar si la palabra está en la lista (ignorando acentos)
        if (!isWordValid(guess)) {
            alert('La palabra no es válida.');
            return;
        }

        // 2. Normalizar guess y target para la comparación
        const guessNorm = removeAccents(guess);
        const targetNorm = removeAccents(targetWord.toLowerCase());

        // 3. Colorear celdas
        for (let i = 0; i < cols; i++) {
            const cell = row.children[i];
            const guessLetterNorm = guessNorm[i];
            const targetLetterNorm = targetNorm[i];

            if (guessLetterNorm === targetLetterNorm) {
                // Posición correcta
                cell.classList.add('correct');
            } else if (targetNorm.includes(guessLetterNorm)) {
                // Letra existe en otra posición
                cell.classList.add('present');
            } else {
                // Letra no existe en la palabra
                cell.classList.add('absent');
            }
        }

        // 4. Verificar victoria
        if (guessNorm === targetNorm) {
            alert('¡Felicidades! Adivinaste la palabra.');
            currentRow = rows; // Bloquea más entradas
            return;
        }

        // 5. Avanzar a la siguiente fila
        currentRow++;
        currentCol = 0;

        // 6. Si se agotan las filas
        if (currentRow === rows) {
            alert('Lo siento, has perdido. La palabra era: ' + targetWord.toUpperCase());
        }
    }

    // 8. Eventos de teclado físico
    document.addEventListener('keydown', (e) => {
        const key = e.key;

        // Letras (incluyendo Ñ)
        if (/^[a-zñA-ZÑ]$/.test(key)) {
            handleKey(key.toUpperCase());
        } else if (key === 'Backspace') {
            handleBackspace();
        } else if (key === 'Enter') {
            handleEnter();
        }
    });

    // 9. Eventos de teclado virtual (clicks)
    keyboardContainer.addEventListener('click', (event) => {
        if (!event.target.classList.contains('key')) return;
        const keyPressed = event.target.textContent.trim();

        if (keyPressed === 'Enter') {
            handleEnter();
        } else if (keyPressed === '⌫') {
            handleBackspace();
        } else {
            handleKey(keyPressed);
        }
    });

    // 10. Botón "Nueva Palabra"
    newWordBtn.addEventListener('click', () => {
        startGame();
    });

    // === Flujo inicial ===
     loadWords()
        .then((wordList) => {
            words = wordList;
            startGame(); // Empieza con una palabra al cargar
        })
        .catch(err => console.error('Error al cargar palabras:', err));
});

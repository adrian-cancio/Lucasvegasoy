document.addEventListener('DOMContentLoaded', () => {
    // =======================
    // 1. Variables globales
    // =======================
    let words = [];
    let targetWord = '';
    let rows = 6;         // Cantidad de intentos
    let cols = 5;         // Se redefine según la palabra objetivo
    let currentRow = 0;
    let currentCol = 0;
    let accentNext = false; // Nueva variable: la próxima vocal se acentuará

    // Referencias a elementos del DOM
    const boardContainer = document.getElementById('board-container');
    const keyboardContainer = document.getElementById('keyboard-container');
    const newWordBtn = document.getElementById('new-word-btn');
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const messageContainer = document.getElementById('message-container');

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

    // Quita acentos de una cadena (ej. "á" => "a") 
    // *NO* convierte "ñ" en "n", por lo que "ñ" se considera distinta.
    function removeAccents(str) {
        return str.normalize("NFD")
            .replace(/(?<![nN])[\u0300-\u036f]/g, "")
            .normalize("NFC");
    }

    // Verifica si guess (sin acentos) existe en la lista (también sin acentos)
    function isWordValid(guess) {
        const guessNorm = removeAccents(guess.toLowerCase());
        return words.some(original => {
            return removeAccents(original) === guessNorm;
        });
    }

    // En lugar de addAccentToLastLetter(), usamos setAccentNext()
    function setAccentNext() {
        accentNext = true;
    }

    // ============================
    // 3. Construir tablero
    // ============================
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

    // ============================
    // 4. Cargar palabras
    // ============================
    function loadWords() {
        // Cambia la URL si necesitas otra ruta a tu words.txt
        return fetch('https://raw.githubusercontent.com/adrian-cancio/Lucasvegasoy/refs/heads/main/words.txt')
            .then(response => response.text())
            .then(text => {
                // Aceptamos palabras de cualquier longitud
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

        // Escoger palabra al azar
        targetWord = getRandomWord(words);

        // Ajustar el número de columnas según la longitud de la palabra
        cols = targetWord.length;

        // Reconstruir el tablero con el nuevo número de columnas
        createBoard();

        console.log('Palabra objetivo:', targetWord); // Para pruebas
    }

    // ============================
    // 7. Manejo de teclas
    // ============================

    // Escribir una letra en la celda actual, aplicando acento si corresponde
    function handleKey(letter) {
        if (currentRow >= rows) return;  // No hay más intentos

        if (accentNext && accentMap[letter]) {
            letter = accentMap[letter];
        }
        accentNext = false; // Reiniciamos el flag

        if (currentCol < cols) {
            const row = boardContainer.children[currentRow];
            const cell = row.children[currentCol];
            cell.textContent = letter.toUpperCase();
            currentCol++;
        }
    }

    // Borrar última letra
    function handleBackspace() {
        if (currentRow >= rows) return; // Prevenir que se procese si el juego ya terminó
        if (currentCol > 0) {
            currentCol--;
            const row = boardContainer.children[currentRow];
            const cell = row.children[currentCol];
            cell.textContent = '';
        }
    }

    // Función para mostrar mensaje en pantalla
    function showMessage(msg) {
        messageContainer.textContent = msg;
        messageContainer.classList.add('show');
        // Oculta el mensaje tras 2 segundos (puedes ajustar el tiempo)
        setTimeout(() => {
            messageContainer.classList.remove('show');
        }, 2000);
    }

    // Validar intento al presionar Enter
    function handleEnter() {
        if (currentRow >= rows) return; // Prevenir que se procese si el juego ya terminó
        if (currentCol < cols) {
            showMessage('Completa todas las letras antes de validar.');
            return;
        }

        // Construir la palabra ingresada
        const row = boardContainer.children[currentRow];
        let guess = '';
        for (let c = 0; c < cols; c++) {
            guess += row.children[c].textContent; // con tildes si las hay
        }
        guess = guess.toLowerCase();

        // 1. Verificar si la palabra existe en la lista (ignorando acentos)
        if (!isWordValid(guess)) {
            showMessage('La palabra no es válida.');
            return;
        }

        // 2. Normalizar guess y target para la comparación
        const guessNorm = removeAccents(guess);
        const targetNorm = removeAccents(targetWord.toLowerCase());

        // 3. Colorear celdas
        for (let i = 0; i < cols; i++) {
            const cell = row.children[i];
            const guessLetter = cell.textContent; // letra que se ve en pantalla
            const guessLetterNorm = guessNorm[i];
            const targetLetter = targetWord[i];   // puede tener tilde
            const targetLetterNorm = targetNorm[i];

            if (guessLetterNorm === targetLetterNorm) {
                // Letra correcta en posición
                cell.classList.add('correct');
                // Si la palabra objetivo tiene tilde, la mostramos
                cell.textContent = targetLetter.toUpperCase();
            } else if (targetNorm.includes(guessLetterNorm)) {
                // Letra está en la palabra, pero en otra posición
                cell.classList.add('present');
            } else {
                // Letra no existe en la palabra
                cell.classList.add('absent');
            }
        }

        // 4. Verificar victoria (ignorando acentos)
        if (guessNorm === targetNorm) {
            showMessage('¡Felicidades! Adivinaste la palabra.');
            currentRow = rows; // Bloquea más entradas
            return;
        }

        // 5. Avanzar a la siguiente fila
        currentRow++;
        currentCol = 0;

        // 6. Si se agotan las filas
        if (currentRow === rows) {
            showMessage('Lo siento, has perdido. La palabra era: ' + targetWord.toUpperCase());
        }
    }

    // ============================
    // 8. Eventos
    // ============================

    // a) Teclado físico
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        // Si es acento (Dead key o '´'), marca la próxima vocal para acentuar
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

    // b) Teclado virtual (clicks)
    keyboardContainer.addEventListener('click', (event) => {
        if (!event.target.classList.contains('key')) return;
        const keyPressed = event.target.textContent.trim();

        if (keyPressed === 'Enter') {
            handleEnter();
        } else if (keyPressed === '⌫') {
            handleBackspace();
        } else if (keyPressed === '´') {
            setAccentNext();
        } else {
            handleKey(keyPressed);
        }
    });

    // c) Botón "Nueva Palabra"
    newWordBtn.addEventListener('click', () => {
        startGame();
    });

    // d) Botón "Tema Oscuro"
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // ============================
    // 9. Flujo inicial
    // ============================
    loadWords()
        .then((wordList) => {
            words = wordList;
            startGame(); // Inicia con una palabra al cargar
        })
        .catch(err => console.error('Error al cargar palabras:', err));

    // ============================
    // 10. Prevenir foco en botones
    // ============================
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('mousedown', e => e.preventDefault());
    });
});

// Importar módulos y utilidades importantes
import { mostrarAlerta } from '../alerta.js';

// Elementos del DOM
const startScreenDIV = document.getElementById('startScreen');
const mainPortDIV = document.querySelector('.mainPort');
const breadcrumbDIV = document.getElementById('breadcrumb');
const navigationIndicatorDIV = document.getElementById('navigationIndicator');
const questionsDIV = document.getElementById('questions');
const answersDIV = document.getElementById('answers');
const nextQuestionDIV = document.getElementById('nextQuestion');
const questionsTag = document.getElementById('questionsTag');
const windowDecorDIV = document.getElementById('decoration');

// Iniciar la pantalla de inicio
export function showStartScreen(startStudySession) {
    startScreenDIV.innerHTML = "";
    startScreenDIV.style.display = 'block';
    mainPortDIV.style.display = 'none';

    // Decoración de la ventana
    const windowDecor = document.createElement('div');
    windowDecor.classList.add("windowDecor");
    startScreenDIV.appendChild(windowDecor);

    const windowStartTitle = document.createElement('div');
    windowDecor.appendChild(windowStartTitle);

    const windowStartTitleIcon = document.createElement('i');
    windowStartTitleIcon.classList.add("fa-sharp", "fa-solid", "fa-book", "windowStartTitleIcon");
    windowStartTitle.appendChild(windowStartTitleIcon);

    const windowStartTitleText = document.createElement ('span');
    windowStartTitleText.textContent = 'DOKKAI';
    windowStartTitleText.classList.add("windowStartTitle");
    windowStartTitle.appendChild(windowStartTitleText);

    const windowCloseItem = document.createElement('i');
    windowCloseItem.classList.add("fa-sharp", "fa-solid", "fa-xmark", "windowCloseIcon");
    windowDecor.appendChild(windowCloseItem);

    // Cajita de todo lo demás
    const startScreenMainContent = document.createElement('div');
    startScreenMainContent.id = "startScreenMainContent";
    startScreenDIV.appendChild(startScreenMainContent);

    // Instrucciones o descripción
    const description = document.createElement('p');
    description.textContent = 'Selecciona la dificultad y el nivel para comenzar tu sesión de estudio.';
    description.classList.add("instrucciones");
    description.classList.add("startScreenText");
    startScreenMainContent.appendChild(description);

    // Para el futuro... configuración de la sesión
    const sessionConfigMenu = document.createElement('div');
    sessionConfigMenu.id = "sessionConfigMenu";
    startScreenMainContent.appendChild(sessionConfigMenu);

    // Selección de dificultad
    const difficultySelector = document.createElement('div');
    difficultySelector.id = "difficultySelector";
    sessionConfigMenu.appendChild(difficultySelector);

    const difficultyLabel = document.createElement('label');
    difficultyLabel.classList.add('startScreenLabel');
    difficultyLabel.textContent = 'Dificultad: ';
    difficultySelector.appendChild(difficultyLabel);

    const difficultySelect = document.createElement('select');
    difficultySelect.id = 'difficultySelect';
    const difficulties = ['⭐', '⭐⭐', '⭐⭐⭐'];
    difficulties.forEach(diff => {
        const option = document.createElement('option');
        option.value = diff;
        option.textContent = diff;
        difficultySelect.appendChild(option);
    });
    difficultySelector.appendChild(difficultySelect);

    // Selección de nivel JLPT
    const levelSelector = document.createElement('div');
    levelSelector.id = "levelSelector";
    sessionConfigMenu.appendChild(levelSelector);

    const levelLabel = document.createElement('label');
    levelLabel.classList.add('startScreenLabel');
    levelLabel.textContent = ' Nivel JLPT: ';
    levelSelector.appendChild(levelLabel);

    const levelSelect = document.createElement('select');
    levelSelect.id = 'levelSelect';
    const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
    levels.forEach(level => {
        const option = document.createElement('option');
        option.value = level;
        option.textContent = level;
        levelSelect.appendChild(option);
    });
    levelSelector.appendChild(levelSelect);

    // Cantidad de ejercicios
    const exercisesCountSelector = document.createElement('div');
    exercisesCountSelector.id = "exercisesCountSelector";
    sessionConfigMenu.appendChild(exercisesCountSelector);

    const exercisesCountLabel = document.createElement('label');
    exercisesCountLabel.classList.add('startScreenLabel');
    exercisesCountLabel.id = ("exercisesCountLabel");
    exercisesCountLabel.textContent = 'Cantidad de ejercicios: ';
    exercisesCountSelector.appendChild(exercisesCountLabel);

    const exercisesCountSelect = document.createElement('select');
    exercisesCountSelect.id = 'exercisesCountSelect';
    for (let i = 1; i <= 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        exercisesCountSelect.appendChild(option);
    }
    exercisesCountSelector.appendChild(exercisesCountSelect);

    // Botón para comenzar
    const startButton = document.createElement('button');
    startButton.textContent = 'Comenzar Sesión';
    startButton.classList.add('startButton');
    startButton.onclick = () => {
        const selectedDifficulty = difficultySelect.value;
        const selectedLevel = levelSelect.value;
        const exercisesCount = parseInt(exercisesCountSelect.value);
        startStudySession(selectedDifficulty, selectedLevel, exercisesCount);
    };
    startScreenMainContent.appendChild(startButton);
}

// Mostrar la pantalla de lectura
export function showReadingScreen(ejercicio, proceedToQuestionsCallback) {
    startScreenDIV.style.display = 'none';
    mainPortDIV.style.display = 'block';
    nextQuestionDIV.style.display = 'block';

    clearMainPort();

    createWindowDecoration();

    const previousText = document.querySelector('.textoEjercicio');
    if (previousText) previousText.remove();

    const previousInstructions = document.querySelector('.instruccionesLectura');
    if (previousInstructions) previousInstructions.remove();

    const instruccionesElement = document.createElement('p');
    instruccionesElement.textContent = 'Lee el siguiente texto atentamente antes de responder las preguntas.';
    instruccionesElement.classList.add('instruccionesLectura');
    questionsDIV.appendChild(instruccionesElement);

    const textoElement = document.createElement('p');
    textoElement.innerHTML = ejercicio.texto.replace(/\n/g, '<br>');
    textoElement.classList.add('textoEjercicio');
    questionsDIV.appendChild(textoElement);

    const startButton = document.createElement('button');
    startButton.textContent = 'Comenzar preguntas de comprensión';
    startButton.classList.add('startButton');
    startButton.onclick = () => {
        proceedToQuestionsCallback();
    };
    nextQuestionDIV.appendChild(startButton);
}

// Mostrar la pantalla de preguntas
export function showQuestionScreen(ejercicio, currentQuestionIndex, currentExerciseIndex, ejercicioSession, handleAnswerCallback) {
    updateBreadcrumb(ejercicio);
    updateNavigationIndicator(ejercicio, currentQuestionIndex, currentExerciseIndex, ejercicioSession);
    displayQuestion(ejercicio, currentQuestionIndex);
    displayOptions(ejercicio, currentQuestionIndex, handleAnswerCallback);
    nextQuestionDIV.style.display = 'none';
}

// Mostrar la alerta final de que se terminaron los ejercicios
export function showFinalScreen(score, restartCallback) {
    mostrarAlerta({
        mensaje: '¡Has completado todos los ejercicios!',
        puntajeFinal: `Tuviste ${score} respuestas acertadas.`,
        callback: () => {
            restartCallback();
        }
    })
}

// Funciones de utilidades para componentes de UI
function createWindowDecoration() {
    windowDecorDIV.innerHTML = '';
    const windowDecor = document.createElement('div');
    windowDecor.classList.add('windowDecor');
    windowDecorDIV.appendChild(windowDecor);

    const windowStartTitle = document.createElement('div');
    windowDecor.appendChild(windowStartTitle);

    const windowStartTitleIcon = document.createElement('i');
    windowStartTitleIcon.classList.add('fa-sharp', 'fa-solid', 'fa-book', 'windowStartTitleIcon');
    windowStartTitle.appendChild(windowStartTitleIcon);

    const windowStartTitleText = document.createElement('span');
    windowStartTitleText.textContent = 'DOKKAI';
    windowStartTitleText.classList.add('windowStartTitle');
    windowStartTitle.appendChild(windowStartTitleText);

    const windowCloseItem = document.createElement('i');
    windowCloseItem.classList.add('fa-sharp', 'fa-solid', 'fa-xmark', 'windowCloseIcon');
    windowDecor.appendChild(windowCloseItem);
}

function createSessionConfigMenu() {
    const sessionConfigMenu = document.createElement('div');
    sessionConfigMenu.id = 'sessionConfigMenu';
    startScreenDIV.appendChild(sessionConfigMenu);

    // Create difficulty selector
    const difficultySelector = document.createElement('div');
    difficultySelector.id = 'difficultySelector';
    sessionConfigMenu.appendChild(difficultySelector);

    const difficultyLabel = document.createElement('label');
    difficultyLabel.classList.add('startScreenLabel');
    difficultyLabel.textContent = 'Dificultad: ';
    difficultySelector.appendChild(difficultyLabel);

    const difficultySelect = document.createElement('select');
    difficultySelect.id = 'difficultySelect';
    const difficulties = ['⭐', '⭐⭐', '⭐⭐⭐'];
    difficulties.forEach(diff => {
        const option = document.createElement('option');
        option.value = diff;
        option.textContent = diff;
        difficultySelect.appendChild(option);
    });
    difficultySelector.appendChild(difficultySelect);

    const levelSelector = document.createElement('div');
    levelSelector.id = "levelSelector";
    sessionConfigMenu.appendChild(levelSelector);

    const levelLabel = document.createElement('label');
    levelLabel.classList.add('startScreenLabel');
    levelLabel.textContent = ' Nivel JLPT: ';
    levelSelector.appendChild(levelLabel);

    const levelSelect = document.createElement('select');
    levelSelect.id = 'levelSelect';
    const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
    levels.forEach(level => {
        const option = document.createElement('option');
        option.value = level;
        option.textContent = level;
        levelSelect.appendChild(option);
    });
    levelSelector.appendChild(levelSelect);

    // Cantidad de ejercicios
    const exercisesCountSelector = document.createElement('div');
    exercisesCountSelector.id = "exercisesCountSelector";
    sessionConfigMenu.appendChild(exercisesCountSelector);

    const exercisesCountLabel = document.createElement('label');
    exercisesCountLabel.classList.add('startScreenLabel');
    exercisesCountLabel.id = ("exercisesCountLabel");
    exercisesCountLabel.textContent = 'Cantidad de ejercicios: ';
    exercisesCountSelector.appendChild(exercisesCountLabel);

    const exercisesCountSelect = document.createElement('select');
    exercisesCountSelect.id = 'exercisesCountSelect';
    for (let i = 1; i <= 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        exercisesCountSelect.appendChild(option);
    }
    exercisesCountSelector.appendChild(exercisesCountSelect);

    return sessionConfigMenu();
}

function clearMainPort() {

    const previousQuestions = document.querySelectorAll('.preguntaTexto');
    previousQuestions.forEach(question => question.remove());

    nextQuestionDIV.innerHTML = '';
    windowDecorDIV.innerHTML = '';
    breadcrumbDIV.innerHTML = '';
    navigationIndicatorDIV.innerHTML = '';
    answersDIV.style.display = 'none';
    questionsTag.style.display = 'none';
    document.getElementById('navigation').style.display = 'none';
}

function updateBreadcrumb(ejercicio) {
    breadcrumbDIV.innerHTML = `${ejercicio.dificultad} | ${ejercicio.capitulo}`;
}

function updateNavigationIndicator(ejercicio, currentQuestionIndex, currentExerciseIndex, ejercicioSession) {
    const preguntaNumero = ejercicio.preguntas[currentQuestionIndex].numero;
    const totalPreguntas = ejercicio.preguntas.length;
    navigationIndicatorDIV.innerHTML = `Ejercicio ${currentExerciseIndex + 1} de ${ejercicioSession.length} / Pregunta ${preguntaNumero} de ${totalPreguntas}`;
}

function displayQuestion(ejercicio, currentQuestionIndex) {
    // Remove previous question
    const previousQuestion = document.querySelector('.preguntaTexto');
    if (previousQuestion) previousQuestion.remove();

    questionsTag.style.display = 'block';

    // Display new question
    const nuevaPregunta = document.createElement('p');
    nuevaPregunta.textContent = ejercicio.preguntas[currentQuestionIndex].pregunta;
    nuevaPregunta.classList.add('preguntaTexto');

    const textoEjercicio = document.querySelector('.textoEjercicio');
    textoEjercicio.style.color = "grey";
    textoEjercicio.style.fontSize = "1rem";
    textoEjercicio.style.marginBottom = "1.5rem";
    textoEjercicio.style.marginLeft = "3%";
    textoEjercicio.style.marginRight = "3%";

    if (textoEjercicio) {
        textoEjercicio.after(questionsTag);
        questionsTag.after(nuevaPregunta);
    } else {
        questionsDIV.appendChild(questionsTag);
        questionsDIV.appendChild(nuevaPregunta);
    }
}

function displayOptions(ejercicio, currentQuestionIndex, handleAnswerCallback) {
    answersDIV.innerHTML = '';
    answersDIV.style.display = 'grid';
    document.getElementById('navigation').style.display = 'block';

    const opciones = ejercicio.preguntas[currentQuestionIndex].opciones;
    opciones.forEach(opcion => {
        const opcionElement = document.createElement('button');
        opcionElement.textContent = opcion;
        opcionElement.classList.add('opcion');

        opcionElement.onclick = () => {
            handleAnswerCallback(opcion);
        };

        answersDIV.appendChild(opcionElement);
    });
}

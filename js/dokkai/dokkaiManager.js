// Conecta el módulo y se declaran sus variables
import { showStartScreen, showReadingScreen, showQuestionScreen, showFinalScreen} from './dokkaiUI.js';
import { mostrarAlerta } from '../alerta.js';

let exercisesData = [];
let ejercicioSession = [];
let currentExercisesIndex = 0;
let currentQuestionIndex = 0;
let score = 0;
let ejercicioActual = null;

// Llaman los ejercicios del JSON
export async function loadDokkaiExercises() {
    try {
        const response = await fetch('db/dokkai.json');
        if (!response.ok) {
            throw new Error('Error al cargar los ejercicios de Dokkai');
        }
        const data = await response.json();
        exercisesData = data.ejercicios;
    } catch (error) {
        console.error(error);
        mostrarAlerta({
            mensaje: 'No se pudieron cargar los ejercicios de Dokkai.',
            callback: () => {},
        });
    }
}

//  Inicializa la sesión de Dokkai, cargando los ejercicios, reiniciando el estado y mostrando la pantalla de inicio
export async function initializeDokkaiSection() {
    if (exercisesData.length === 0) {
        await loadDokkaiExercises();
    }

    ejercicioSession = [];
    currentExercisesIndex = 0;
    currentQuestionIndex = 0;
    score = 0;
    ejercicioActual = null;

    showStartScreen(startStudySession);
}

// Inicia una sesión de estudio
function startStudySession(selectedDifficulty, selectedLevel, exercisesCount) {
    ejercicioSession = exercisesData.filter(ejercicio => {
        return ejercicio.dificultad === selectedDifficulty && ejercicio['nivel JLPT'] === selectedLevel;
    });

    if (ejercicioSession.length === 0) {
        mostrarAlerta({
            mensaje: 'No se encontraron ejercicios con los criterios seleccionados.',
            callback: () => {},
        });
        return;
    }

    ejercicioSession = ejercicioSession.sort(() => Math.random() - 0.5).slice(0, exercisesCount);
    
    currentExercisesIndex = 0;
    currentQuestionIndex = 0;
    score = 0;
    ejercicioActual = ejercicioSession[currentExercisesIndex];

    showReadingScreen(ejercicioActual, proceedToQuestions);
}

// Pasa de la pantalla de lectura a la pantalla de preguntas
function proceedToQuestions() {
    showQuestionScreen(ejercicioActual, currentQuestionIndex, currentExercisesIndex, ejercicioSession, handleAnswer);
}

// Determina si una respuesta es correcta o no y pasa la siguiente pregunta
function handleAnswer(selectedOption) {
    const currentQuestion = ejercicioActual.preguntas[currentQuestionIndex];
    if (selectedOption === currentQuestion.respuesta_correct) {
        score++;
        mostrarAlerta({
            mensaje: '¡Correcto!',
            callback: nextQuestion,
        });
    } else {
        mostrarAlerta({
            mensaje: 'Incorrecto',
            callback: nextQuestion,
        });
    }
}

// Pasa a la siguiente pregunta y al siguiente ejercicio cuando toca
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < ejercicioActual.preguntas.length) {
        showQuestionScreen(ejercicioActual, currentQuestionIndex, currentExercisesIndex, ejercicioSession, handleAnswer);
    } else {
        currentExercisesIndex++;
        if (currentExercisesIndex < ejercicioSession.length) {
            currentQuestionIndex = 0;
            ejercicioActual = ejercicioSession[currentExercisesIndex];
            showReadingScreen(ejercicioActual, proceedToQuestions);
        } else {
            showFinalScreen(score, initializeDokkaiSection);
        }
    }
}

export function mostrarAlerta({ mensaje, puntajeFinal = null, textoBoton = '次', mostrarBotonSiguiente = false, callback }) {
    const alerta = document.getElementById('alertaPersonalizada');
    const mensajeAlerta = document.getElementById('mensajeAlerta');
    const mensajePuntaje = document.getElementById('mensajePuntaje');
    const overlay = document.getElementById('overlay');
    const btnCerrarAlerta = document.getElementById('cerrarAlerta');
    const btnNextExercise = document.getElementById('btnNextExercise');

    mensajeAlerta.textContent = mensaje;

    if (puntajeFinal !== null) {
        mensajePuntaje.textContent = puntajeFinal;
        mensajePuntaje.style.display = 'block';
    } else {
        mensajePuntaje.style.display = 'none';
    }

    overlay.style.display = 'block';
    alerta.style.display = 'block';

    btnCerrarAlerta.style.display = 'none';
    btnNextExercise.style.display = 'none';

    if (mostrarBotonSiguiente) {
        btnNextExercise.style.display = 'block';
        btnNextExercise.textContent = textoBoton;
        btnNextExercise.onclick = () => {
            overlay.style.display = 'none';
            alerta.style.display = 'none';
            if (callback) {
                callback();
            }
        };
    } else {
        btnCerrarAlerta.style.display = 'block';
        btnCerrarAlerta.textContent = textoBoton;
        btnCerrarAlerta.onclick = () => {
            overlay.style.display = 'none';
            alerta.style.display = 'none';
            if (callback) {
                callback();
            }
        };
    }
}

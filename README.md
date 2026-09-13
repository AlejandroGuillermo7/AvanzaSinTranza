# Avanza sin Tranza — Pro Edition

Versión refinada del videojuego educativo con una capa de interfaz más cercana a un producto web terminado: diseño responsive, persistencia de sesión, microinteracciones, accesibilidad y feedback visual/sonoro.

## Mejoras Pro

- Interfaz tipo aplicación con navegación translúcida, design tokens y superficies consistentes.
- Nueva capa visual aislada en `css/pro.css` para no mezclarla con el CSS base.
- Partida persistente: si cierras o recargas el navegador puedes continuar desde el último nivel guardado.
- Racha visible, perfil del jugador y escena visual dinámica según el lugar del reto.
- Atajos de teclado A/B/C para responder usando la posición visible de las opciones.
- Feedback háptico opcional en dispositivos compatibles.
- Estados hover, focus, éxito, error, recuperación de vidas, insignias y victoria refinados.
- Mantiene funcionamiento local: no requiere backend, dependencias, servidor ni internet para jugar (ver nota sobre tipografías más abajo).

## Abrir el juego

1. Extrae la carpeta `avanza-sin-tranza` del ZIP.
2. Abre `index.html` con un navegador moderno, como Chrome, Edge, Firefox o Safari.
3. Escribe tu nombre o un apodo y pulsa **COMENZAR A JUGAR**.
4. Pulsa **RESOLVER RETO**, lee la situación y elige una respuesta.

No requiere instalaciones, internet, servidor, backend, frameworks ni una cuenta.
Mantén el HTML, el CSS y los dos archivos JavaScript en sus carpetas originales.
No abras el HTML desde dentro del ZIP: primero extrae todo el proyecto.

## Archivos

- `index.html`: pantallas, tablero, personaje SVG, ventanas y controles.
- `css/styles.css`: diseño base, responsive, estados, animaciones y accesibilidad visual.
- `css/pro.css`: capa visual Pro, design system y refinamientos de interfaz.
- `js/questions.js`: los 15 escenarios y sus respuestas y explicaciones.
- `js/app.js`: reglas, recorrido, vidas, puntos, récords, sonido y resultados.
- `README.md`: esta guía.

Los scripts son clásicos y se cargan con `defer`, primero `questions.js` y después
`app.js`. No se usa `fetch`, imports, CDNs ni imágenes externas. La única excepción
son las tipografías (ver "Tipografía" más abajo).

## Reglas

- Empiezas en la casilla 1 con **0 puntos y 3 vidas**.
- Cada respuesta correcta suma **100 puntos** y completa el nivel actual.
- El personaje pasa a la siguiente casilla; al resolver la 15, llegas a la meta.
- Cada respuesta incorrecta resta **25 puntos y 1 vida**. El mínimo es 0 puntos.
- Una respuesta incorrecta conserva el nivel actual y muestra una explicación.
- Todas las respuestas se bloquean después de elegir, evitando premios duplicados.
- Pulsa **VER MI AVANCE** para volver al tablero después de acertar.
- Pulsa **VOLVER A INTENTARLO** para responder de nuevo después de un error.
- Con 0 vidas puedes recuperar las 3 y reintentar: conservas el nivel y los puntos
  actuales. La penalización y los errores anteriores permanecen en tus estadísticas.
- También puedes reiniciar desde el nivel 1. Los récords guardados se conservan.
- Las opciones cambian de orden al abrir un reto para invitar a leer cada respuesta.

## Casillas especiales

| Nivel | Evento | Premio al acertar |
| --- | --- | --- |
| 3 | ⭐ Bonus de respeto | 100 + 50 puntos |
| 6 | ❓ Pregunta sorpresa | 100 + 25 puntos |
| 10 | 🎁 Recompensa ciudadana | 100 + 50 puntos y 1 vida, hasta un máximo de 3 |
| 13 | ⚠️ Situación difícil | 100 + 50 puntos |

Los bonus se obtienen una sola vez al completar su nivel. La puntuación máxima
de una partida sin errores es **1675 puntos**.

## Insignias

| Insignia | Condición |
| --- | --- |
| 🛡️ Defensor de la Honestidad | Alcanzar 300 puntos |
| ⭐ Ciudadano Responsable | Alcanzar 700 puntos |
| 💎 Juego Limpio | Acertar 5 veces seguidas, sin errores entre ellas |
| 🏆 Campeón contra la Corrupción | Completar los 15 niveles |

Una insignia obtenida no se pierde si luego baja la puntuación. El panel muestra
las insignias de la partida actual y se guarda la colección histórica por separado.

## Resultados

El porcentaje se calcula con **correctas / (correctas + incorrectas) × 100**,
redondeado al entero más cercano. Incluye todos los intentos: reintentar no borra
los errores. Se usa ese mismo porcentaje visible para asignar el título final.

| Porcentaje | Título |
| --- | --- |
| 90–100% | Ciudadano ejemplar |
| 70–89% | Defensor de la honestidad |
| 50–69% | Aprendiz anticorrupción |
| 0–49% | Continúa aprendiendo |

**VER RESULTADOS** muestra los intentos de cada nivel, sus cambios de puntuación,
la decisión honesta y la explicación. Pulsa cada título para desplegarlo.
**JUGAR DE NUEVO** vuelve al inicio y permite cambiar de nombre.

## Datos guardados y privacidad

Se guardan localmente el nombre o apodo, el récord, el mejor porcentaje, las
insignias históricas y la preferencia de sonido, con la clave
`avanza-sin-tranza-v1` de `localStorage`. Los récords se actualizan al terminar
una partida; las insignias se guardan al desbloquearlas.

Los datos permanecen en ese navegador y dispositivo. No se envían a internet.
El avance de una partida en curso no se guarda al cerrar o recargar la página.
Mover la carpeta o usar otro navegador puede mostrar un historial diferente.

Algunos navegadores restringen `localStorage` en archivos `file://`, ventanas
privadas o dispositivos con almacenamiento bloqueado. El juego sigue funcionando
en memoria y muestra un aviso si el guardado falla.



## Sonido, movimiento y teclado

El sonido inicia apagado. Puedes activarlo con **Sonido**. Las notas se generan
con Web Audio API, sin archivos externos. Si el navegador bloquea el audio,
las decisiones, vidas y puntos siguen funcionando.

Usa **Tab** y **Mayús + Tab** para moverte; **Enter** o **Espacio** para activar
botones. **Escape** cierra las ventanas. El foco queda dentro de los diálogos
modales. Puedes volver al mapa sin responder y continuar el mismo reto después.
La preferencia del sistema para reducir movimiento desactiva las animaciones.

El tablero utiliza 5 columnas en pantallas amplias y 3 en teléfonos. Se conserva
el orden de los niveles en forma de serpiente. El diseño se adapta al ancho de
pantalla y las ventanas permiten desplazamiento vertical cuando es necesario.

## Contenido educativo

Las decisiones correctas rechazan el soborno, los privilegios indebidos y el
abuso de responsabilidades. Los escenarios de objetos perdidos y copia escolar
se identifican como honestidad cotidiana o académica: **no toda falta de
honestidad es corrupción**. Las situaciones con autoridades proponen buscar
apoyo de una persona adulta y priorizar la seguridad, sin confrontaciones.

Se tiene pensado que las situaciones cambien cada cierto tiempo (por ejemplo, cada semana), para que el contenido
no sea siempre el mismo si alguien vuelve a jugar. Todavía no está
implementado, queda como algo a futuro.

## Personalizar

Cada objeto de `questions.js` incluye `titulo`, `lugar`, `icono`, `personaje`,
`emoji`, `tipo`, `escenario`, `opciones`, `correcta`, `explicacion` y `puntos`.
`correcta` es el índice de la opción honesta, comenzando en 0, antes de barajar
las opciones. Las opciones incorrectas incluyen su explicación en `retro`.

`evento` es opcional y contiene `nombre`, `icono`, `bonus` y, cuando corresponde,
`vida`. Puedes editar los textos sin cambiar la lógica. Cada uno de los 15 retos
tiene una respuesta correcta. Los colores principales están en `:root` dentro
de `styles.css`. Las reglas de insignias, la penalización y las vidas están al
principio de `app.js`.

## Efectos visuales mejorados

Esta versión añade transiciones de pantalla, entrada escalonada de respuestas, efecto spring en ventanas, partículas al acertar, destello al fallar, contador animado de puntos, animación de corazones, avance con salto del personaje, transición de nivel, insignias con brillo, parallax ligero en la portada y una celebración final reforzada. Todo funciona con CSS y JavaScript puro, sin librerías externas, y respeta `prefers-reduced-motion`.
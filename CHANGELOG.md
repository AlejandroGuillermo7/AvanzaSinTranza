# Changelog

## Pro Edition

### Interfaz
- Barra superior con tratamiento de aplicación y superficies translúcidas.
- Design tokens consistentes para color, radios, sombras, bordes y animación.
- Layout de inicio refinado con métricas, tarjetas flotantes y mejor jerarquía.
- HUD de partida con perfil, puntos, nivel, correctas, incorrectas y racha.
- Escena visual dinámica de acuerdo con el lugar del reto.
- Tablero, ruta, misión, diálogos y pantalla final con acabado visual unificado.

### Experiencia
- Reanudación automática de partidas pendientes mediante `localStorage`.
- Botón **Continuar partida** con resumen de nivel, puntos y vidas.
- Atajos A/B/C para elegir la opción visible en el modal.
- Feedback háptico opcional en dispositivos compatibles.
- Mantiene sonido, confeti, partículas, puntos flotantes, estados de error y animaciones de insignias.
- Respeta `prefers-reduced-motion`.

### Mantenibilidad
- La nueva capa de interfaz vive en `css/pro.css` y no modifica destructivamente el diseño base.
- Continúa usando JavaScript clásico para que el proyecto funcione abriendo `index.html` sin servidor ni bundler.
- No usa frameworks, CDN, imágenes remotas ni dependencias externas.

## Layout Fix Edition
- Corregido el login que heredaba el layout de dos columnas de la versión anterior.
- Eliminado el bloque azul marino vacío que aparecía junto al login.
- Browser mockup centrado y escalado correctamente en escritorio.
- Topbar y contenedor principal sin límites de ancho heredados.
- Contraste corregido en la tarjeta de misión.
- Botón Resolver reto vuelve a formar parte de la tarjeta en móvil.
- Navegación móvil compactada.
- Revisadas visualmente las vistas Inicio, Retos, Ranking, Perfil, Premios y preguntas.

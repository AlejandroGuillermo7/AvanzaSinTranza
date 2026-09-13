/* Datos locales: se cargan antes de app.js, sin fetch ni módulos. */
window.AST_QUESTIONS = [
  {
    id: 1,
    titulo: "Una calificación no se compra",
    lugar: "Escuela",
    icono: "🏫",
    personaje: "Un profesor",
    emoji: "🧑‍🏫",
    tipo: "Corrupción",
    escenario:
      "Un profesor te ofrece aprobar una materia si le das dinero en secreto, aunque no hayas entregado los trabajos. ¿Qué haces?",
    opciones: [
      {
        texto: "Pagar para aprobar sin hacer los trabajos.",
        retro:
          "Comprar una calificación cambia un resultado por dinero y perjudica a quienes sí se esfuerzan.",
      },
      {
        texto:
          "Rechazar el trato, cumplir con mis trabajos y pedir apoyo a una persona adulta de confianza.",
      },
      {
        texto:
          "Juntar dinero con mis compañeros para comprar varias calificaciones.",
        retro:
          "Que participen más personas no hace justo el trato. Las calificaciones no se deben vender.",
      },
    ],
    correcta: 1,
    puntos: 100,
    explicacion:
      "Abusar del puesto de profesor para vender una calificación es corrupción. Aprender y ser evaluado con las mismas reglas es lo justo. Puedes pedir ayuda sin enfrentarte al profesor.",
  },
  {
    id: 2,
    titulo: "La multa tiene un camino correcto",
    lugar: "Calle",
    icono: "🚦",
    personaje: "Un agente de tránsito",
    emoji: "👮",
    tipo: "Corrupción",
    escenario:
      "Viajas con una persona adulta. Un agente pide dinero para él, sin recibo, a cambio de no seguir el procedimiento de una infracción. ¿Qué propones?",
    opciones: [
      {
        texto: "Que le dé el dinero para salir más rápido.",
        retro:
          "Un pago secreto para evitar el procedimiento es un soborno; no es lo mismo que pagar una multa oficial.",
      },
      {
        texto: "Que le ofrezca todavía más dinero.",
        retro: "Aumentar el dinero sigue siendo ofrecer un soborno.",
      },
      {
        texto:
          "Rechazar el pago secreto y pedir que se siga el procedimiento oficial, con apoyo de la persona adulta.",
      },
    ],
    correcta: 2,
    puntos: 100,
    explicacion:
      "Pedir dinero para beneficio personal a cambio de saltarse un procedimiento es corrupción. Lo correcto es seguir el procedimiento oficial. Tu seguridad va primero: deja que la persona adulta te apoye.",
  },
  {
    id: 3,
    titulo: "La fila es para todos",
    lugar: "Parque",
    icono: "🌳",
    personaje: "El encargado de la entrada",
    emoji: "🧑‍💼",
    tipo: "Corrupción",
    escenario:
      "Hay una fila para entrar al parque. El encargado te ofrece pasar primero si le das una moneda a escondidas. No existe un pase rápido oficial.",
    opciones: [
      { texto: "Esperar mi turno y rechazar el pago secreto." },
      {
        texto: "Pagar, porque solo es una moneda.",
        retro:
          "Aunque la cantidad sea pequeña, el encargado estaría vendiendo un privilegio injusto.",
      },
      {
        texto: "Pagar por todo mi grupo para que también se adelante.",
        retro:
          "Comprar el turno de un grupo también perjudica a las personas que esperan.",
      },
    ],
    correcta: 0,
    puntos: 100,
    evento: { nombre: "Bonus de respeto", icono: "⭐", bonus: 50 },
    explicacion:
      "Respetar los turnos evita que alguien venda ventajas usando su puesto. Los apoyos o accesos prioritarios establecidos por reglas claras son diferentes de un pago secreto.",
  },
  {
    id: 4,
    titulo: "Un trámite sin atajos",
    lugar: "Oficina",
    icono: "🏛️",
    personaje: "Un funcionario",
    emoji: "🧑‍💼",
    tipo: "Corrupción",
    escenario:
      "Acompañas a tu familia a una oficina. Un funcionario ofrece resolver el trámite hoy si recibe dinero extra para él, fuera del pago oficial.",
    opciones: [
      {
        texto: "Dar el dinero extra y no pedir recibo.",
        retro:
          "Pagar por debajo de la mesa para recibir una ventaja fomenta el abuso del cargo.",
      },
      {
        texto:
          "Pedir los requisitos, costos y tiempos oficiales; rechazar el dinero extra.",
      },
      {
        texto: "Llevarle un regalo en lugar de dinero.",
        retro:
          "Cambiar el dinero por un regalo no vuelve correcto un intercambio para saltarse las reglas.",
      },
    ],
    correcta: 1,
    puntos: 100,
    explicacion:
      "Los trámites deben seguir reglas claras para todas las personas. Un cobro personal y secreto a cambio de un trato especial es corrupción.",
  },
  {
    id: 5,
    titulo: "Ayudar no es pasar respuestas",
    lugar: "Aula",
    icono: "📚",
    personaje: "Un compañero",
    emoji: "🧑‍🎓",
    tipo: "Honestidad cotidiana",
    escenario:
      "Durante un examen individual, un compañero te pide que le enseñes tus respuestas. Dice que, si son amigos, debes ayudarlo.",
    opciones: [
      {
        texto: "Enseñarle mi examen para que copie.",
        retro:
          "Copiar impide saber qué aprendió cada persona y hace injusta la evaluación.",
      },
      {
        texto: "Cobrarle por cada respuesta.",
        retro:
          "Vender respuestas añade un beneficio personal a la trampa y no ayuda a aprender.",
      },
      {
        texto:
          "No compartir las respuestas y ofrecerle estudiar juntos después.",
      },
    ],
    correcta: 2,
    puntos: 100,
    explicacion:
      "Ser buen amigo también significa ayudar a aprender. Copiar es una falta de honestidad académica; por sí sola no siempre es corrupción, pero sí rompe las reglas de una evaluación justa.",
  },
  {
    id: 6,
    titulo: "Una cartera con historia",
    lugar: "Plaza",
    icono: "👛",
    personaje: "Una persona que perdió su cartera",
    emoji: "🧑",
    tipo: "Honestidad cotidiana",
    escenario:
      "Encuentras una cartera con dinero en una banca. Hay una persona adulta de confianza contigo y una oficina de objetos perdidos cerca.",
    opciones: [
      { texto: "Pedir apoyo para entregarla completa en objetos perdidos." },
      {
        texto: "Quedarme con un poco de dinero y entregar lo demás.",
        retro:
          "Entregar solo una parte no convierte en tuyo el dinero restante.",
      },
      {
        texto: "Guardarla, porque nadie me vio.",
        retro: "Que nadie te vea no cambia a quién pertenece la cartera.",
      },
    ],
    correcta: 0,
    puntos: 100,
    evento: { nombre: "Pregunta sorpresa", icono: "❓", bonus: 25 },
    explicacion:
      "Encontrar algo no te convierte en su dueño. Devolverlo completo es actuar con honestidad. Quedarse con una cartera ajena es una falta de honestidad; no todo acto deshonesto es corrupción.",
  },
  {
    id: 7,
    titulo: "Un regalo con condición",
    lugar: "Taller",
    icono: "🎁",
    personaje: "Un conocido",
    emoji: "🧑‍🤝‍🧑",
    tipo: "Corrupción",
    escenario:
      "Ayudas a organizar los turnos de un taller. Un conocido te ofrece unos audífonos si lo colocas por delante de personas que se inscribieron antes.",
    opciones: [
      {
        texto: "Aceptar los audífonos y cambiar el orden.",
        retro:
          "Recibir algo a cambio de abusar de tu responsabilidad para dar ventajas es un soborno.",
      },
      { texto: "Rechazar el regalo condicionado y respetar la lista." },
      {
        texto: "Pedir un regalo más pequeño para sentirme menos culpable.",
        retro:
          "El problema es el intercambio por una ventaja injusta, no el precio del regalo.",
      },
    ],
    correcta: 1,
    puntos: 100,
    explicacion:
      "Un regalo puede ser un soborno si busca cambiar una decisión que debes tomar con imparcialidad. Los regalos sin condiciones no son automáticamente corrupción.",
  },
  {
    id: 8,
    titulo: "La entrada por la puerta correcta",
    lugar: "Evento",
    icono: "🎪",
    personaje: "El encargado del acceso",
    emoji: "🧑‍✈️",
    tipo: "Corrupción",
    escenario:
      "En un evento con boletos, el encargado ofrece dejarte entrar si le pagas a él en secreto una cantidad menor, sin darte entrada oficial.",
    opciones: [
      {
        texto: "Pagarle en secreto porque sale más barato.",
        retro:
          "Ese dinero compra una excepción indebida y no una entrada oficial.",
      },
      {
        texto:
          "Proponerle que deje entrar también a mis amigos por el mismo pago.",
        retro:
          "Negociar más beneficios mantiene el soborno y amplía la trampa.",
      },
      {
        texto:
          "Rechazar el trato y buscar una entrada oficial o una actividad gratuita.",
      },
    ],
    correcta: 2,
    puntos: 100,
    explicacion:
      "Usar el control de acceso para cobrar dinero personal y saltarse las reglas es corrupción. Comprar por el canal autorizado respeta a quienes organizan y participan.",
  },
  {
    id: 9,
    titulo: "Lo público es de la comunidad",
    lugar: "Comunidad",
    icono: "🚐",
    personaje: "Un servidor público",
    emoji: "🧑‍🔧",
    tipo: "Corrupción",
    escenario:
      "Un servidor público quiere usar, sin autorización, la camioneta y el combustible del municipio para irse de vacaciones. Te dice que no pasa nada.",
    opciones: [
      {
        texto:
          "Decir que esos recursos son para el servicio público y buscar apoyo de una persona adulta de confianza.",
      },
      {
        texto: "Pedir que me lleve y guardar el secreto.",
        retro:
          "Obtener un paseo a cambio de callar ayuda a aprovechar recursos que pertenecen a la comunidad.",
      },
      {
        texto: "Decirle que lo haga cuando nadie esté mirando.",
        retro:
          "Ocultarlo no autoriza el uso personal de los recursos públicos.",
      },
    ],
    correcta: 0,
    puntos: 100,
    explicacion:
      "Usar recursos públicos sin autorización para un beneficio personal es un abuso del cargo. Esos recursos deben servir a la comunidad, de acuerdo con las reglas.",
  },
  {
    id: 10,
    titulo: "Tu documento, tu turno",
    lugar: "Registro",
    icono: "📄",
    personaje: "Un empleado del registro",
    emoji: "🧑‍💻",
    tipo: "Corrupción",
    escenario:
      "Un empleado ofrece adelantar tu documento y retrasar los de otras personas si le depositan dinero en su cuenta personal. No es un servicio oficial.",
    opciones: [
      {
        texto: "Hacer el depósito para tener ventaja.",
        retro:
          "Pagar en una cuenta personal para alterar el turno favorece un trato injusto.",
      },
      {
        texto:
          "Rechazar el depósito y consultar los turnos y opciones oficiales.",
      },
      {
        texto: "Recomendar el trato para que más personas paguen.",
        retro:
          "Difundir un trato corrupto hace que más personas participen en él.",
      },
    ],
    correcta: 1,
    puntos: 100,
    evento: {
      nombre: "Recompensa ciudadana",
      icono: "🎁",
      bonus: 50,
      vida: true,
    },
    explicacion:
      "Los documentos deben tramitarse con criterios claros. Una modalidad urgente publicada y autorizada es distinta de pagar un soborno a un empleado.",
  },
  {
    id: 11,
    titulo: "El conocimiento no se filtra",
    lugar: "Biblioteca",
    icono: "📖",
    personaje: "Un estudiante",
    emoji: "🧑‍🎓",
    tipo: "Honestidad académica",
    escenario:
      "Un estudiante dice tener las respuestas robadas del examen de mañana y te propone comprarlas. Tú todavía tienes tiempo para repasar.",
    opciones: [
      {
        texto: "Comprarlas y memorizar las letras.",
        retro:
          "Comprar respuestas robadas es una trampa que da una ventaja injusta.",
      },
      {
        texto: "Pedir una copia gratis; así ya no sería trampa.",
        retro:
          "Usar respuestas robadas sigue siendo trampa aunque no pagues por ellas.",
      },
      {
        texto:
          "Rechazar la oferta, estudiar y pedir apoyo a una persona adulta o docente de confianza.",
      },
    ],
    correcta: 2,
    puntos: 100,
    explicacion:
      "Una evaluación justa debe mostrar lo que aprendiste. Usar respuestas robadas es deshonesto. Si alguien abusa de un puesto para venderlas, también puede haber corrupción.",
  },
  {
    id: 12,
    titulo: "El marcador se gana jugando",
    lugar: "Cancha",
    icono: "⚽",
    personaje: "Un árbitro",
    emoji: "🏃",
    tipo: "Corrupción deportiva",
    escenario:
      "Antes de la final, alguien de tu equipo propone dar dinero al árbitro para que ignore sus faltas y marque faltas inventadas al rival.",
    opciones: [
      { texto: "Rechazar el plan y competir respetando las mismas reglas." },
      {
        texto: "Cooperar con dinero para asegurar la victoria.",
        retro:
          "Comprar decisiones del árbitro cambia el resultado de forma injusta.",
      },
      {
        texto: "Ofrecerle dinero solo si ganamos.",
        retro:
          "Prometer un pago después del partido también busca comprar decisiones.",
      },
    ],
    correcta: 0,
    puntos: 100,
    explicacion:
      "El árbitro recibe la confianza de aplicar las reglas de forma imparcial. Sobornarlo para favorecer a un equipo es corrupción. El juego limpio vale más que una victoria comprada.",
  },
  {
    id: 13,
    titulo: "La amistad no cambia los datos",
    lugar: "Centro",
    icono: "💻",
    personaje: "Un empleado",
    emoji: "🧑‍💻",
    tipo: "Corrupción y favoritismo",
    escenario:
      "Un empleado quiere modificar una lista para que su amigo reciba una beca que no le corresponde, dejando fuera a alguien que sí cumple los requisitos. Te pide ayuda.",
    opciones: [
      {
        texto: "Cambiar los datos porque la amistad va primero.",
        retro:
          "Alterar información para favorecer a un amigo perjudica a quien sí cumple los requisitos.",
      },
      {
        texto:
          "Negarme a alterar la lista y pedir que se apliquen los requisitos de manera justa.",
      },
      {
        texto: "Cambiar solo un dato para que no se note.",
        retro:
          "Aunque sea un solo dato, cambiarlo a propósito puede causar una decisión injusta.",
      },
    ],
    correcta: 1,
    puntos: 100,
    evento: { nombre: "Situación difícil", icono: "⚠️", bonus: 50 },
    explicacion:
      "La corrupción no siempre incluye dinero. Abusar de un puesto para manipular datos y beneficiar indebidamente a un amigo también rompe la confianza.",
  },
  {
    id: 14,
    titulo: "Encontrarlo no es quedártelo",
    lugar: "Transporte",
    icono: "🚌",
    personaje: "Una pasajera",
    emoji: "🧑",
    tipo: "Honestidad cotidiana",
    escenario:
      "Una pasajera deja una mochila en el autobús. Un amigo dice que pueden quedarse con ella si se bajan rápido. Estás con una persona adulta de confianza.",
    opciones: [
      {
        texto: "Bajarme rápido con la mochila.",
        retro:
          "La mochila sigue teniendo dueña aunque se haya quedado olvidada.",
      },
      {
        texto: "Revisar si hay algo que me guste antes de devolverla.",
        retro:
          "Tomar parte del contenido tampoco respeta las pertenencias de la pasajera.",
      },
      {
        texto:
          "Avisar a la persona adulta y al conductor para seguir el procedimiento de objetos perdidos.",
      },
    ],
    correcta: 2,
    puntos: 100,
    explicacion:
      "Cuidar y devolver lo ajeno es honestidad cotidiana. Puedes ayudar sin revisar pertenencias ni irte a solas con personas desconocidas.",
  },
  {
    id: 15,
    titulo: "La comunidad no está en venta",
    lugar: "Meta",
    icono: "🏆",
    personaje: "El encargado del parque",
    emoji: "🧑‍🌾",
    tipo: "Corrupción",
    escenario:
      "Ves que el encargado de un parque acepta dinero para permitir que alguien tire basura en una zona donde está prohibido. Estás acompañado y puedes alejarte con seguridad.",
    opciones: [
      {
        texto:
          "Alejarme con mi acompañante y pedir apoyo de una persona adulta de confianza para informar por un canal adecuado.",
      },
      {
        texto: "Pedir una parte del dinero a cambio de no decir nada.",
        retro:
          "Aceptar dinero para encubrir el abuso te hace participar en el trato corrupto.",
      },
      {
        texto: "Ofrecer dinero para que también me deje tirar basura.",
        retro:
          "Pagar por permiso para romper las reglas perjudica al parque y fomenta el soborno.",
      },
    ],
    correcta: 0,
    puntos: 100,
    explicacion:
      "Recibir dinero para permitir una acción prohibida usando un cargo es corrupción. Proteger a la comunidad empieza por rechazar esos tratos y pedir ayuda de forma segura. ¡Completaste el camino!",
  },
];

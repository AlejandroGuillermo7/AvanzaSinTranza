(() => {
  "use strict";

  const questions = window.AST_QUESTIONS;
  const TOTAL = questions.length;
  const STORAGE_KEY = "avanza-sin-tranza-v2";
  const SESSION_KEY = "avanza-sin-tranza-session-v3";
  const MAX_LIVES = 3;
  const PENALTY = 25;
  const $ = (id) => document.getElementById(id);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const badges = [
    { id: "defensor", icon: "🛡️", name: "Defensor de la Honestidad", rule: "Consigue 300 puntos", test: (s) => s.score >= 300 },
    { id: "responsable", icon: "⭐", name: "Heroe Responsable", rule: "Consigue 700 puntos", test: (s) => s.score >= 700 },
    { id: "limpio", icon: "💎", name: "Juego Limpio", rule: "Logra 5 aciertos seguidos", test: (s) => s.streak >= 5 },
    { id: "campeon", icon: "🏆", name: "Campeón de la Honestidad", rule: "Completa los 15 retos", test: (s) => s.completed === TOTAL }
  ];
  const rewardsCatalog = [
    { id: "kiko-clasico", name: "Kiko clásico", kind: "avatar", requirement: { type: "level", value: 1 }, action: "Equipado" },
    { id: "oficial-fiel", name: "Oficial Fiel", kind: "avatar", requirement: { type: "level", value: 4 }, action: "Equipar" },
    { id: "kiko-nocturno", name: "Kiko nocturno", kind: "avatar", requirement: { type: "score", value: 1500 }, action: "Desbloquear" },
    { id: "fiel-dorado", name: "Fiel dorado", kind: "avatar", requirement: { type: "score", value: 2200 }, action: "Desbloquear" },
    { id: "capitan-kiko", name: "Capitán Kiko", kind: "avatar", requirement: { type: "level", value: 10 }, action: "Bloqueado" },
    { id: "edicion-especial", name: "Edición especial", kind: "avatar", requirement: { type: "score", value: 5000 }, action: "Bloqueado" },
    { id: "vialidad-vip", name: "Vialidad VIP", kind: "avatar", requirement: { type: "level", value: 15 }, action: "Bloqueado" },
    { id: "legado-integro", name: "Legado íntegro", kind: "avatar", requirement: { type: "score", value: 10000 }, action: "Bloqueado" }
  ];

  let state = null;
  let audioContext = null;
  let toastTimer;
  let confettiTimer;
  let layoutFrame;
  let lastRenderedScore = 0;
  let lastRenderedLives = MAX_LIVES;
  let lastRenderedCompleted = 0;
  let currentView = "home";
  const profile = readProfile();
  let savedSession = readSession();

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function normalizeName(value) {
    return [...String(value || "").trim().replace(/\s+/g, " ")].slice(0, 24).join("");
  }

  function readProfile() {
    const initial = { name: "", highScore: 0, bestAccuracy: 0, badges: [], sound: false, colorTheme: "gold" };
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!saved || typeof saved !== "object") return initial;
      return {
        name: typeof saved.name === "string" ? normalizeName(saved.name) : "",
        highScore: Number.isFinite(saved.highScore) ? Math.max(0, Math.floor(saved.highScore)) : 0,
        bestAccuracy: Number.isFinite(saved.bestAccuracy) ? Math.max(0, Math.min(100, saved.bestAccuracy)) : 0,
        badges: Array.isArray(saved.badges) ? [...new Set(saved.badges.filter((id) => badges.some((b) => b.id === id)))] : [],
        sound: saved.sound === true,
        colorTheme: ["gold", "blue", "green", "orange", "cyan"].includes(saved.colorTheme) ? saved.colorTheme : "gold"
      };
    } catch {
      $("storage-note").hidden = false;
      return initial;
    }
  }

  function readSession() {
    try {
      const raw = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (!raw || typeof raw !== "object" || raw.finished === true) return null;
      const completed = Number.isInteger(raw.completed) ? Math.max(0, Math.min(TOTAL, raw.completed)) : 0;
      if (completed >= TOTAL) return null;
      return {
        name: normalizeName(raw.name) || "Explorador",
        score: Number.isFinite(raw.score) ? Math.max(0, Math.floor(raw.score)) : 0,
        lives: Number.isInteger(raw.lives) ? Math.max(0, Math.min(MAX_LIVES, raw.lives)) : MAX_LIVES,
        completed,
        correct: Number.isInteger(raw.correct) ? Math.max(0, raw.correct) : completed,
        wrong: Number.isInteger(raw.wrong) ? Math.max(0, raw.wrong) : 0,
        streak: Number.isInteger(raw.streak) ? Math.max(0, raw.streak) : 0,
        wrongStreak: Number.isInteger(raw.wrongStreak) ? Math.max(0, raw.wrongStreak) : 0,
        earned: new Set(Array.isArray(raw.earned) ? raw.earned.filter((id) => badges.some((badge) => badge.id === id)) : []),
        attempts: Array.isArray(raw.attempts) ? raw.attempts.filter((attempt) => attempt && Number.isInteger(attempt.questionId)) : [],
        answered: false,
        questionIndex: completed,
        lastCorrect: false,
        finished: false,
        sanctionPending: raw.sanctionPending === true,
        lastPenalty: Number.isFinite(raw.lastPenalty) ? Math.max(0, raw.lastPenalty) : PENALTY,
        lastLostStreak: Number.isInteger(raw.lastLostStreak) ? Math.max(0, raw.lastLostStreak) : 0
      };
    } catch {
      return null;
    }
  }

  function serializeSession(game) {
    if (!game) return null;
    return {
      name: game.name,
      score: game.score,
      lives: game.lives,
      completed: game.completed,
      correct: game.correct,
      wrong: game.wrong,
      streak: game.streak,
      wrongStreak: game.wrongStreak,
      earned: [...game.earned],
      attempts: game.attempts,
      finished: game.finished,
      sanctionPending: game.sanctionPending,
      lastPenalty: game.lastPenalty,
      lastLostStreak: game.lastLostStreak
    };
  }

  function saveSession() {
    if (!state || state.finished || state.completed >= TOTAL) return;
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(serializeSession(state)));
      savedSession = readSession();
    } catch {
      // Opcional.
    }
    renderSessionSummary();
  }

  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch {}
    savedSession = null;
    renderSessionSummary();
  }

  function saveProfile() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      $("storage-note").hidden = false;
    }
    renderProfile();
  }

  function renderProfile() {
    $("record").textContent = profile.highScore;
    $("sound-button").textContent = profile.sound ? "🔊 Sonido" : "🔇 Sonido";
    $("sound-button").setAttribute("aria-pressed", String(profile.sound));
    $("sound-button").setAttribute("aria-label", profile.sound ? "Desactivar sonidos del juego" : "Activar sonidos del juego");
    $("saved-summary").hidden = profile.badges.length === 0 && profile.highScore === 0;
    $("saved-summary").textContent = `Récord: ${profile.highScore} pts · Mejor porcentaje: ${profile.bestAccuracy}% · Insignias: ${profile.badges.length}/${badges.length}`;
    document.body.dataset.themeAccent = profile.colorTheme;
    document.querySelectorAll(".swatch").forEach((button) => button.classList.toggle("active", button.dataset.color === profile.colorTheme));
    renderSessionSummary();
  }

  function renderSessionSummary() {
    const button = $("continue-button");
    const summary = $("session-summary");
    if (!button || !summary) return;
    const available = Boolean(savedSession && savedSession.completed < TOTAL);
    button.hidden = !available;
    summary.hidden = !available;
    if (available) {
      const level = Math.min(savedSession.completed + 1, TOTAL);
      summary.textContent = `Partida guardada: ${savedSession.name} · Nivel ${level}/${TOTAL} · ${savedSession.score} puntos · ${savedSession.lives} vidas`;
    }
  }

  function announce(text) {
    $("announcement").textContent = text;
  }

  function showScreen(id) {
    document.body.dataset.screen = id;
    ["welcome", "game", "victory"].forEach((name) => {
      const screen = $(name);
      screen.hidden = name !== id;
      screen.classList.remove("screen-enter");
    });
    const active = $(id);
    if (!active) return;
    if (!reducedMotion.matches) {
      void active.offsetWidth;
      active.classList.add("screen-enter");
      setTimeout(() => active.classList.remove("screen-enter"), 650);
    }
  }

  function openDialog(id) {
    document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
    $(id).showModal();
  }

  function createGameState(name) {
    return {
      name: normalizeName(name) || profile.name || "Explorador",
      score: 0,
      lives: MAX_LIVES,
      completed: 0,
      correct: 0,
      wrong: 0,
      streak: 0,
      wrongStreak: 0,
      earned: new Set(),
      attempts: [],
      answered: false,
      questionIndex: 0,
      lastCorrect: false,
      finished: false,
      sanctionPending: false,
      lastPenalty: PENALTY,
      lastLostStreak: 0
    };
  }

  function restoreSession() {
    const session = readSession();
    if (!session) {
      clearSession();
      showToast("No hay una partida pendiente para continuar.");
      return;
    }
    state = session;
    lastRenderedScore = state.score;
    lastRenderedLives = state.lives;
    lastRenderedCompleted = state.completed;
    profile.name = state.name;
    saveProfile();
    buildMap();
    showScreen("game");
    switchView(state.sanctionPending ? "sanction" : "home", false);
    renderGame();
    saveSession();
    $("game-title").focus();
    announce(`Partida recuperada. Nivel ${state.completed + 1} de ${TOTAL}, ${state.score} puntos y ${state.lives} vidas.`);
  }

  function startGame(name) {
    document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
    clearTimeout(confettiTimer);
    clearTimeout(toastTimer);
    $("confetti").replaceChildren();
    $("toast").hidden = true;
    document.querySelectorAll(".points-float,.fx-spark,.fx-star,.level-flash").forEach((node) => node.remove());
    state = createGameState(name);
    clearSession();
    lastRenderedScore = 0;
    lastRenderedLives = MAX_LIVES;
    lastRenderedCompleted = 0;
    profile.name = state.name;
    saveProfile();
    buildMap();
    showScreen("game");
    switchView("home", false);
    renderGame();
    $("game-title").focus();
    announce(`¡Vamos, ${state.name}! Comienzas con 3 vidas en el nivel 1.`);
    playSound("advance");
  }

  function buildMap() {
    const nodes = questions.map((question, index) => {
      const node = element("li", "map-node");
      const circle = element("span", "node-circle");
      circle.setAttribute("aria-hidden", "true");
      circle.append(element("span", "node-number", index + 1));
      if (question.evento) circle.append(element("span", "node-event", question.evento.icono));
      node.append(circle, element("span", "node-name", index === TOTAL - 1 ? "🏆 Meta" : question.lugar));
      return node;
    });
    $("map-nodes").replaceChildren(...nodes);
  }

  function applyDecision(game, question, optionIndex) {
    if (game.answered || game.finished || game.lives === 0 || game.completed !== game.questionIndex) return null;
    if (!Number.isInteger(optionIndex) || !question.opciones[optionIndex]) return null;
    game.answered = true;
    const correct = optionIndex === question.correcta;
    const previousScore = game.score;
    const previousLives = game.lives;
    const previousStreak = game.streak;
    game.lastCorrect = correct;
    if (correct) {
      game.score += question.puntos + (question.evento?.bonus || 0);
      game.correct++;
      game.streak++;
      game.completed++;
      game.wrongStreak = 0;
      game.sanctionPending = false;
      if (question.evento?.vida) game.lives = Math.min(MAX_LIVES, game.lives + 1);
    } else {
      game.score = Math.max(0, game.score - PENALTY);
      game.lives--;
      game.wrong++;
      game.lastLostStreak = previousStreak;
      game.streak = 0;
      game.wrongStreak++;
      game.lastPenalty = previousScore - game.score || PENALTY;
      game.sanctionPending = game.wrongStreak >= 2;
    }
    const points = game.score - previousScore;
    game.attempts.push({ questionId: question.id, optionIndex, correct, points });
    return { correct, points, restoredLife: game.lives > previousLives };
  }

  function renderGame(newBadges = []) {
    if (!state) return;
    const scoreChanged = state.score !== lastRenderedScore;
    const livesChanged = state.lives !== lastRenderedLives;
    const completedChanged = state.completed !== lastRenderedCompleted;
    const nextQuestion = questions[Math.min(state.completed, TOTAL - 1)];
    const scene = String(nextQuestion?.lugar || "inicio").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
    document.body.dataset.scene = scene;
    $("greeting-name").textContent = state.name;
    $("player-chip-name").textContent = state.name;
    $("player-initial").textContent = (state.name.trim()[0] || "E").toUpperCase();
    $("level").textContent = `${Math.min(state.completed + 1, TOTAL)} / ${TOTAL}`;
    $("correct-count").textContent = state.correct;
    $("wrong-count").textContent = state.wrong;
    $("streak-count").textContent = state.streak;
    animateNumber($("score"), lastRenderedScore, state.score, 520);
    $("progress").max = TOTAL;
    $("progress").value = state.completed;
    $("progress-label").textContent = `${state.completed} / ${TOTAL}`;

    $("home-score").textContent = state.score.toLocaleString("es-MX");
    $("home-streak").textContent = state.streak;
    $("home-ranking").textContent = `#${computeUserRank()}`;
    $("home-level").textContent = `NIVEL ${Math.min(state.completed + 1, TOTAL)}`;
    $("view-subtitle").textContent = getViewSubtitle(currentView);

    $("hearts").replaceChildren(...Array.from({ length: MAX_LIVES }, (_, index) => {
      const alive = index < state.lives;
      const heart = element("span", alive ? "" : "empty-heart", alive ? "♥ " : "♡ ");
      if (livesChanged) {
        if (state.lives > lastRenderedLives && index === state.lives - 1) heart.classList.add("heart-gain");
        if (state.lives < lastRenderedLives && index === state.lives) heart.classList.add("heart-loss");
      }
      return heart;
    }));
    $("hearts").setAttribute("aria-label", `${state.lives} vidas de ${MAX_LIVES}`);
    if (scoreChanged) pulseStat("score");

    if (nextQuestion) {
      $("scene-name").textContent = String(nextQuestion.lugar || "Inicio").toUpperCase();
      const missionStatus = $("mission-status");
      missionStatus.replaceChildren(element("i"), document.createTextNode(state.lives === 0 ? " Recuperación" : state.sanctionPending ? " En revisión" : " Disponible"));
      $("mission-icon").textContent = nextQuestion.icono;
      $("mission-title").textContent = nextQuestion.titulo;
      $("mission-preview").textContent = `En ${nextQuestion.lugar.toLowerCase()} te espera una decisión. Lee con calma y elige cómo actuar.`;
      $("mission-event").hidden = !nextQuestion.evento;
      $("mission-event").textContent = nextQuestion.evento ? `${nextQuestion.evento.icono} ${nextQuestion.evento.nombre}` : "";
      $("mission-reward").textContent = `✦ +${nextQuestion.puntos + (nextQuestion.evento?.bonus || 0)} puntos por una buena decisión`;
      $("mission-button").textContent = state.completed === TOTAL ? "VER MI RESULTADO →" : state.lives === 0 ? "RECUPERAR VIDAS →" : "RESOLVER RETO →";
    }

    Array.from($("map-nodes").children).forEach((node, index) => {
      const done = index < state.completed;
      const current = index === state.completed;
      node.classList.toggle("done", done);
      node.classList.toggle("current", current);
      node.querySelector(".node-number").textContent = done ? "✓" : index + 1;
      node.setAttribute("aria-label", `Nivel ${index + 1}: ${questions[index].lugar}. ${done ? "Superado" : current ? "Estás aquí" : "Por descubrir"}`);
      if (current) node.setAttribute("aria-current", "step");
      else node.removeAttribute("aria-current");
    });

    renderBadges(newBadges);
    renderHomeSummary();
    renderRanking();
    renderProfilePanel();
    renderRewards();
    renderSanction();

    if (completedChanged && state.completed > lastRenderedCompleted) {
      const completedNode = $("map-nodes").children[state.completed - 1];
      completedNode?.classList.add("fx-complete");
      setTimeout(() => completedNode?.classList.remove("fx-complete"), 850);
      animateMissionRefresh();
    }

    queueLayout();
    lastRenderedScore = state.score;
    lastRenderedLives = state.lives;
    lastRenderedCompleted = state.completed;
    saveSession();
  }

  function renderHomeSummary() {
    const list = $("route-summary-list");
    const items = questions.slice(0, 4).map((question, index) => {
      const wrapper = element("div", `route-summary-item ${index < state.completed ? "done" : index === state.completed ? "current" : "locked"}`);
      const badge = element("span", "route-summary-icon", index < state.completed ? "✓" : index === state.completed ? question.icono : String(index + 1));
      const text = element("div", "route-summary-copy");
      const title = element("strong", "", question.titulo);
      const metaText = index < state.completed
        ? `Completado · +${question.puntos + (question.evento?.bonus || 0)} pts`
        : index === state.completed
          ? `Hoy · ${question.lugar}`
          : `Se desbloquea después`;
      text.append(title, element("small", "", metaText));
      wrapper.append(badge, text);
      return wrapper;
    });
    list.replaceChildren(...items);

    const week = $("weekly-summary-list");
    week.replaceChildren(
      metricRow("🏅", "Mejor racha", `${Math.max(profile.bestAccuracy ? Math.ceil(profile.bestAccuracy / 10) : 0, state.streak)} días`),
      metricRow("⭐", "Retos completados", String(state.completed)),
      metricRow("🎯", "Precisión", `${accuracy()}%`),
      metricRow("🚨", "Sanciones", String(state.wrongStreak >= 2 ? 1 : 0))
    );

    $("mentor-home").textContent = state.completed >= TOTAL
      ? "Completaste todo el recorrido. ¡Ahora ve por un récord todavía mejor!"
      : state.sanctionPending
        ? "Respira, lee la explicación y vuelve a la ruta correcta. Aprender también es avanzar."
        : `Cada vez estás más cerca de ${questions[Math.min(state.completed, TOTAL - 1)].lugar.toLowerCase()}.`; 
  }

  function metricRow(icon, label, value) {
    const row = element("div", "metric-row");
    row.append(element("span", "metric-icon", icon));
    const copy = element("div", "metric-copy");
    copy.append(element("strong", "", label), element("small", "", value));
    row.append(copy);
    return row;
  }

  function renderBadges(newIds = []) {
    $("badge-count").textContent = `${state.earned.size} / ${badges.length}`;
    $("badges").replaceChildren(...badges.map((badge) => {
      const unlocked = state.earned.has(badge.id);
      const card = element("div", `badge${unlocked ? " unlocked" : ""}${newIds.includes(badge.id) ? " just-unlocked" : ""}`);
      const icon = element("span", "badge-icon", badge.icon);
      icon.setAttribute("aria-hidden", "true");
      card.append(icon, element("strong", "", badge.name), element("small", "", unlocked ? "✓ Desbloqueada" : badge.rule));
      return card;
    }));
  }

  function awardBadges() {
    const unlocked = badges.filter((badge) => !state.earned.has(badge.id) && badge.test(state));
    unlocked.forEach((badge) => {
      state.earned.add(badge.id);
      if (!profile.badges.includes(badge.id)) profile.badges.push(badge.id);
    });
    if (unlocked.length) {
      saveProfile();
      showToast(unlocked.map((badge) => `${badge.icon} ¡${badge.name}!`).join(" · "));
    }
    return unlocked.map((badge) => badge.id);
  }

  function shuffledIndices(length) {
    const indices = Array.from({ length }, (_, index) => index);
    for (let index = length - 1; index > 0; index--) {
      const random = Math.floor(Math.random() * (index + 1));
      [indices[index], indices[random]] = [indices[random], indices[index]];
    }
    return indices;
  }

  function openQuestion() {
    if (!state || state.finished) return;
    if (state.completed === TOTAL) return finishGame();
    if (state.lives === 0) return openDialog("rest-dialog");
    switchView("retos");
    state.questionIndex = state.completed;
    state.answered = false;
    const question = questions[state.questionIndex];
    $("question-step").textContent = `NIVEL ${state.questionIndex + 1} DE ${TOTAL} · ${state.lives} ${state.lives === 1 ? "VIDA" : "VIDAS"}`;
    $("question-character").textContent = question.emoji;
    $("question-person").textContent = question.personaje;
    $("question-topic").textContent = question.tipo;
    $("question-title").textContent = question.titulo;
    $("question-description").textContent = question.escenario;
    $("question-art-icon").textContent = question.icono;
    $("question-event").hidden = !question.evento;
    $("question-event").textContent = question.evento ? `${question.evento.icono} +${question.evento.bonus} bonus` : "";
    $("feedback").hidden = true;
    $("feedback-button").hidden = true;
    $("options").replaceChildren(...shuffledIndices(question.opciones.length).map((optionIndex, position) => {
      const button = element("button", "choice");
      button.type = "button";
      button.dataset.option = optionIndex;
      button.style.setProperty("--choice-index", position);
      const letter = element("span", "choice-letter", String.fromCharCode(65 + position));
      letter.setAttribute("aria-hidden", "true");
      button.append(letter, element("span", "", question.opciones[optionIndex].texto));
      button.addEventListener("click", () => answerQuestion(optionIndex));
      return button;
    }));
    openDialog("question-dialog");
    $("question-title").focus();
  }

  function answerQuestion(optionIndex) {
    if (!state || !$("question-dialog").open) return;
    const question = questions[state.questionIndex];
    const result = applyDecision(state, question, optionIndex);
    if (!result) return;
    const { correct, points, restoredLife } = result;
    const newIds = awardBadges();
    renderGame(newIds);

    $("options").querySelectorAll("button").forEach((button) => {
      button.disabled = true;
      const index = Number(button.dataset.option);
      if (index === optionIndex) button.classList.add("selected", correct ? "is-correct" : "is-wrong");
      if (index === question.correcta) button.classList.add("is-correct");
    });

    $("feedback").className = `feedback${correct ? "" : " incorrect"}`;
    $("feedback-title").textContent = correct ? `¡Muy bien, ${state.name}!` : question.tipo.startsWith("Corrupción") ? "Cuidado: esta decisión no ayuda a tu comunidad" : "Cuidado: esta decisión no es honesta.";
    $("feedback-text").textContent = correct ? question.explicacion : `${question.opciones[optionIndex].retro} ${question.explicacion}`;
    let pointsText = correct ? `+${points} puntos${question.evento ? ` · Incluye ${question.evento.bonus} de bonus` : ""}` : `−${PENALTY} puntos (mínimo 0) · −1 corazón`;
    if (restoredLife) pointsText += " · +1 corazón";
    if (newIds.length) pointsText += ` · Insignia: ${badges.filter((b) => newIds.includes(b.id)).map((b) => b.name).join(", ")}`;
    $("feedback-points").textContent = pointsText;
    $("feedback").hidden = false;
    $("feedback-button").textContent = correct
      ? state.completed === TOTAL ? "¡VER MI CELEBRACIÓN! 🏆" : "VER MI AVANCE →"
      : state.lives === 0 ? "RECUPERAR CORAZONES 💛" : state.sanctionPending ? "VER AVISO DE DESVÍO →" : "VOLVER A INTENTARLO ↻";
    $("feedback-button").hidden = false;
    $("feedback-button").focus({ preventScroll: true });
    $("feedback").scrollIntoView({ block: "nearest", behavior: reducedMotion.matches ? "instant" : "smooth" });

    const selectedButton = $("options").querySelector(`[data-option="${optionIndex}"]`);
    if (correct) {
      floatPoints(points);
      burstAround(selectedButton, true);
      if (state.completed < TOTAL) showLevelFlash(state.completed);
      playSound("correct");
      if (navigator.vibrate) navigator.vibrate(35);
    } else {
      $("options").classList.remove("shake");
      void $("options").offsetWidth;
      $("options").classList.add("shake");
      burstAround(selectedButton, false);
      flashWrong();
      playSound("wrong");
      if (navigator.vibrate) navigator.vibrate([45, 35, 45]);
    }
  }

  function closeQuestion() {
    $("question-dialog").close();
    if (state?.completed === TOTAL) finishGame();
    else {
      $("mission-button").focus({ preventScroll: true });
      announce(`Nivel ${state.completed + 1}. ${state.score} puntos. ${state.lives} vidas.`);
    }
  }

  function continueAfterAnswer() {
    if (!state?.answered) return;
    if (state.lastCorrect) {
      closeQuestion();
      if (!state.finished) {
        switchView("retos");
        playSound("advance");
      }
      return;
    }
    if (state.lives === 0) {
      openDialog("rest-dialog");
      return;
    }
    if (state.sanctionPending) {
      closeQuestion();
      switchView("sanction");
      announce("Se abrió el aviso de desvío para ayudarte a volver a la ruta.");
      return;
    }
    openQuestion();
  }

  function accuracy(game = state) {
    const totalAttempts = game.correct + game.wrong;
    return totalAttempts ? Math.round(game.correct / totalAttempts * 100) : 0;
  }

  function getRank(percentage) {
    if (percentage >= 90) return "Heroe de la honestidad";
    if (percentage >= 70) return "Guardian honesto";
    if (percentage >= 50) return "Aprendiz honesto";
    return "Continúa aprendiendo";
  }

  function computeUserRank() {
    if (!state) return 14;
    const leaderboard = buildLeaderboardData();
    return leaderboard.findIndex((entry) => entry.isUser) + 1;
  }

  function buildLeaderboardData() {
    const userEntry = { name: `Tú — ${state.name}`, score: state.score, icon: "🛡️", isUser: true };
    const base = [
      { name: "Sofía", score: Math.max(state.score + 280, 1400), icon: "🌟" },
      { name: "Diego", score: Math.max(state.score + 180, 1320), icon: "🚀" },
      { name: "Karla", score: Math.max(state.score + 140, 1290), icon: "🎨" },
      { name: "Luis M.", score: Math.max(state.score + 90, 1180), icon: "⚡" },
      { name: "Pablo R.", score: Math.max(state.score - 30, 980), icon: "🎯" }
    ];
    return [...base, userEntry].sort((a, b) => b.score - a.score);
  }

  function renderRanking() {
    if (!state) return;
    const data = buildLeaderboardData();
    const podium = $("leaderboard-podium");
    const top3 = [data[1], data[0], data[2]].filter(Boolean);
    podium.replaceChildren(...top3.map((entry, index) => {
      const heights = [150, 185, 132];
      const card = element("div", `podium-card podium-${index + 1}${entry.isUser ? " you" : ""}`);
      card.style.setProperty("--podium-height", `${heights[index]}px`);
      card.append(element("span", "podium-avatar", entry.icon), element("strong", "", entry.name), element("small", "", `${entry.score.toLocaleString("es-MX")} pts`));
      return card;
    }));

    $("leaderboard-list").replaceChildren(...data.map((entry, index) => {
      const row = element("div", `leaderboard-row${entry.isUser ? " is-user" : ""}`);
      row.append(element("span", "leaderboard-position", String(index + 1)));
      row.append(element("span", "leaderboard-avatar", entry.icon));
      row.append(element("strong", "", entry.name));
      row.append(element("span", "leaderboard-score", entry.score.toLocaleString("es-MX")));
      return row;
    }));
  }

  function renderProfilePanel() {
    if (!state) return;
    $("profile-name").textContent = state.name;
    $("profile-rank").textContent = getRank(accuracy());
    $("profile-tip").textContent = state.sanctionPending
      ? "Respira y vuelve a intentarlo. Aprender a tomar buenas decisiones también toma práctica."
      : state.completed >= TOTAL
        ? "¡Llegaste a la meta! Tus decisiones honestas construyen una comunidad mejor."
        : `Si completas el siguiente reto en ${questions[Math.min(state.completed, TOTAL - 1)].lugar.toLowerCase()}, seguirás fortaleciendo tu integridad.`;

    $("profile-badge-goals").replaceChildren(...badges.map((badge) => {
      const item = element("div", `goal-row${state.earned.has(badge.id) ? " unlocked" : ""}`);
      item.append(element("span", "goal-icon", badge.icon));
      const copy = element("div", "goal-copy");
      copy.append(element("strong", "", badge.name), element("small", "", state.earned.has(badge.id) ? "Desbloqueada" : badge.rule));
      item.append(copy, element("span", "goal-value", state.earned.has(badge.id) ? "✓" : "Pendiente"));
      return item;
    }));

    const week = $("profile-week");
    const days = ["L", "M", "M", "J", "V", "S", "D"];
    const activeDays = Math.max(1, Math.min(7, Math.ceil(Math.max(state.streak, 1) / 1)));
    week.replaceChildren(...days.map((day, index) => {
      const chip = element("div", `week-day ${index < activeDays ? (index < Math.max(0, activeDays - 1) ? "done" : "current") : ""}`);
      chip.append(element("span", "week-ball", index < activeDays ? (index < Math.max(0, activeDays - 1) ? "✓" : "★") : String(index + 1)), element("small", "", day));
      return chip;
    }));
  }

  function isRewardUnlocked(reward) {
    if (!state) return false;
    if (reward.requirement.type === "level") return state.completed + 1 >= reward.requirement.value;
    if (reward.requirement.type === "score") return state.score >= reward.requirement.value;
    return false;
  }

  function renderRewards() {
    if (!state) return;
    $("reward-grid").replaceChildren(...rewardsCatalog.map((reward, index) => {
      const unlocked = isRewardUnlocked(reward);
      const card = element("article", `reward-card${unlocked ? " unlocked" : " locked"}`);
      const header = element("div", "reward-avatar", ["🛡️", "👮", "🌙", "✨", "🧢", "💠", "🚓", "👑"][index] || "🎁");
      const status = element("span", `reward-status ${unlocked ? "ready" : "off"}`, unlocked ? (reward.action === "Equipado" ? "EQUIPADO" : "LISTO") : "BLOQUEADO");
      const copy = element("div", "reward-copy");
      copy.append(element("strong", "", reward.name));
      const requirement = reward.requirement.type === "level" ? `Nivel ${reward.requirement.value}` : `${reward.requirement.value.toLocaleString("es-MX")} pts`;
      copy.append(element("small", "", requirement));
      const button = element("button", `reward-button ${unlocked ? "" : "disabled"}`.trim(), unlocked ? reward.action : "Bloqueado");
      button.type = "button";
      button.disabled = !unlocked;
      card.append(status, header, copy, button);
      return card;
    }));
  }

  function renderSanction() {
    if (!state) return;
    $("sanction-streak-loss").textContent = state.lastLostStreak > 0 ? `−${state.lastLostStreak}` : "0";
    $("sanction-points-loss").textContent = `−${state.lastPenalty} pts`;
    $("sanction-time").textContent = `${Math.max(1, state.wrongStreak)} reto${Math.max(1, state.wrongStreak) === 1 ? "" : "s"}`;
  }

  function returnFromSanction() {
    if (!state) return;
    state.sanctionPending = false;
    state.wrongStreak = 0;
    renderGame();
    switchView("retos");
    showToast("Volviste a la ruta. Lee con calma y vuelve a intentarlo.");
  }

  function finishGame() {
    if (!state || state.finished || state.completed !== TOTAL) return;
    state.finished = true;
    clearSession();
    const percentage = accuracy();
    profile.highScore = Math.max(profile.highScore, state.score);
    profile.bestAccuracy = Math.max(profile.bestAccuracy, percentage);
    saveProfile();
    $("winner-name").textContent = state.name;
    $("final-score").textContent = "0";
    $("final-correct").textContent = "0";
    $("final-wrong").textContent = "0";
    $("final-accuracy").textContent = "0%";
    $("rank").textContent = getRank(percentage);
    $("final-badges").replaceChildren(...badges.filter((badge) => state.earned.has(badge.id)).map((badge) => element("span", "earned-pill", `${badge.icon} ${badge.name}`)));
    $("best-results").textContent = `Tu récord: ${Math.max(profile.highScore, state.score)} puntos · Mejor porcentaje: ${Math.max(profile.bestAccuracy, percentage)}% · Insignias guardadas: ${profile.badges.length}/${badges.length}`;
    showScreen("victory");
    animateNumber($("final-score"), 0, state.score, 1000);
    animateNumber($("final-correct"), 0, state.correct, 750);
    animateNumber($("final-wrong"), 0, state.wrong, 750);
    animateNumber($("final-accuracy"), 0, percentage, 900, "%");
    $("victory-title").focus();
    announce(`¡Felicidades, ${state.name}! ${state.score} puntos y ${percentage}% de aciertos. ${getRank(percentage)}.`);
    celebrate();
    playSound("win");
  }

  function showResults() {
    if (!state?.finished) return;
    $("results-summary").textContent = `${state.name}: ${state.correct} correctas y ${state.wrong} incorrectas en ${state.attempts.length} intentos. Aciertos: ${accuracy()}%.`;
    $("results-list").replaceChildren(...questions.map((question, index) => {
      const attempts = state.attempts.filter((attempt) => attempt.questionId === question.id);
      const card = element("details", "result-item");
      card.append(element("summary", "", `${index + 1}. ${question.titulo} · ${attempts.length} ${attempts.length === 1 ? "intento" : "intentos"}`));
      card.append(element("p", "", question.escenario));
      const list = element("ol", "result-attempts");
      attempts.forEach((attempt) => list.append(element("li", "", `${attempt.correct ? "✓ Correcta" : "↺ Incorrecta"}: ${question.opciones[attempt.optionIndex].texto} (${attempt.points > 0 ? "+" : ""}${attempt.points} pts)`)));
      card.append(list, element("p", "", `Decisión honesta: ${question.opciones[question.correcta].texto}`), element("p", "", question.explicacion), element("small", "", question.tipo));
      return card;
    }));
    openDialog("results-dialog");
    $("results-title").focus();
  }

  function switchView(view, focus = true) {
    if (!["home", "retos", "ranking", "profile", "rewards", "sanction"].includes(view)) return;
    currentView = view;
    document.querySelectorAll("[data-view-panel]").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.viewPanel === view));
    document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
    $("view-subtitle").textContent = getViewSubtitle(view);
    if (focus) $("game-title").focus({ preventScroll: true });
  }

  function getViewSubtitle(view) {
    if (!state) return "Aquí va tu progreso del día.";
    const nextPlace = questions[Math.min(state.completed, TOTAL - 1)]?.lugar || "la ciudad";
    const subtitles = {
      home: "Aquí va tu progreso del día.",
      retos: `Continúa tu ruta en ${nextPlace}.`,
      ranking: "Mira cómo va tu comunidad esta semana.",
      profile: "Personaliza y revisa tu avance.",
      rewards: "Consulta recompensas, skins e insignias.",
      sanction: "Tu última decisión tuvo consecuencias."
    };
    return subtitles[view] || "Aquí va tu progreso del día.";
  }

  function showToast(text) {
    clearTimeout(toastTimer);
    $("toast").textContent = text;
    $("toast").hidden = false;
    toastTimer = setTimeout(() => { $("toast").hidden = true; }, 4500);
  }

  function animateNumber(node, from, to, duration = 450, suffix = "") {
    if (!node) return;
    if (reducedMotion.matches || from === to) {
      node.textContent = `${to}${suffix}`;
      return;
    }
    const start = performance.now();
    const delta = to - from;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      node.textContent = `${Math.round(from + delta * easeOut(progress))}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function pulseStat(childId) {
    const stat = $(childId)?.closest(".stat");
    if (!stat || reducedMotion.matches) return;
    stat.classList.remove("fx-pop");
    void stat.offsetWidth;
    stat.classList.add("fx-pop");
    setTimeout(() => stat.classList.remove("fx-pop"), 560);
  }

  function animateMissionRefresh() {
    const card = document.querySelector(".mission-card");
    if (!card || reducedMotion.matches) return;
    card.classList.remove("fx-refresh");
    void card.offsetWidth;
    card.classList.add("fx-refresh");
    setTimeout(() => card.classList.remove("fx-refresh"), 650);
  }

  function queueLayout() {
    cancelAnimationFrame(layoutFrame);
    layoutFrame = requestAnimationFrame(layoutBoard);
  }

  function layoutBoard() {
    if (!state || $("game").hidden || !document.getElementById("view-retos").classList.contains("is-active")) return;
    const columns = window.matchMedia("(max-width: 700px)").matches ? 3 : 5;
    const nodes = Array.from($("map-nodes").children);
    nodes.forEach((node, index) => {
      const row = Math.floor(index / columns);
      node.style.gridColumn = row % 2 === 0 ? index % columns + 1 : columns - index % columns;
      node.style.gridRow = row + 1;
    });
    const board = $("board").getBoundingClientRect();
    const points = nodes.map((node) => {
      const circle = node.querySelector(".node-circle").getBoundingClientRect();
      return { x: circle.left - board.left + circle.width / 2, y: circle.top - board.top + circle.height / 2 };
    });
    const path = (list) => list.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" ");
    $("route").setAttribute("viewBox", `0 0 ${board.width} ${board.height}`);
    $("route-base").setAttribute("d", path(points));
    $("route-progress").setAttribute("d", path(points.slice(0, Math.min(state.completed + 1, TOTAL))));
    const position = points[Math.min(state.completed, TOTAL - 1)];
    if (!position) return;
    const token = $("player-token");
    const moved = token.style.left && (token.style.left !== `${position.x}px` || token.style.top !== `${position.y}px`);
    token.style.left = `${position.x}px`;
    token.style.top = `${position.y}px`;
    if (moved && !reducedMotion.matches) {
      token.classList.remove("player-moving", "player-land");
      void token.offsetWidth;
      token.classList.add("player-moving");
      setTimeout(() => {
        token.classList.remove("player-moving");
        token.classList.add("player-land");
        setTimeout(() => token.classList.remove("player-land"), 420);
      }, 700);
    }
    token.setAttribute("aria-label", state.completed === TOTAL ? "Llegaste a la meta" : `Tu personaje en el nivel ${state.completed + 1}`);
  }

  function burstAround(target, success = true) {
    if (!target || reducedMotion.matches) return;
    const box = target.getBoundingClientRect();
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    const colors = success ? ["#ffda57", "#28b48d", "#dbf785", "#529ae8"] : ["#ff705b", "#ffb09e", "#ffd2c7"];
    const count = success ? 14 : 8;
    for (let i = 0; i < count; i++) {
      const spark = element("i", i % 4 === 0 && success ? "fx-star" : "fx-spark", i % 4 === 0 && success ? "✦" : "");
      const angle = (Math.PI * 2 * i / count) + Math.random() * 0.3;
      const distance = 38 + Math.random() * 54;
      spark.style.left = `${cx}px`;
      spark.style.top = `${cy}px`;
      spark.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
      spark.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
      spark.style.setProperty("--spark", colors[i % colors.length]);
      if (spark.classList.contains("fx-star")) spark.style.color = colors[i % colors.length];
      document.body.append(spark);
      setTimeout(() => spark.remove(), 1000);
    }
  }

  function flashWrong() {
    if (reducedMotion.matches) return;
    document.body.classList.remove("fx-wrong-flash");
    void document.body.offsetWidth;
    document.body.classList.add("fx-wrong-flash");
    setTimeout(() => document.body.classList.remove("fx-wrong-flash"), 450);
  }

  function showLevelFlash(completedLevel) {
    if (reducedMotion.matches || completedLevel >= TOTAL) return;
    document.querySelector(".level-flash")?.remove();
    const overlay = element("div", "level-flash");
    const card = element("div");
    card.append(element("strong", "", `¡NIVEL ${completedLevel} SUPERADO!`), element("span", "", `Siguiente reto: ${questions[completedLevel].lugar} ${questions[completedLevel].icono}`));
    overlay.append(card);
    document.body.append(overlay);
    setTimeout(() => overlay.remove(), 1050);
  }

  function floatPoints(points) {
    if (reducedMotion.matches) return;
    const floating = element("span", "points-float", `+${points}`);
    floating.setAttribute("aria-hidden", "true");
    floating.style.left = $("player-token").style.left;
    floating.style.top = $("player-token").style.top;
    $("board").append(floating);
    floating.addEventListener("animationend", () => floating.remove(), { once: true });
    setTimeout(() => floating.remove(), 1700);
  }

  function celebrate() {
    if (reducedMotion.matches) return;
    clearTimeout(confettiTimer);
    const colors = ["#ffda57", "#ff795e", "#28b48d", "#529ae8", "#dbf785", "#ffffff"];
    $("confetti").replaceChildren(...Array.from({ length: 88 }, (_, index) => {
      const piece = element("i", `confetti-piece ${index % 3 === 0 ? "circle" : index % 5 === 0 ? "ribbon" : ""}`.trim());
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[index % colors.length];
      piece.style.animationDelay = `${Math.random() * 1.1}s`;
      piece.style.animationDuration = `${2.5 + Math.random() * 1.5}s`;
      piece.style.setProperty("--drift", `${Math.random() * 260 - 130}px`);
      return piece;
    }));
    confettiTimer = setTimeout(() => $("confetti").replaceChildren(), 5200);
  }

  async function playSound(kind) {
    if (!profile.sound) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      audioContext ||= new Audio();
      if (audioContext.state === "suspended") await audioContext.resume();
      if (!profile.sound) return;
      const melodies = { correct: [523, 659, 784], wrong: [240, 180], advance: [440, 660], win: [523, 659, 784, 1047, 784, 1047] };
      (melodies[kind] || melodies.advance).forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const start = audioContext.currentTime + index * 0.12;
        oscillator.type = kind === "wrong" ? "sine" : "triangle";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.055, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.24);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      });
    } catch {
      // Opcional.
    }
  }

  $("start-form").addEventListener("submit", (event) => {
    event.preventDefault();
    startGame($("player-name").value);
  });
  $("continue-button").addEventListener("click", restoreSession);
  $("mission-button").addEventListener("click", openQuestion);
  $("close-question").addEventListener("click", closeQuestion);
  $("question-dialog").addEventListener("cancel", (event) => {
    event.preventDefault();
    closeQuestion();
  });
  $("feedback-button").addEventListener("click", continueAfterAnswer);
  $("retry-button").addEventListener("click", () => {
    if (!state || state.lives !== 0) return;
    state.lives = MAX_LIVES;
    state.wrongStreak = 0;
    renderGame();
    openQuestion();
    announce("Recuperaste tus 3 vidas. ¡Inténtalo de nuevo!");
  });
  ["rest-restart"].forEach((id) => $(id).addEventListener("click", () => openDialog("restart-dialog")));
  $("confirm-restart").addEventListener("click", () => startGame(state?.name || profile.name));
  $("play-again").addEventListener("click", () => {
    clearTimeout(confettiTimer);
    $("confetti").replaceChildren();
    $("player-name").value = profile.name;
    showScreen("welcome");
    $("player-name").focus();
  });
  $("help-button").addEventListener("click", () => openDialog("help-dialog"));
  $("results-button").addEventListener("click", showResults);
  $("sound-button").addEventListener("click", () => {
    profile.sound = !profile.sound;
    saveProfile();
    if (profile.sound) playSound("advance");
    else if (audioContext?.state === "running") audioContext.suspend().catch(() => {});
  });
  $("sanction-return").addEventListener("click", returnFromSanction);
  document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => $(button.dataset.close).close()));

  document.querySelectorAll(".nav-item").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));
  document.querySelectorAll("[data-view-jump]").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.viewJump)));
  document.querySelectorAll(".swatch").forEach((button) => button.addEventListener("click", () => {
    profile.colorTheme = button.dataset.color;
    saveProfile();
    showToast(`Tema ${button.dataset.color} aplicado.`);
  }));

  document.addEventListener("keydown", (event) => {
    if (!state || !$("question-dialog").open || state.answered || event.altKey || event.ctrlKey || event.metaKey) return;
    const key = event.key.toLowerCase();
    const choiceIndex = { a: 0, b: 1, c: 2, d: 3 }[key];
    if (choiceIndex === undefined) return;
    const buttons = [...$("options").querySelectorAll(".choice:not(:disabled)")];
    const button = buttons[choiceIndex];
    if (!button) return;
    event.preventDefault();
    button.click();
  });

  document.addEventListener("pointerdown", (event) => {
    const target = event.target.closest(".button,.choice,.nav-item,.link-chip,.reward-button,.swatch");
    if (!target || target.disabled || reducedMotion.matches) return;
    const box = target.getBoundingClientRect();
    const ripple = element("span", "fx-ripple");
    ripple.style.left = `${event.clientX - box.left}px`;
    ripple.style.top = `${event.clientY - box.top}px`;
    target.append(ripple);
    setTimeout(() => ripple.remove(), 700);
  });

  window.addEventListener("resize", queueLayout);
  if ("ResizeObserver" in window) new ResizeObserver(queueLayout).observe($("board"));
  $("player-name").value = profile.name;
  renderProfile();
  renderSessionSummary();
})();

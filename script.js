/* =========================================================
   KRITIQUESTIONI 4.0.3 — CINEMA EDITION
   Sessão dupla, pedidos, ingressos, avaliações e persistência.
   ========================================================= */

"use strict";

const VERSION = "4.0.3";
const STORAGE_KEY = "kritiquestioni:cinema:4.0.3";
const GUESTS = "Kauan & Iasmin";
const HOLD_DELAY = 420;
const HOLD_TICK = 82;
const INF = "inf";

const FILMS = {
  clayface: {
    id: "clayface",
    order: 1,
    code: "CF",
    title: "Cara de Barro",
    date: "01/11/2026",
    time: "14:50",
    room: "02",
    place: "Central Plaza",
    language: "Dublado",
    poster: "Clayface.png",
    posterAlt: "Cartaz de Cara de Barro",
    tagline: "A primeira sessão da tarde. Meio barrosa, não vou mentir.",
    blurb: "Um ator em ascensão sofre uma tragédia que transforma seu corpo em uma massa de argila. Em meio à busca por sua identidade, sua história mergulha no horror e na obsessão pela aparência.",
    sessionLabel: "Sessão 01",
  },
  verity: {
    id: "verity",
    order: 2,
    code: "VT",
    title: "Verity",
    date: "01/11/2026",
    time: "16:40",
    room: "06",
    place: "Central Plaza",
    language: "Dublado",
    poster: "Verity.png",
    posterAlt: "Cartaz de Verity",
    tagline: "A segunda sessão. Agora com mais suspense e menos desculpas.",
    blurb: "Uma escritora é contratada para terminar a obra de uma autora famosa que sofreu um acidente. Ao investigar seus manuscritos, acaba descobrindo segredos perturbadores sobre sua vida.",
    sessionLabel: "Sessão 02",
  },
};

const PEOPLE = [
  { key: "i", label: "I", name: "Iasmin" },
  { key: "k", label: "K", name: "Kauan" },
];

const SNACKS = [
  {
    id: "abraco",
    name: "Abraço cinematográfico",
    description: "Um abraço durante a sessão.",
    unit: "unidade",
    icon: "heart",
    accent: "red",
    max: null,
  },
  {
    id: "beijinhos",
    name: "Beijinhos surpresa",
    description: "Beijinhos surpresa durante o filme.",
    unit: "unidade",
    icon: "kiss",
    accent: "lilac",
    max: null,
  },
  {
    id: "apoio",
    name: "Apoio de braço removido",
    description: "Remoção do apoio de braço entre os dois assentos para permitir maior proximidade.",
    unit: "última unidade",
    icon: "seat",
    accent: "gold",
    max: 1,
  },
  {
    id: "maos",
    name: "Mãos dadas",
    description: "Um acompanhamento clássico para a sessão.",
    unit: "última unidade",
    icon: "hands",
    accent: "green",
    max: 1,
  },
  {
    id: "ombro",
    name: "Encosto de ombro",
    description: "Permissão para apoiar a cabeça no ombro durante o filme.",
    unit: "última unidade",
    icon: "shoulder",
    accent: "red",
    max: 1,
  },
];

const ICONS = {
  arrowLeft:
    '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
  arrowRight:
    '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  ticket:
    '<path d="M3 9a2 2 0 0 0 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><path d="M13 5v2M13 11v2M13 17v2"/>',
  check:
    '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/>',
  lock:
    '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><path d="M12 15v2"/>',
  warning:
    '<path d="M12 3 2.5 20h19z"/><path d="M12 9v5"/><circle cx="12" cy="17.4" r=".7" fill="currentColor" stroke="none"/>',
  clapper:
    '<path d="M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M4 8 3.2 5l15.4-3.7 1.6 5.2"/><path d="m9 4-1 4M14 2.7l-1 4"/>',
  reset:
    '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
  heart:
    '<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z"/>',
  kiss:
    '<path d="M3 12c3-4 6-4 9-1 3-3 6-3 9 1-3 4-6 4-9 1-3 3-6 3-9-1z"/><path d="M7 8.2 6 6M17 8.2 18 6"/>',
  seat:
    '<path d="M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/><path d="M4 10v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M4 14h16M7 19v2M17 19v2"/>',
  hands:
    '<path d="M7 11V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M10 10V4.5a1.5 1.5 0 0 1 3 0V10"/><path d="M13 10V5.5a1.5 1.5 0 0 1 3 0V12"/><path d="M16 9a1.5 1.5 0 0 1 3 0v4c0 4-2.6 7-7 7h-1a6 6 0 0 1-5.2-3L3 12.5A1.6 1.6 0 0 1 5.5 11L8 14"/>',
  shoulder:
    '<circle cx="8" cy="6" r="2.5"/><path d="M3 19v-2a5 5 0 0 1 10 0v2"/><path d="M14 11h5a2 2 0 0 1 2 2v6"/><path d="M11 11h3"/>',
  plus:
    '<path d="M12 5v14M5 12h14"/>',
  minus:
    '<path d="M5 12h14"/>',
};

const STAR_PATH =
  "M12 2.6l2.8 6.05 6.62.7-4.94 4.48 1.34 6.53L12 17.1l-5.82 3.26 1.34-6.53L2.58 9.35l6.62-.7L12 2.6Z";

const RATING_CAPTIONS = {
  0: "Escolha uma nota. O filme está esperando.",
  0.5: "Meia estrela. O que acabamos de ver?",
  1: "Uma estrela. Pelo menos o ingresso era bonito.",
  1.5: "Uma estrela e meia. O chiclete salvou.",
  2: "Duas estrelas. Um filme já feito.",
  2.5: "Duas estrelas e meia. Existe potencial.",
  3: "Três estrelas. Sessão aprovada com ressalvas.",
  3.5: "Três estrelas e meia. Entrou pra jogo.",
  4: "Quatro estrelas. Ótimo filme e companhia melhor ainda.",
  4.5: "Quatro estrelas e meia. UOU.",
  5: "Cinco estrelas. ABSOLUTE CINEMA!",
};

/* ---------- estado ---------- */

function defaultMovie(id) {
  return {
    unlocked: id === "clayface",
    order: FILMS[id].order,
    ticketIssued: false,
    ticket: null,
    watched: false,
    ratings: { i: null, k: null },
    ratedAt: null,
    items: {},
  };
}

function defaultState() {
  return {
    version: VERSION,
    started: false,
    createdAt: Date.now(),
    movies: {
      clayface: defaultMovie("clayface"),
      verity: defaultMovie("verity"),
    },
    surprise: {
      stage: 0,
      startedAt: null,
      updatedAt: null,
    },
  };
}

let state = loadState();
let ui = {
  view: "intro",
  movieId: null,
  stage: null,
  ratingDrafts: { i: 0, k: 0 },
  modal: null,
  freshTicket: false,
  surpriseStage: 0,
  surprisePrinting: false,
  surpriseGlitch: false,
};

let blackoutTimer = null;
let blackoutHideTimer = null;
let toastTimer = null;
let emissionTimer = null;
let surpriseTimer = null;
let press = null;

function clampRating(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const rounded = Math.round(value * 2) / 2;
  if (rounded < 0.5) return null;
  return Math.min(5, rounded);
}

function normalizeQty(value, snack) {
  if (value === INF || value === Infinity) {
    return snack.max ? snack.max : INF;
  }
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  let qty = Math.floor(value);
  if (qty <= 0) return 0;
  qty = Math.min(9999, qty);
  if (snack.max) qty = Math.min(snack.max, qty);
  return qty;
}

function itemsMap(raw) {
  const items = {};
  if (Array.isArray(raw)) {
    raw.forEach(function (entry) {
      if (!entry || typeof entry !== "object") return;
      const snack = SNACKS.find(function (candidate) {
        return candidate.id === entry.id;
      });
      if (!snack) return;
      const qty = normalizeQty(entry.qty, snack);
      if (qty) items[snack.id] = qty;
    });
    return items;
  }
  if (!raw || typeof raw !== "object") return items;
  for (const snack of SNACKS) {
    const qty = normalizeQty(raw[snack.id], snack);
    if (qty) items[snack.id] = qty;
  }
  return items;
}

function normalizeItems(raw) {
  return itemsMap(raw);
}

function normalizeTicket(raw, movieId) {
  if (!raw || typeof raw !== "object") return null;
  const issuedAt =
    typeof raw.issuedAt === "number" && Number.isFinite(raw.issuedAt)
      ? raw.issuedAt
      : Date.now();
  const serial =
    typeof raw.serial === "string" && raw.serial.trim()
      ? raw.serial.trim()
      : makeSerial(movieId);
  const items = selectedItems(normalizeItems(raw.items)).map(function (item) {
    return { id: item.id, qty: item.qty };
  });
  return {
    issuedAt,
    serial,
    items,
  };
}

function normalizeSurprise(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  const stage = source.stage === 1 || source.stage === 2 || source.stage === 3 ? source.stage : 0;
  return {
    stage,
    startedAt:
      stage && typeof source.startedAt === "number" && Number.isFinite(source.startedAt)
        ? source.startedAt
        : null,
    updatedAt:
      stage && typeof source.updatedAt === "number" && Number.isFinite(source.updatedAt)
        ? source.updatedAt
        : null,
  };
}

function normalizeState(raw) {
  const base = defaultState();
  if (!raw || typeof raw !== "object" || raw.version !== VERSION) return base;

  const sourceMovies = raw.movies && typeof raw.movies === "object" ? raw.movies : {};

  for (const id of Object.keys(FILMS)) {
    const source = sourceMovies[id] && typeof sourceMovies[id] === "object"
      ? sourceMovies[id]
      : {};
    const movie = base.movies[id];
    movie.items = normalizeItems(source.items);

    const ratings = { i: null, k: null };
    if (source.ratings && typeof source.ratings === "object") {
      ratings.i = clampRating(source.ratings.i);
      ratings.k = clampRating(source.ratings.k);
    }
    const legacyRating = clampRating(source.rating);
    if (ratings.i === null && ratings.k === null && legacyRating !== null) {
      ratings.i = legacyRating;
      ratings.k = legacyRating;
    }
    movie.ratings = ratings;
    movie.watched = Boolean(
      ratings.i !== null &&
        ratings.k !== null &&
        (source.watched || source.ratedAt || legacyRating !== null)
    );
    movie.ratedAt =
      movie.watched && typeof source.ratedAt === "number" && Number.isFinite(source.ratedAt)
        ? source.ratedAt
        : movie.watched
          ? Date.now()
          : null;
    movie.ticket = normalizeTicket(source.ticket, id);
    movie.ticketIssued = Boolean(movie.ticket || source.ticketIssued === true) && Boolean(movie.ticket);
    if (!movie.ticket) movie.ticketIssued = false;
    movie.unlocked = id === "clayface" ? true : Boolean(base.movies.clayface.watched);
  }

  base.movies.verity.unlocked = Boolean(base.movies.clayface.watched);
  base.surprise = normalizeSurprise(raw.surprise);
  base.started = Boolean(
    raw.started ||
      base.movies.clayface.watched ||
      base.movies.verity.watched ||
      base.movies.clayface.ticketIssued ||
      base.movies.verity.ticketIssued ||
      Object.keys(base.movies.clayface.items).length ||
      Object.keys(base.movies.verity.items).length ||
      base.surprise.stage
  );
  base.createdAt =
    typeof raw.createdAt === "number" && Number.isFinite(raw.createdAt)
      ? raw.createdAt
      : Date.now();
  return base;
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return normalizeState(JSON.parse(raw));
  } catch (error) {
    return defaultState();
  }
}

function saveState() {
  state.version = VERSION;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    showToast("Não foi possível salvar o progresso neste navegador.", true);
    return false;
  }
}

/* ---------- utilidades ---------- */

function icon(name, className) {
  const body = ICONS[name] || "";
  return (
    '<svg class="' +
    (className || "btn__icon") +
    '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    body +
    "</svg>"
  );
}

function formatQty(value) {
  if (value === INF || value === Infinity) return "∞";
  if (typeof value !== "number" || !Number.isFinite(value)) return "0";
  return Math.floor(value).toLocaleString("pt-BR");
}

function formatRating(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "0";
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(".", ",");
}

function makeSerial(movieId) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let tail = "";
  for (let index = 0; index < 5; index += 1) {
    tail += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  const code = FILMS[movieId] ? FILMS[movieId].code : "KR";
  return "KRQ-403-" + code + "-" + tail;
}

function starState(index, rating) {
  if (rating >= index) return "full";
  if (rating >= index - 0.5) return "half";
  return "empty";
}

function starSvg(fill) {
  let fillColor = "#2b222e";
  let strokeColor = "rgba(244, 201, 93, 0.22)";
  if (fill === "full") {
    fillColor = "#f4c95d";
    strokeColor = "#b58a2e";
  } else if (fill === "half") {
    fillColor = "url(#starFillHalf)";
    strokeColor = "#b58a2e";
  }
  return (
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="' +
    STAR_PATH +
    '" fill="' +
    fillColor +
    '" stroke="' +
    strokeColor +
    '" stroke-width="0.9" stroke-linejoin="round"/>' +
    "</svg>"
  );
}

function starsDisplay(rating, large) {
  let stars = "";
  for (let index = 1; index <= 5; index += 1) {
    stars +=
      '<span class="star-display">' +
      starSvg(starState(index, rating || 0)) +
      "</span>";
  }
  return (
    '<span class="stars-display' +
    (large ? " stars-display--lg" : "") +
    '" role="img" aria-label="' +
    formatRating(rating || 0) +
    ' de 5 estrelas">' +
    stars +
    "</span>"
  );
}

function starDefs() {
  return (
    '<svg class="svg-defs" aria-hidden="true" focusable="false" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden">' +
    "<defs>" +
    '<linearGradient id="starFillHalf" x1="0%" y1="0%" x2="100%" y2="0%">' +
    '<stop offset="50%" stop-color="#f4c95d"/>' +
    '<stop offset="50%" stop-color="#2b222e"/>' +
    "</linearGradient>" +
    "</defs>" +
    "</svg>"
  );
}

function ratingPairMarkup(ratings, variant) {
  const large = variant !== "poster";
  return (
    '<div class="rating-pair rating-pair--' +
    variant +
    '">' +
    PEOPLE.map(function (person) {
      const value =
        ratings && typeof ratings[person.key] === "number" ? ratings[person.key] : null;
      return (
        '<span class="rating-pair__person">' +
        '<span class="rating-pair__label">' +
        person.label +
        "</span>" +
        starsDisplay(value || 0, large) +
        '<span class="rating-pair__score">' +
        (value === null ? "—" : formatRating(value)) +
        "</span>" +
        "</span>"
      );
    }).join("") +
    "</div>"
  );
}

function countItems(items) {
  const map = itemsMap(items);
  let total = 0;
  let types = 0;
  for (const snack of SNACKS) {
    const qty = map[snack.id];
    if (qty === INF) {
      total = Infinity;
      types += 1;
    } else if (typeof qty === "number" && qty > 0) {
      total += qty;
      types += 1;
    }
  }
  return { total, types };
}

function selectedItems(items) {
  const map = itemsMap(items);
  return SNACKS.filter((snack) => {
    const qty = map[snack.id];
    return qty === INF || (typeof qty === "number" && qty > 0);
  }).map((snack) => ({ id: snack.id, qty: map[snack.id] }));
}

function movieOf(id) {
  return state.movies[id];
}

function ratingsOf(id) {
  return movieOf(id).ratings;
}

function hasBothRatings(id) {
  const ratings = ratingsOf(id);
  return typeof ratings.i === "number" && typeof ratings.k === "number";
}

function allRatingsComplete() {
  return Object.keys(FILMS).every(hasBothRatings);
}

function allWatched() {
  return state.movies.clayface.watched && state.movies.verity.watched;
}

function surpriseUnlocked() {
  return allWatched() && allRatingsComplete();
}

function hasProgress() {
  if (state.started) return true;
  return Object.keys(state.movies).some((id) => {
    const movie = state.movies[id];
    return (
      movie.watched ||
      movie.ticketIssued ||
      movie.ticket ||
      Object.keys(movie.items).length > 0
    );
  });
}

function scrollTop() {
  try {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  } catch (error) {
    window.scrollTo(0, 0);
  }
}

function showToast(message, alert) {
  const element = document.getElementById("toast");
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("is-alert", Boolean(alert));
  element.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(function () {
    element.classList.remove("is-visible");
  }, 3400);
}

function announce(message) {
  const element = document.getElementById("sr-status");
  if (element) element.textContent = message;
}

function syncBodyLock() {
  const blackout = document.getElementById("blackout");
  const locked = Boolean(ui.modal) || Boolean(blackout && blackout.classList.contains("is-on"));
  document.body.classList.toggle("is-locked", locked);
}

function withBlackout(label, callback) {
  const blackout = document.getElementById("blackout");
  if (!blackout) {
    callback();
    return;
  }
  const text = blackout.querySelector(".blackout__text");
  if (text && label) text.textContent = label;
  window.clearTimeout(blackoutTimer);
  window.clearTimeout(blackoutHideTimer);
  blackout.classList.add("is-on");
  syncBodyLock();

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  blackoutTimer = window.setTimeout(function () {
    callback();
    scrollTop();
    blackoutHideTimer = window.setTimeout(function () {
      blackout.classList.remove("is-on");
      syncBodyLock();
    }, reduce ? 40 : 280);
  }, reduce ? 40 : 720);
}

/* ---------- dados de apoio ---------- */

function movieStatus(id) {
  const movie = movieOf(id);
  if (movie.watched) return "watched";
  if (movie.ticketIssued) return "issued";
  if (!movie.unlocked) return "locked";
  return "available";
}

function averageRating() {
  const ratings = [];
  Object.keys(FILMS).forEach(function (id) {
    const movieRatings = ratingsOf(id);
    PEOPLE.forEach(function (person) {
      if (typeof movieRatings[person.key] === "number") {
        ratings.push(movieRatings[person.key]);
      }
    });
  });
  if (!ratings.length) return null;
  return ratings.reduce(function (sum, rating) {
    return sum + rating;
  }, 0) / ratings.length;
}

function qrCells(serial) {
  let seed = 2166136261;
  for (let index = 0; index < serial.length; index += 1) {
    seed ^= serial.charCodeAt(index);
    seed = Math.imul(seed, 16777619) >>> 0;
  }
  const cells = [];
  for (let index = 0; index < 81; index += 1) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    cells.push(seed % 100 < 46);
  }
  function put(x, y, value) {
    if (x >= 0 && x < 9 && y >= 0 && y < 9) cells[y * 9 + x] = value;
  }
  [0, 6].forEach(function (offsetX) {
    [0, 6].forEach(function (offsetY) {
      for (let y = 0; y < 3; y += 1) {
        for (let x = 0; x < 3; x += 1) {
          put(offsetX + x, offsetY + y, !(x === 1 && y === 1));
        }
      }
    });
  });
  return cells;
}

/* ---------- componentes compartilhados ---------- */

function siteHead() {
  return (
    '<header class="site-head">' +
    '<div class="site-head__inner">' +
    '<button class="brand-mini" type="button" data-action="go-intro" aria-label="Voltar à abertura do KritiquestionI Cinema">' +
    '<img class="brand-mini__logo" src="KritiquestionI.png" alt="KritiquestionI">' +
    '<span class="brand-mini__text"><strong>CINEMA EDITION</strong><small>VERSÃO 4.0.3</small></span>' +
    "</button>" +
    '<div class="site-head__right">' +
    '<button class="head-link head-link--gold" type="button" data-action="go-lobby">PROGRAMAÇÃO</button>' +
    (allWatched()
      ? '<button class="head-link" type="button" data-action="open-final">FIM DE SESSÃO</button>'
      : "") +
    "</div>" +
    "</div>" +
    "</header>"
  );
}

function siteFoot() {
  return (
    '<footer class="site-foot">' +
    '<div class="site-foot__brand"><strong>Developed by Kauan Technologies®</strong><small>KritiquestionI 4.0.3 · Cinema Edition</small></div>' +
    (hasProgress()
      ? '<button class="text-btn" type="button" data-action="reset-ask">' +
        icon("reset") +
        "Reiniciar sessão</button>"
      : "<span>01/11/2026 · Central Plaza</span>") +
    "</footer>"
  );
}

function metaItem(label, value) {
  return (
    '<div class="film-meta__item"><span>' +
    label +
    "</span><strong>" +
    value +
    "</strong></div>"
  );
}

function boardItem(label, value, wide) {
  return (
    '<div class="session-board__item' +
    (wide ? " session-board__item--wide" : "") +
    '"><span>' +
    label +
    "</span><strong>" +
    value +
    "</strong></div>"
  );
}

function receiptMeta(label, value) {
  return "<div><span>" + label + "</span><strong>" + value + "</strong></div>";
}

/* ---------- abertura ---------- */

function introView() {
  const complete = allWatched();
  const progress = hasProgress();
  const action = complete ? "open-final" : "start";
  const label = complete
    ? "VER FIM DE SESSÃO"
    : progress
      ? "CONTINUAR SESSÃO"
      : "INICIAR SESSÃO";

  return (
    '<div class="view view--intro">' +
    '<div class="intro">' +
    '<div class="intro__top">' +
    '<span class="chip chip--green">VERSÃO 4.0.3</span>' +
    '<span class="chip chip--gold">CINEMA EDITION</span>' +
    "</div>" +
    '<img class="intro__logo" src="KritiquestionI.png" alt="Logo KritiquestionI">' +
    '<p class="intro__kicker">UMA SESSÃO PARTICULAR</p>' +
    '<h1 class="intro__title"><span>CINEMA</span><span>EDITION</span></h1>' +
    '<p class="intro__line">Dois filmes, dois ingressos e uma quantidade <strong>questionável</strong> de acompanhamentos. O chiclete é por conta da casa.</p>' +
    '<div class="intro__actions">' +
    '<button class="btn btn--primary btn--xl" type="button" data-action="' +
    action +
    '">' +
    label +
    icon("arrowRight") +
    "</button>" +
    '<span class="intro__note">' +
    (complete
      ? "Sessão dupla concluída · notas salvas"
      : progress
        ? "Progresso salvo neste dispositivo"
        : "Kauan + Iasmin · 01/11/2026 · Central Plaza") +
    "</span>" +
    (progress
      ? '<button class="text-btn" type="button" data-action="reset-ask">' +
        icon("reset") +
        "Reiniciar sessão</button>"
      : "") +
    "</div>" +
    '<div class="intro__stub">' +
    "<span>SALA 04.0.3</span>" +
    "<span>DURAÇÃO: O TEMPO QUE PRECISAR</span>" +
    "<span>PIPOCA NÃO INCLUÍDA</span>" +
    "</div>" +
    "</div>" +
    "</div>"
  );
}

/* ---------- lobby ---------- */

function journeyStep(id) {
  const movie = FILMS[id];
  const data = movieOf(id);
  const watched = data.watched;
  const locked = !data.unlocked && !watched;
  const current = !watched && !locked;
  const status = watched
    ? "ASSISTIDO"
    : locked
      ? "BLOQUEADO"
      : data.ticketIssued
        ? "INGRESSO EMITIDO"
        : "EM CARTAZ";
  const stateClass = watched ? "is-done" : locked ? "is-locked" : "is-current";

  return (
    '<div class="journey__step ' +
    stateClass +
    '">' +
    '<span class="journey__dot" aria-hidden="true">' +
    (watched ? "✓" : String(movie.order).padStart(2, "0")) +
    "</span>" +
    '<span class="journey__text"><strong>' +
    movie.title +
    "</strong><small>" +
    status +
    "</small></span>" +
    "</div>"
  );
}

function filmCard(id) {
  const movie = FILMS[id];
  const data = movieOf(id);
  const locked = !data.unlocked && !data.watched;
  const watched = data.watched;
  const issued = data.ticketIssued;
  const statusClass = locked
    ? "is-locked"
    : watched || issued
      ? "is-issued"
      : "is-live";
  const statusLabel = locked
    ? "BLOQUEADO · SESSÃO 01 PRIMEIRO"
    : watched
      ? "ASSISTIDO · I " +
        formatRating(data.ratings.i) +
        " · K " +
        formatRating(data.ratings.k)
      : issued
        ? "INGRESSO EMITIDO"
        : "DISPONÍVEL";
  const ctaLabel = locked
    ? "AGUARDANDO SESSÃO 01"
    : watched
      ? data.ticketIssued
        ? "VER INGRESSO"
        : "VER SESSÃO"
      : issued
        ? "VER INGRESSO"
        : "VER SESSÃO";

  let posterMarks = "";
  if (watched) {
    posterMarks += '<div class="stamp stamp--soldout">SOLD OUT</div>';
  }
  if (locked) {
    posterMarks +=
      '<div class="lock-overlay"><div class="lock-overlay__inner">' +
      '<span class="lock-overlay__icon">' +
      icon("lock", "") +
      "</span>" +
      '<span class="lock-overlay__title">SESSÃO 02<br>BLOQUEADA</span>' +
      '<span class="lock-overlay__text">Conclua a avaliação de Cara de Barro para liberar este cartaz.</span>' +
      "</div></div>";
  }

  return (
    '<article class="film-card' +
    (locked ? " film-card--locked" : "") +
    '" data-card="' +
    id +
    '">' +
    '<div class="film-card__poster">' +
    '<div class="poster-top"><div class="poster-stack">' +
    '<span class="poster-badge poster-badge--red">SESSÃO ' +
    String(movie.order).padStart(2, "0") +
    "</span>" +
    '<span class="poster-badge">' +
    movie.language.toUpperCase() +
    "</span>" +
    "</div>" +
    (watched ? '<span class="poster-badge poster-badge--gold">VISTO</span>' : "") +
    "</div>" +
    '<img src="' +
    movie.poster +
    '" alt="' +
    movie.posterAlt +
    '" loading="' +
    (id === "clayface" ? "eager" : "lazy") +
    '">' +
    posterMarks +
    '<div class="poster-bottom">' +
    '<div class="poster-time">' +
    movie.time +
    "<small>HORÁRIO</small></div>" +
    (watched
      ? '<div class="poster-rating poster-rating--dual">' +
        ratingPairMarkup(data.ratings, "poster") +
        "</div>"
      : '<div class="poster-rating"><strong>—</strong><small>SEM NOTA</small></div>') +
    "</div>" +
    "</div>" +
    '<div class="film-card__body">' +
    '<div class="film-card__eyebrow"><span>' +
    movie.sessionLabel +
    " · " +
    movie.language +
    "</span><span>2026</span></div>" +
    '<h2 class="film-card__title">' +
    movie.title +
    "</h2>" +
    '<p class="film-card__tagline">' +
    movie.tagline +
    "</p>" +
    '<div class="film-meta">' +
    metaItem("DATA", movie.date) +
    metaItem("SALA", movie.room) +
    metaItem("LOCAL", movie.place) +
    metaItem("IDIOMA", movie.language) +
    "</div>" +
    '<div class="film-card__footer">' +
    '<span class="film-card__status ' +
    statusClass +
    '">' +
    statusLabel +
    "</span>" +
    (locked
      ? '<button class="btn btn--ghost film-card__cta" type="button" data-action="locked-film" data-movie="' +
        id +
        '" aria-disabled="true">' +
        ctaLabel +
        "</button>"
      : '<button class="btn btn--gold film-card__cta" type="button" data-action="' +
        (issued ? "open-ticket" : "open-film") +
        '" data-movie="' +
        id +
        '">' +
        ctaLabel +
        "</button>") +
    "</div>" +
    "</div>" +
    "</article>"
  );
}

function lobbyView() {
  const complete = allWatched();
  return (
    '<div class="view view--lobby">' +
    siteHead() +
    '<main class="page">' +
    '<section class="lobby-hero">' +
    '<div class="lobby-hero__head">' +
    "<div>" +
    '<span class="kicker">PROGRAMAÇÃO · 01/11/2026</span>' +
    '<h1 class="lobby-title">SESSÃO <em>DUPLA</em></h1>' +
    '<p class="lobby-lede">Dois filmes, dois ingressos e uma sessão que só acontece uma vez. <strong>Escolha a primeira sessão</strong> e monte o pedido com calma.</p>' +
    "</div>" +
    '<div class="lobby-side"><span class="lobby-side__date">01 NOV 2026</span><span class="lobby-side__place">CENTRAL PLAZA · SALAS 02 &amp; 06</span></div>' +
    "</div>" +
    '<div class="journey" aria-label="Progresso da sessão dupla">' +
    journeyStep("clayface") +
    '<span class="journey__link" aria-hidden="true"></span>' +
    journeyStep("verity") +
    "</div>" +
    "</section>" +
    '<section class="film-grid" aria-label="Filmes em cartaz">' +
    filmCard("clayface") +
    filmCard("verity") +
    "</section>" +
    (complete
      ? '<section class="lobby-final"><div><span class="kicker">SESSÃO CONCLUÍDA</span><h2>FIM DE SESSÃO.</h2><p>Os dois filmes já entraram para o histórico. Falta só acender as luzes e ver o balanço da noite.</p></div><button class="btn btn--gold" type="button" data-action="open-final">VER ENCERRAMENTO' +
        icon("arrowRight") +
        "</button></section>"
      : "") +
    "</main>" +
    siteFoot() +
    "</div>"
  );
}

/* ---------- detalhes do filme ---------- */

function detailsView() {
  const id = ui.movieId;
  const movie = FILMS[id];
  const data = movieOf(id);
  const watched = data.watched;
  const issued = data.ticketIssued;

  let actions = "";
  if (watched) {
    actions =
      '<div class="watched-panel">' +
      '<div class="watched-panel__row"><span class="watched-panel__label">ASSISTIDO · NOTAS DO CASAL</span></div>' +
      ratingPairMarkup(data.ratings, "watched") +
      "<p>Sessão concluída. O ingresso e as duas notas continuam salvos neste dispositivo.</p>" +
      "</div>" +
      '<div class="movie-actions">' +
      (issued
        ? '<button class="btn btn--gold" type="button" data-action="open-ticket">' +
          icon("ticket") +
          "VER INGRESSO NOVAMENTE</button>"
        : "") +
      '<button class="btn btn--ghost" type="button" data-action="go-lobby">' +
      icon("arrowLeft") +
      "VOLTAR À PROGRAMAÇÃO</button>" +
      "</div>";
  } else if (issued) {
    actions =
      '<div class="ticket-notice">' +
      '<div class="ticket-notice__text"><strong>INGRESSO EMITIDO</strong><span>' +
      data.ticket.serial +
      "</span></div>" +
      '<button class="btn btn--ghost btn--sm" type="button" data-action="open-ticket">VER INGRESSO</button>' +
      "</div>" +
      '<div class="movie-actions">' +
      '<button class="btn btn--primary btn--xl" type="button" data-action="open-watched-confirm">JÁ ASSISTIMOS!' +
      icon("check") +
      "</button>" +
      '<p class="movie-actions__note">' +
      icon("warning") +
      "Ao confirmar, nós dois vamos avaliar o filme. As duas notas são obrigatórias para encerrar esta sessão.</p>" +
      "</div>";
  } else {
    actions =
      '<div class="movie-actions">' +
      '<button class="btn btn--primary btn--xl" type="button" data-action="open-menu">ESCOLHER ACOMPANHAMENTOS' +
      icon("arrowRight") +
      "</button>" +
      '<p class="movie-actions__note">' +
      icon("ticket") +
      "Você revisa o pedido inteiro antes de emitir o ingresso.</p>" +
      "</div>";
  }

  return (
    '<div class="view view--movie">' +
    siteHead() +
    '<main class="page">' +
    '<div class="movie-page">' +
    '<div class="ambient-poster" aria-hidden="true"><img src="' +
    movie.poster +
    '" alt=""></div>' +
    '<button class="back-link" type="button" data-action="go-lobby">' +
    icon("arrowLeft") +
    "VOLTAR À PROGRAMAÇÃO</button>" +
    '<div class="movie-hero">' +
    '<div class="movie-poster-wrap"><div class="movie-poster">' +
    '<img src="' +
    movie.poster +
    '" alt="' +
    movie.posterAlt +
    '">' +
    (watched ? '<div class="stamp stamp--soldout">SOLD OUT</div>' : "") +
    "</div></div>" +
    '<div class="movie-info">' +
    '<span class="kicker kicker--red">' +
    movie.sessionLabel.toUpperCase() +
    " · " +
    movie.place.toUpperCase() +
    "</span>" +
    "<h1>" +
    movie.title.toUpperCase() +
    "</h1>" +
    '<div class="movie-info__top">' +
    '<span class="chip chip--red">' +
    movie.date +
    "</span>" +
    '<span class="chip chip--gold">' +
    movie.time +
    "</span>" +
    '<span class="chip chip--lilac">SALA ' +
    movie.room +
    "</span>" +
    '<span class="chip chip--green">' +
    movie.language.toUpperCase() +
    "</span>" +
    (watched ? '<span class="chip chip--gold">ASSISTIDO</span>' : "") +
    "</div>" +
    '<p class="movie-info__tagline">' +
    movie.tagline +
    "</p>" +
    '<p class="movie-info__blurb">' +
    movie.blurb +
    "</p>" +
    '<div class="session-board">' +
    boardItem("DATA", movie.date) +
    boardItem("HORÁRIO", movie.time) +
    boardItem("SALA", movie.room) +
    boardItem("IDIOMA", movie.language) +
    boardItem("LOCAL", movie.place + " · " + GUESTS, true) +
    "</div>" +
    actions +
    "</div>" +
    "</div>" +
    "</div>" +
    "</main>" +
    siteFoot() +
    "</div>"
  );
}

/* ---------- cardápio ---------- */

function snackMarkup(snack) {
  const movie = movieOf(ui.movieId);
  const qty = movie.items[snack.id] || 0;
  const active = qty !== 0;
  const soldout = Boolean(snack.max && qty >= snack.max);
  const plusDisabled = qty === INF || Boolean(snack.max && qty >= snack.max);
  const minusDisabled = qty === 0;

  return (
    '<article class="snack snack--' +
    snack.accent +
    (active ? " is-active" : "") +
    (soldout ? " is-soldout" : "") +
    '" data-snack="' +
    snack.id +
    '">' +
    '<div class="snack__icon">' +
    icon(snack.icon, "") +
    "</div>" +
    '<div class="snack__text">' +
    '<div class="snack__title-row"><h3 class="snack__title">' +
    snack.name +
    '</h3><span class="snack__stock">ESGOTADO</span></div>' +
    '<p class="snack__desc">' +
    snack.description +
    "</p>" +
    "</div>" +
    '<div class="snack__control">' +
    '<span class="snack__unit">' +
    snack.unit +
    "</span>" +
    '<div class="stepper" role="group" aria-label="Quantidade de ' +
    snack.name +
    '">' +
    '<button class="stepper__btn" type="button" data-counter="minus" aria-label="Diminuir ' +
    snack.name +
    '"' +
    (minusDisabled ? ' aria-disabled="true" disabled' : "") +
    ">−</button>" +
    '<span class="stepper__value' +
    (qty === INF ? " is-inf" : "") +
    '" data-value aria-live="polite">' +
    formatQty(qty) +
    "</span>" +
    '<button class="stepper__btn" type="button" data-counter="plus" aria-label="Adicionar ' +
    snack.name +
    '"' +
    (plusDisabled ? ' aria-disabled="true" disabled' : "") +
    ">+</button>" +
    "</div>" +
    "</div>" +
    "</article>"
  );
}

function orderBarMarkup() {
  const items = movieOf(ui.movieId).items;
  const count = countItems(items);
  const label = count.total === Infinity ? "∞" : formatQty(count.total);
  return (
    '<div class="order-bar" data-order-bar>' +
    '<div class="order-bar__info"><span>ACOMPANHAMENTOS</span><strong' +
    (count.total === Infinity ? ' class="is-inf"' : "") +
    ' data-order-total>' +
    label +
    "</strong></div>" +
    '<button class="btn btn--gold" type="button" data-action="open-review" aria-label="Revisar pedido"><span>REVISAR PEDIDO</span>' +
    icon("arrowRight") +
    "</button>" +
    "</div>"
  );
}

function menuView() {
  const id = ui.movieId;
  const movie = FILMS[id];
  return (
    '<div class="view view--movie">' +
    siteHead() +
    '<main class="page page--narrow">' +
    '<div class="flow-page">' +
    '<div class="flow-head">' +
    '<button class="back-link" type="button" data-action="back-details">' +
    icon("arrowLeft") +
    "DETALHES DA SESSÃO</button>" +
    '<div class="flow-film"><span class="flow-film__thumb"><img src="' +
    movie.poster +
    '" alt=""></span><span class="flow-film__text"><strong>' +
    movie.title +
    "</strong><small>" +
    movie.date +
    " · " +
    movie.time +
    " · SALA " +
    movie.room +
    "</small></span></div>" +
    "</div>" +
    '<div class="menu-head">' +
    '<span class="kicker kicker--gold">CARDÁPIO DA SESSÃO</span>' +
    '<h1>MONTE O <em>PEDIDO</em></h1>' +
    "<p>Escolha os acompanhamentos da sessão. Nada é cobrado, mas o apoio de braço tem apenas uma unidade — use com sabedoria.</p>" +
    '<span class="menu-hint">' +
    icon("plus") +
    "1 clique = 1 · segure para somar mais rápido</span>" +
    "</div>" +
    '<div class="menu-list">' +
    SNACKS.map(snackMarkup).join("") +
    "</div>" +
    orderBarMarkup() +
    "</div>" +
    "</main>" +
    siteFoot() +
    "</div>"
  );
}

/* ---------- revisão do pedido ---------- */

function receiptItemsMarkup(items) {
  const picked = selectedItems(items);
  if (!picked.length) {
    return '<li class="receipt__empty">Nenhum acompanhamento selecionado. Coragem — a sessão continua de pé.</li>';
  }
  return picked
    .map(function (item) {
      const snack = SNACKS.find(function (entry) {
        return entry.id === item.id;
      });
      return (
        '<li class="receipt__item"><span class="receipt__item-name">' +
        snack.name +
        '</span><span class="receipt__dots" aria-hidden="true"></span><span class="receipt__item-qty">× ' +
        formatQty(item.qty) +
        "</span></li>"
      );
    })
    .join("");
}

function reviewView() {
  const id = ui.movieId;
  const movie = FILMS[id];
  const data = movieOf(id);
  const count = countItems(data.items);
  const total = count.total === Infinity ? "∞" : formatQty(count.total);

  return (
    '<div class="view view--movie">' +
    siteHead() +
    '<main class="page page--narrow">' +
    '<div class="review-wrap">' +
    '<button class="back-link" type="button" data-action="back-menu">' +
    icon("arrowLeft") +
    "VOLTAR AO CARDÁPIO</button>" +
    '<div class="review-intro"><span class="kicker kicker--gold">PRÉVIA DO PEDIDO</span><h1 class="flow-title">CONFIRA O PEDIDO</h1><p class="muted">É exatamente isso que vai para o ingresso. Depois de emitir, fica salvo neste dispositivo.</p></div>' +
    '<div class="receipt">' +
    '<div class="receipt__head"><div class="receipt__brand"><strong>KRITIQUESTIONI</strong><span>CINEMA EDITION · PEDIDO 4.0.3</span></div><span class="receipt__stamp">PRÉVIA</span></div>' +
    '<div class="receipt__meta">' +
    receiptMeta("FILME", movie.title) +
    receiptMeta("SESSÃO", movie.date + " · " + movie.time) +
    receiptMeta("SALA", "SALA " + movie.room + " · " + movie.place) +
    receiptMeta("PARTICIPANTES", GUESTS) +
    "</div>" +
    '<ul class="receipt__items">' +
    receiptItemsMarkup(data.items) +
    "</ul>" +
    '<div class="receipt__total"><span>TOTAL DE ACOMPANHAMENTOS</span><strong>' +
    total +
    "</strong></div>" +
    '<p class="receipt__note">Confira os itens. O ingresso será emitido em seguida.</p>' +
    "</div>" +
    '<div class="review-actions">' +
    '<button class="btn btn--primary btn--xl" type="button" data-action="confirm-ticket">CONFIRMAR E EMITIR INGRESSO' +
    icon("ticket") +
    "</button>" +
    '<button class="btn btn--ghost" type="button" data-action="back-menu">' +
    icon("arrowLeft") +
    "VOLTAR E AJUSTAR</button>" +
    "</div>" +
    "</div>" +
    "</main>" +
    siteFoot() +
    "</div>"
  );
}

/* ---------- emissão ---------- */

function emittingView() {
  const movie = FILMS[ui.movieId];
  const data = movieOf(ui.movieId);
  const count = data && data.ticket ? countItems(data.ticket.items) : { total: 0 };
  const total = count.total === Infinity ? "∞" : formatQty(count.total);
  return (
    '<div class="view view--movie">' +
    siteHead() +
    '<main class="page page--narrow">' +
    '<div class="emit-scene">' +
    '<div class="emitter" aria-hidden="true">' +
    '<div class="emitter__body"><div class="emitter__brand"><span>KRITIQUESTIONI</span><strong>CINEMA</strong><span>SALA 04.0.3 · EMISSÃO</span></div><div class="emitter__slot"></div></div>' +
    '<div class="emitter__ticket"><div class="emitter__ticket-line"></div><div class="emitter__ticket-line emitter__ticket-line--short"></div></div>' +
    "</div>" +
    '<div class="emit-scene__text" role="status" aria-live="polite"><h1>EMITINDO O INGRESSO</h1><p>Um instante. A impressora está fazendo o seu melhor.<span class="emit-dots" aria-hidden="true"><span></span><span></span><span></span></span></p><p class="emit-scene__meta">' +
    movie.title.toUpperCase() +
    " · " +
    total +
    " ACOMPANHAMENTOS</p></div>" +
    "</div>" +
    "</main>" +
    "</div>"
  );
}

/* ---------- ingresso ---------- */

function ticketMetaItem(label, value) {
  return (
    '<div class="ticket__meta-item"><span>' +
    label +
    "</span><strong>" +
    value +
    "</strong></div>"
  );
}

function ticketSnacksMarkup(items) {
  const picked = selectedItems(items);
  if (!picked.length) {
    return '<li class="ticket__empty">Nenhum acompanhamento. Sessão raiz.</li>';
  }
  return picked
    .map(function (item) {
      const snack = SNACKS.find(function (entry) {
        return entry.id === item.id;
      });
      return (
        '<li class="ticket__snack"><span class="ticket__snack-name">' +
        snack.name +
        '</span><span class="ticket__snack-dots" aria-hidden="true"></span><span class="ticket__snack-qty">× ' +
        formatQty(item.qty) +
        "</span></li>"
      );
    })
    .join("");
}

function ticketView() {
  const id = ui.movieId;
  const movie = FILMS[id];
  const data = movieOf(id);
  const ticket = data.ticket;
  const count = countItems(ticket.items);
  const total = count.total === Infinity ? "∞" : formatQty(count.total);
  const qr = qrCells(ticket.serial);

  let actions = "";
  if (data.watched) {
    actions =
      '<button class="btn btn--gold" type="button" data-action="go-lobby">' +
      icon("arrowLeft") +
      "VOLTAR À PROGRAMAÇÃO</button>" +
      (allWatched()
        ? '<button class="btn btn--ghost" type="button" data-action="open-final">' +
          icon("check") +
          "VER FIM DE SESSÃO</button>"
        : "");
  } else {
    actions =
      '<button class="btn btn--primary btn--xl" type="button" data-action="open-watched-confirm">JÁ ASSISTIMOS!' +
      icon("check") +
      "</button>" +
      '<button class="btn btn--ghost" type="button" data-action="back-details">' +
      icon("arrowLeft") +
      "VOLTAR À SESSÃO</button>";
  }

  return (
    '<div class="view view--movie">' +
    siteHead() +
    '<main class="page page--narrow">' +
    '<div class="ticket-scene">' +
    '<div class="ticket-scene__head"><h1>INGRESSO DIGITAL</h1><button class="back-link" type="button" data-action="' +
    (data.watched ? "go-lobby" : "back-details") +
    '">' +
    icon("arrowLeft") +
    (data.watched ? "PROGRAMAÇÃO" : "VOLTAR À SESSÃO") +
    "</button></div>" +
    '<article class="ticket' +
    (ui.freshTicket ? " ticket--fresh" : "") +
    '" aria-label="Ingresso digital de ' +
    movie.title +
    '">' +
    '<div class="ticket__top">' +
    '<div class="ticket__brand"><img src="KritiquestionI.png" alt="KritiquestionI"><div class="ticket__brand-text"><strong>KRITIQUESTIONI CINEMA</strong><span>SESSÃO PARTICULAR · V4.0.3</span></div></div>' +
    '<div class="ticket__admit"><strong>ADMIT ONE</strong><span>DOIS, NA VERDADE</span></div>' +
    "</div>" +
    '<div class="ticket__main"><div class="ticket__film">' +
    '<div class="ticket__poster"><img src="' +
    movie.poster +
    '" alt="' +
    movie.posterAlt +
    '"></div>' +
    '<div class="ticket__details">' +
    '<span class="ticket__label">' +
    movie.sessionLabel.toUpperCase() +
    " · " +
    movie.language.toUpperCase() +
    "</span>" +
    '<h2 class="ticket__title">' +
    movie.title.toUpperCase() +
    "</h2>" +
    '<p class="ticket__for">Para <strong>Kauan</strong> &amp; <strong>Iasmin</strong> · dois assentos, zero chance de separar.</p>' +
    '<div class="ticket__meta">' +
    ticketMetaItem("DATA", movie.date) +
    ticketMetaItem("HORÁRIO", movie.time) +
    ticketMetaItem("SALA", movie.room) +
    ticketMetaItem("LOCAL", movie.place) +
    ticketMetaItem("IDIOMA", movie.language) +
    ticketMetaItem("ENTRADA", "2 PESSOAS") +
    "</div>" +
    "</div>" +
    "</div></div>" +
    '<div class="ticket__perf" aria-hidden="true"><span class="ticket__perf-line"></span></div>' +
    '<div class="ticket__snacks"><span class="ticket__label">ACOMPANHAMENTOS · ' +
    (count.total === Infinity ? "∞" : formatQty(count.total)) +
    " ITENS</span>" +
    '<ul class="ticket__snacks-list">' +
    ticketSnacksMarkup(ticket.items) +
    "</ul>" +
    "</div>" +
    '<div class="ticket__bottom">' +
    '<div class="ticket__code"><div class="ticket__barcode" aria-hidden="true"></div><span class="ticket__serial">' +
    ticket.serial +
    " · " +
    total +
    " ACOMPANHAMENTOS</span></div>" +
    '<div class="ticket__side"><div class="qr" style="--qr-size:9" aria-hidden="true">' +
    qr.map(function (cell) {
      return '<span class="' + (cell ? "on" : "") + '"></span>';
    }).join("") +
    '</div><div class="ticket__stamp">VÁLIDO<br>UMA VEZ</div></div>' +
    "</div>" +
    "</article>" +
    '<div class="ticket-actions">' +
    actions +
    "</div>" +
    '<p class="ticket-note">Ingresso salvo neste dispositivo. Pode fechar a página — ele continua por aqui.</p>' +
    "</div>" +
    "</main>" +
    siteFoot() +
    "</div>"
  );
}

/* ---------- avaliação ---------- */

function ratingStarButtons(person) {
  const draft = ui.ratingDrafts[person] || 0;
  const who = person === "i" ? "Iasmin" : "Kauan";
  let markup = "";
  for (let index = 1; index <= 5; index += 1) {
    const stateName = starState(index, draft);
    const label =
      index === 1 ? "1 estrela" : index + " estrelas";
    markup +=
      '<button class="star-btn' +
      (stateName !== "empty" ? " is-picked" : "") +
      '" type="button" data-action="pick-star" data-person="' +
      person +
      '" data-star="' +
      index +
      '" aria-label="Dar ' +
      label +
      " para " +
      who +
      '" aria-pressed="' +
      (draft === index || draft === index - 0.5 ? "true" : "false") +
      '">' +
      starSvg(stateName) +
      "</button>";
  }
  return markup;
}

function ratingPersonBlock(person) {
  const draft = ui.ratingDrafts[person.key] || 0;
  const caption = draft > 0 ? RATING_CAPTIONS[draft] || RATING_CAPTIONS[0] : "";
  return (
    '<div class="rating-person" data-rater="' +
    person.key +
    '">' +
    '<div class="rating-person__head">' +
    '<span class="rating-person__badge">' +
    person.label +
    "</span>" +
    '<span class="rating-person__who"><strong>' +
    person.name +
    "</strong><small>NOTA INDIVIDUAL</small></span>" +
    '<span class="rating-person__score' +
    (draft === 0 ? " is-empty" : "") +
    '" aria-live="polite"><strong>' +
    formatRating(draft) +
    "</strong><span>/5</span></span>" +
    "</div>" +
    '<div class="rating-input" role="group" aria-label="Nota de ' +
    person.name +
    ', de zero vírgula cinco a cinco estrelas">' +
    ratingStarButtons(person.key) +
    "</div>" +
    '<p class="rating-caption' +
    (draft > 0 ? " is-fun" : "") +
    '">' +
    caption +
    "</p>" +
    "</div>"
  );
}

function ratingView() {
  const id = ui.movieId;
  const movie = FILMS[id];
  const ready = ui.ratingDrafts.i > 0 && ui.ratingDrafts.k > 0;

  return (
    '<div class="view view--movie">' +
    siteHead() +
    '<main class="page page--narrow">' +
    '<div class="rate-scene">' +
    '<button class="back-link" type="button" data-action="back-ticket">' +
    icon("arrowLeft") +
    "VOLTAR AO INGRESSO</button>" +
    '<div class="rate-card">' +
    '<div class="rate-head">' +
    '<div class="rate-poster"><img src="' +
    movie.poster +
    '" alt="' +
    movie.posterAlt +
    '"></div>' +
    '<div class="rate-head__text"><span class="kicker kicker--gold">AVALIAÇÃO OBRIGATÓRIA</span><h1>' +
    movie.title.toUpperCase() +
    "</h1><p>" +
    movie.sessionLabel +
    " · " +
    movie.date +
    " · " +
    movie.time +
    "</p></div>" +
    "</div>" +
    '<p class="rate-copy">A sessão acabou, mas o veredito é nosso. Cada um escolhe a sua nota, de meia em meia estrela. As duas notas são obrigatórias para encerrar o filme' +
    (id === "clayface" ? " e liberar Verity." : " e fechar a sessão dupla.") +
    "</p>" +
    '<div class="rating-block">' +
    '<div class="rating-people">' +
    PEOPLE.map(ratingPersonBlock).join("") +
    "</div>" +
    '<div class="rating-scale"><span>0,5</span><span>CADA NOTA · ESTRELAS</span><span>5,0</span></div>' +
    "</div>" +
    '<div class="rate-actions">' +
    '<button class="btn btn--gold btn--xl" type="button" data-action="confirm-rating"' +
    (ready ? "" : ' aria-disabled="true" disabled') +
    ">CONFIRMAR AS DUAS NOTAS" +
    icon("check") +
    "</button>" +
    '<button class="btn btn--ghost" type="button" data-action="back-ticket">' +
    icon("arrowLeft") +
    "VOLTAR AO INGRESSO</button>" +
    "</div>" +
    '<p class="rate-foot">Uma vez confirmadas, as duas notas ficam salvas neste dispositivo. Sem edição retroativa, como todo bom crítico.</p>' +
    "</div>" +
    "</div>" +
    "</main>" +
    siteFoot() +
    "</div>"
  );
}

/* ---------- tela final ---------- */

function finalFilmCard(id) {
  const movie = FILMS[id];
  const data = movieOf(id);
  return (
    '<article class="final-film">' +
    '<div class="final-film__poster"><img src="' +
    movie.poster +
    '" alt="' +
    movie.posterAlt +
    '"><div class="stamp stamp--watched">ASSISTIDO</div></div>' +
    '<div class="final-film__body">' +
    "<h2>" +
    movie.title.toUpperCase() +
    "</h2>" +
    '<span class="chip chip--gold">' +
    movie.sessionLabel.toUpperCase() +
    " · SALA " +
    movie.room +
    "</span>" +
    '<div class="final-film__rating">' +
    ratingPairMarkup(data.ratings, "final") +
    "</div>" +
    (data.ticketIssued
      ? '<button class="btn btn--ghost" type="button" data-action="open-ticket" data-movie="' +
        id +
        '">' +
        icon("ticket") +
        "VER INGRESSO</button>"
      : "") +
    "</div>" +
    "</article>"
  );
}

function bonusEntryMarkup() {
  if (!surpriseUnlocked()) return "";
  const stage = state.surprise.stage;
  const label =
    stage === 0
      ? "ACESSAR INGRESSO BÔNUS"
      : stage === 2
        ? "CONTINUAR SURPRESA"
        : stage === 3
          ? "REVER INGRESSO BÔNUS"
          : "RETOMAR INGRESSO BÔNUS";
  return (
    '<section class="bonus-entry" aria-label="Ingresso bônus">' +
    '<div class="bonus-entry__ticket">' +
    '<div class="bonus-entry__main">' +
    '<span class="bonus-entry__eyebrow">INGRESSO NÃO CATALOGADO · SESSÃO EXTRA</span>' +
    '<strong class="bonus-entry__title">SESSÃO <em>BÔNUS</em></strong>' +
    '<span class="bonus-entry__sub">Tem um ingresso aqui que não deveria existir. A máquina jura que não foi ela.</span>' +
    "</div>" +
    '<div class="bonus-entry__stub">' +
    '<span class="bonus-entry__badge">BÔNUS</span>' +
    '<button class="btn btn--gold btn--sm" type="button" data-action="open-surprise">' +
    label +
    icon("ticket") +
    "</button>" +
    "</div>" +
    "</div>" +
    "</section>"
  );
}

function finalView() {
  const average = averageRating();
  const averageLabel = average === null ? "—" : formatRating(average);
  return (
    '<div class="view view--final">' +
    siteHead() +
    '<main class="page">' +
    '<section class="final-hero"><div class="final-hero__frame">' +
    '<span class="kicker">SESSÃO DUPLA · CENTRAL PLAZA</span>' +
    '<h1 class="final-title">FIM DE<em>SESSÃO.</em></h1>' +
    '<p class="final-hero__sub">Duas sessões, dois ingressos e um histórico que já merece pôster. A luz acendeu — podem aplaudir.</p>' +
    "</div></section>" +
    '<section class="final-profile"><div class="final-profile__top">' +
    '<div class="final-profile__names"><span>PERFIL CINEMATOGRÁFICO</span><strong>Kauan &amp; Iasmin</strong></div>' +
    '<span class="final-profile__tag">' +
    icon("clapper") +
    "SESSÃO DUPLA · 2026</span>" +
    "</div>" +
    '<div class="final-stats">' +
    '<div class="final-stat"><span>DATA</span><strong>01/11/2026</strong></div>' +
    '<div class="final-stat"><span>LOCAL</span><strong>Central Plaza</strong></div>' +
    '<div class="final-stat"><span>FILMES</span><strong class="is-gold">2/2</strong></div>' +
    '<div class="final-stat"><span>NOTA MÉDIA</span><strong class="is-gold">' +
    averageLabel +
    "/5</strong></div>" +
    "</div></section>" +
    '<section class="final-films" aria-label="Filmes assistidos">' +
    finalFilmCard("clayface") +
    finalFilmCard("verity") +
    "</section>" +
    '<section class="final-message">' +
    '<p class="final-message__quote">Duas sessões, um corredor de cinema e a certeza de que <em>a pipoca acabou antes do filme</em> (Se tivesse uma).</p>' +
    "<p>Fim da programação por hoje. Agora é oficial: nós sobrevivemos a dois filmes, dois ingressos e à pergunta “vai dar tempo?”. O próximo encontro já está em cartaz.</p>" +
    "</section>" +
    bonusEntryMarkup() +
    '<div class="final-actions">' +
    '<button class="btn btn--primary" type="button" data-action="go-lobby">' +
    icon("arrowLeft") +
    "REVER PROGRAMAÇÃO</button>" +
    '<button class="btn btn--ghost" type="button" data-action="reset-ask">' +
    icon("reset") +
    "REINICIAR SESSÃO</button>" +
    "</div>" +
    "</main>" +
    siteFoot() +
    "</div>"
  );
}

/* ---------- surpresa ---------- */

function surpriseView() {
  if (ui.surprisePrinting) return bonusPrintingView();
  const stage = ui.surpriseStage || state.surprise.stage || 1;
  if (stage === 2) return surpriseBreakView();
  if (stage === 3) return surpriseRewardView();
  return bonusTicketView();
}

function bonusPrintingView() {
  return (
    '<div class="view view--surprise">' +
    siteHead() +
    '<main class="page page--narrow">' +
    '<div class="emit-scene emit-scene--bonus">' +
    '<div class="emitter emitter--bonus" aria-hidden="true">' +
    '<div class="emitter__body"><div class="emitter__brand"><span>KRITIQUESTIONI</span><strong>BÔNUS</strong><span>SESSÃO EXTRA · NÃO CATALOGADA</span></div><div class="emitter__slot"></div></div>' +
    '<div class="emitter__ticket"><div class="emitter__ticket-line"></div><div class="emitter__ticket-line emitter__ticket-line--short"></div></div>' +
    "</div>" +
    '<div class="emit-scene__text" role="status" aria-live="polite"><h1>EMITINDO INGRESSO BÔNUS</h1><p>A máquina está imprimindo algo que não estava na programação.<span class="emit-dots" aria-hidden="true"><span></span><span></span><span></span></span></p></div>' +
    "</div>" +
    "</main>" +
    "</div>"
  );
}

function bonusTicketView() {
  return (
    '<div class="view view--surprise">' +
    siteHead() +
    '<main class="page page--narrow">' +
    '<div class="bonus-scene">' +
    '<button class="back-link" type="button" data-action="open-final">' +
    icon("arrowLeft") +
    "VOLTAR AO FIM DE SESSÃO</button>" +
    '<article class="bonus-ticket' +
    (ui.surpriseGlitch ? " is-glitching" : "") +
    '" aria-label="Ingresso bônus">' +
    '<div class="bonus-ticket__top">' +
    '<div class="bonus-ticket__brand"><img src="KritiquestionI.png" alt="KritiquestionI"><div><strong>KRITIQUESTIONI CINEMA</strong><span>INGRESSO NÃO CATALOGADO</span></div></div>' +
    '<span class="bonus-ticket__serial">SESSÃO EXTRA · 04.0.3-B</span>' +
    "</div>" +
    '<div class="bonus-ticket__body">' +
    '<span class="bonus-ticket__kicker">BÔNUS EXCLUSIVO · EMISSÃO NÃO AUTORIZADA</span>' +
    '<h1 class="bonus-ticket__title">PARABÉNS, <em>IASMIN!</em></h1>' +
    '<p class="bonus-ticket__copy">Por ter sobrevivido a dois filmes seguidos, você desbloqueou um bônus exclusivo e totalmente gratuito:</p>' +
    '<p class="bonus-ticket__prize">O direito de sair comigo novamente.</p>' +
    '<p class="bonus-ticket__copy bonus-ticket__copy--small">Um privilégio raro. Uma honra imensurável. Você pode agradecer depois.</p>' +
    "</div>" +
    '<div class="bonus-ticket__perf" aria-hidden="true"></div>' +
    '<div class="bonus-ticket__bottom">' +
    '<div class="bonus-ticket__stamp">BÔNUS<br>APROVADO</div>' +
    '<div class="bonus-ticket__meta"><span>SESSÃO EXTRA · 04.0.3-B</span><span>VÁLIDO PARA UMA NOVA SESSÃO</span></div>' +
    "</div>" +
    "</article>" +
    '<div class="bonus-actions">' +
    '<button class="btn btn--primary btn--xl" type="button" data-action="accept-bonus">ACEITAR ESSA HONRA' +
    icon("check") +
    "</button>" +
    "</div>" +
    '<p class="bonus-note">Sem letras miúdas. A máquina só não sabia que estava imprimindo isso.</p>' +
    "</div>" +
    "</main>" +
    "</div>"
  );
}

function surpriseBreakView() {
  return (
    '<div class="view view--surprise">' +
    '<main class="surprise-stage surprise-stage--break">' +
    '<button class="back-link surprise-back" type="button" data-action="open-final">' +
    icon("arrowLeft") +
    "VOLTAR AO FIM DE SESSÃO</button>" +
    '<div class="surprise-break__content">' +
    '<span class="surprise-break__icon">' +
    icon("ticket", "") +
    "</span>" +
    "<h1>Brincadeiras à parte...</h1>" +
    "<p>Acho que ainda tem uma coisinha pra você.</p>" +
    '<button class="btn btn--gold btn--xl" type="button" data-action="continue-surprise">CONTINUAR' +
    icon("arrowRight") +
    "</button>" +
    "</div>" +
    "</main>" +
    "</div>"
  );
}

function surpriseRewardView() {
  return (
    '<div class="view view--surprise">' +
    '<main class="surprise-stage surprise-stage--reward">' +
    '<button class="back-link surprise-back" type="button" data-action="open-final">' +
    icon("arrowLeft") +
    "VOLTAR AO FIM DE SESSÃO</button>" +
    '<div class="special-reward">' +
    '<span class="special-reward__kicker">SPECIAL REWARD</span>' +
    '<span class="special-reward__icon">' +
    icon("ticket", "") +
    "</span>" +
    '<p class="special-reward__phrase">This reward must be delivered personally.</p>' +
    "</div>" +
    "</main>" +
    "</div>"
  );
}

function openSurprise() {
  if (!surpriseUnlocked()) {
    showToast("A surpresa só aparece depois dos dois filmes e das quatro notas.", true);
    return;
  }
  stopPress();
  clearMovieUi();
  ui.view = "surprise";
  ui.modal = null;

  const saved = state.surprise.stage;
  if (!saved) {
    state.surprise.stage = 1;
    state.surprise.startedAt = Date.now();
    state.surprise.updatedAt = Date.now();
    saveState();
    ui.surpriseStage = 1;
    ui.surprisePrinting = true;
    ui.surpriseGlitch = false;
    render();
    announce("Ingresso bônus em impressão.");
    window.clearTimeout(surpriseTimer);
    surpriseTimer = window.setTimeout(function () {
      surpriseTimer = null;
      if (ui.view === "surprise" && ui.surpriseStage === 1) {
        ui.surprisePrinting = false;
        render();
        announce("Ingresso bônus emitido.");
      }
    }, 2000);
    return;
  }

  ui.surpriseStage = saved;
  ui.surprisePrinting = false;
  ui.surpriseGlitch = false;
  render();
  announce(
    saved === 2
      ? "Surpresa retomada."
      : saved === 3
        ? "Recompensa especial."
        : "Ingresso bônus."
  );
}

function acceptBonus() {
  if (ui.view !== "surprise" || ui.surpriseStage !== 1 || ui.surprisePrinting) return;
  ui.surpriseGlitch = true;
  render({ scroll: false });
  window.clearTimeout(surpriseTimer);
  surpriseTimer = window.setTimeout(function () {
    surpriseTimer = null;
    withBlackout("SISTEMA INSTÁVEL", function () {
      state.surprise.stage = 2;
      state.surprise.updatedAt = Date.now();
      saveState();
      ui.surpriseStage = 2;
      ui.surpriseGlitch = false;
      ui.surprisePrinting = false;
      ui.view = "surprise";
      render();
      announce("Brincadeiras à parte. Ainda tem uma coisinha.");
    });
  }, 620);
}

function continueSurprise() {
  if (ui.view !== "surprise" || ui.surpriseStage !== 2) return;
  state.surprise.stage = 3;
  state.surprise.updatedAt = Date.now();
  saveState();
  ui.surpriseStage = 3;
  ui.surpriseGlitch = false;
  ui.surprisePrinting = false;
  render();
  announce("Recompensa especial.");
}

/* ---------- modal ---------- */

function modalFilmMini(id) {
  const movie = FILMS[id];
  const data = movieOf(id);
  return (
    '<div class="modal__film-mini"><img src="' +
    movie.poster +
    '" alt=""><div><strong>' +
    movie.title +
    "</strong><span>" +
    movie.sessionLabel +
    " · " +
    movie.date +
    " · " +
    movie.time +
    " · SALA " +
    movie.room +
    (hasBothRatings(id)
      ? " · I " +
        formatRating(data.ratings.i) +
        " · K " +
        formatRating(data.ratings.k)
      : "") +
    "</span></div></div>"
  );
}

function modalView() {
  const modal = ui.modal;
  if (!modal) return "";
  let heading = "";
  let copy = "";
  let body = "";
  let actions = "";

  if (modal.type === "reset") {
    heading = "REINICIAR A SESSÃO?";
    copy = "Isso apaga pedidos, ingressos e notas salvos neste dispositivo. Não tem como desfazer.";
    body =
      '<div class="modal__warn">' +
      icon("warning") +
      "<span>O progresso das duas sessões será perdido. A programação volta ao início.</span></div>";
    actions =
      '<button class="btn btn--danger" type="button" data-action="reset-confirm">' +
      icon("reset") +
      "SIM, APAGAR TUDO</button>" +
      '<button class="btn btn--ghost" type="button" data-action="close-modal">DEIXAR COMO ESTÁ</button>';
  } else if (modal.type === "confirmWatched") {
    const movie = FILMS[ui.movieId];
    heading = "ENCERRAR A SESSÃO?";
    copy = "Nós dois vamos avaliar " + movie.title + " agora. As duas notas são obrigatórias para concluir o filme.";
    body = modalFilmMini(ui.movieId);
    actions =
      '<button class="btn btn--primary" type="button" data-action="begin-rating">' +
      icon("check") +
      "CONFIRMAR, JÁ ASSISTIMOS</button>" +
      '<button class="btn btn--ghost" type="button" data-action="close-modal">AINDA NÃO</button>';
  } else if (modal.type === "rated") {
    const movie = FILMS[modal.movieId];
    const data = movieOf(modal.movieId);
    heading = "SESSÃO ENCERRADA.";
    copy =
      modal.movieId === "clayface"
        ? "Cara de Barro entrou para o histórico e Verity já está liberado na programação."
        : "Verity entrou para o histórico. A sessão dupla chegou ao fim.";
    body =
      '<div class="modal__rating">' +
      ratingPairMarkup(data.ratings, "modal") +
      "</div>" +
      modalFilmMini(modal.movieId);
    actions =
      modal.movieId === "clayface"
        ? '<button class="btn btn--gold" type="button" data-action="open-film" data-movie="verity">' +
          icon("arrowRight") +
          "VER VERITY AGORA</button>" +
          '<button class="btn btn--ghost" type="button" data-action="close-modal">VOLTAR À PROGRAMAÇÃO</button>'
        : '<button class="btn btn--gold" type="button" data-action="open-final">' +
          icon("check") +
          "VER FIM DE SESSÃO</button>" +
          '<button class="btn btn--ghost" type="button" data-action="close-modal">VOLTAR À PROGRAMAÇÃO</button>';
  }

  return (
    '<div class="modal-shell">' +
    '<div class="modal-backdrop" data-action="close-modal"></div>' +
    '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
    '<button class="modal__close" type="button" data-action="close-modal" aria-label="Fechar">×</button>' +
    '<div class="modal__head">' +
    '<span class="modal__icon">' +
    icon(modal.type === "reset" ? "warning" : "check", "") +
    "</span>" +
    '<h2 id="modal-title">' +
    heading +
    "</h2><p>" +
    copy +
    "</p></div>" +
    '<div class="modal__body">' +
    body +
    "</div>" +
    '<div class="modal__actions">' +
    actions +
    "</div>" +
    "</div>" +
    "</div>"
  );
}

/* ---------- render ---------- */

function currentViewMarkup() {
  if (ui.view === "intro") return introView();
  if (ui.view === "surprise") {
    if (!surpriseUnlocked()) return lobbyView();
    return surpriseView();
  }
  if (ui.view === "final") {
    if (!allWatched()) return lobbyView();
    return finalView();
  }
  if (ui.view === "movie" && ui.movieId) {
    const data = movieOf(ui.movieId);
    if (!data.unlocked && !data.watched) return lobbyView();
    if (ui.stage === "menu") return menuView();
    if (ui.stage === "review") return reviewView();
    if (ui.stage === "emitting") return emittingView();
    if (ui.stage === "ticket") return data.ticket ? ticketView() : detailsView();
    if (ui.stage === "rate" && !data.watched) return ratingView();
    return detailsView();
  }
  return lobbyView();
}

function render(options) {
  const shouldScroll = !options || options.scroll !== false;
  const app = document.getElementById("app");
  if (!app) return;
  app.innerHTML = starDefs() + currentViewMarkup() + (ui.modal ? modalView() : "");
  syncBodyLock();

  if (shouldScroll) scrollTop();

  if (ui.modal) {
    window.setTimeout(function () {
      const close = document.querySelector(".modal__close");
      if (close) close.focus();
    }, 30);
  }
}

/* ---------- navegação ---------- */

function clearMovieUi() {
  window.clearTimeout(surpriseTimer);
  surpriseTimer = null;
  ui.movieId = null;
  ui.stage = null;
  ui.ratingDrafts = { i: 0, k: 0 };
  ui.freshTicket = false;
  ui.surpriseStage = 0;
  ui.surprisePrinting = false;
  ui.surpriseGlitch = false;
}

function goIntro() {
  stopPress();
  ui.view = "intro";
  clearMovieUi();
  ui.modal = null;
  render();
}

function goLobby() {
  stopPress();
  ui.view = "lobby";
  clearMovieUi();
  ui.modal = null;
  render();
}

function openFilm(id) {
  const data = movieOf(id);
  if (!data || (!data.unlocked && !data.watched)) {
    showToast("Verity libera depois da avaliação de Cara de Barro.", true);
    const card = document.querySelector('[data-card="' + id + '"]');
    if (card) {
      card.classList.remove("is-shaking");
      void card.offsetWidth;
      card.classList.add("is-shaking");
      window.setTimeout(function () {
        card.classList.remove("is-shaking");
      }, 500);
    }
    return;
  }
  stopPress();
  ui.view = "movie";
  ui.movieId = id;
  ui.stage = "details";
  ui.ratingDrafts = { i: 0, k: 0 };
  ui.freshTicket = false;
  ui.modal = null;
  render();
}

function startSession() {
  if (allWatched()) {
    openFinal();
    return;
  }
  const returning = hasProgress();
  state.started = true;
  saveState();
  ui.view = "lobby";
  clearMovieUi();
  ui.modal = null;
  withBlackout(returning ? "VOLTANDO À SESSÃO" : "APAGANDO AS LUZES", function () {
    render();
    announce("Programação aberta. Cara de Barro é a primeira sessão.");
  });
}

function openFinal() {
  if (!allWatched()) {
    showToast("A sessão dupla ainda não terminou.", true);
    return;
  }
  stopPress();
  ui.view = "final";
  clearMovieUi();
  ui.modal = null;
  render();
}

function openMenu() {
  const data = movieOf(ui.movieId);
  if (!data || data.watched || data.ticketIssued) {
    ui.stage = "details";
    render();
    return;
  }
  ui.stage = "menu";
  ui.modal = null;
  render();
}

function backDetails() {
  stopPress();
  ui.stage = "details";
  ui.modal = null;
  ui.freshTicket = false;
  render();
}

function backMenu() {
  const data = movieOf(ui.movieId);
  if (!data || data.watched || data.ticketIssued) {
    ui.stage = "details";
  } else {
    ui.stage = "menu";
  }
  ui.modal = null;
  render();
}

function openReview() {
  const data = movieOf(ui.movieId);
  if (!data || data.watched || data.ticketIssued) {
    ui.stage = "details";
    render();
    return;
  }
  ui.stage = "review";
  ui.modal = null;
  render();
}

function openTicket(id) {
  const target = id || ui.movieId;
  const data = movieOf(target);
  if (!data || !data.ticket) {
    showToast("Nenhum ingresso emitido para esta sessão ainda.", true);
    return;
  }
  stopPress();
  ui.view = "movie";
  ui.movieId = target;
  ui.stage = "ticket";
  ui.ratingDrafts = { i: 0, k: 0 };
  ui.freshTicket = false;
  ui.modal = null;
  render();
  announce("Ingresso digital de " + FILMS[target].title + ".");
}

function openWatchedConfirm() {
  const data = movieOf(ui.movieId);
  if (!data || !data.ticket) {
    showToast("Emita o ingresso antes de encerrar a sessão.", true);
    return;
  }
  if (data.watched) {
    showToast("Esta sessão já foi avaliada.", true);
    return;
  }
  ui.modal = { type: "confirmWatched" };
  render({ scroll: false });
}

function beginRating() {
  const data = movieOf(ui.movieId);
  if (!data || !data.ticket) {
    showToast("Emita o ingresso antes de avaliar.", true);
    return;
  }
  if (data.watched) {
    showToast("Esta sessão já foi avaliada.", true);
    return;
  }
  ui.modal = null;
  ui.stage = "rate";
  ui.ratingDrafts = { i: 0, k: 0 };
  render();
  announce("Avaliação aberta. Cada um escolhe a sua nota, de meia em meia estrela.");
}

function pickStar(person, star) {
  const data = movieOf(ui.movieId);
  if (!data || ui.stage !== "rate" || data.watched) return;
  if (person !== "i" && person !== "k") return;
  if (!Number.isFinite(star) || star < 1 || star > 5) return;
  const current = ui.ratingDrafts[person] || 0;
  ui.ratingDrafts[person] = current === star ? star - 0.5 : star;
  render({ scroll: false });
  announce(
    (person === "i" ? "Iasmin" : "Kauan") +
      ": nota " +
      formatRating(ui.ratingDrafts[person]) +
      " de 5 estrelas."
  );
}

function confirmRating() {
  const id = ui.movieId;
  const data = movieOf(id);
  if (!data || ui.stage !== "rate" || data.watched) return;
  if (!ui.ratingDrafts.i || !ui.ratingDrafts.k) {
    showToast("As duas notas precisam ser escolhidas antes de confirmar.", true);
    return;
  }

  data.ratings = {
    i: ui.ratingDrafts.i,
    k: ui.ratingDrafts.k,
  };
  data.watched = true;
  data.ratedAt = Date.now();
  if (id === "clayface") {
    state.movies.verity.unlocked = true;
  }
  ui.ratingDrafts = { i: 0, k: 0 };
  saveState();

  if (id === "clayface") {
    ui.view = "lobby";
    clearMovieUi();
    ui.modal = { type: "rated", movieId: "clayface" };
    render();
    announce(
      "Cara de Barro assistido. Iasmin " +
        formatRating(data.ratings.i) +
        ", Kauan " +
        formatRating(data.ratings.k) +
        ". Verity liberado."
    );
    showToast(
      "Cara de Barro: I " +
        formatRating(data.ratings.i) +
        " · K " +
        formatRating(data.ratings.k) +
        ". Verity liberado!"
    );
  } else {
    ui.modal = null;
    withBlackout("FIM DE SESSÃO", function () {
      ui.view = "final";
      clearMovieUi();
      render();
      announce("Fim de sessão. Os dois filmes foram assistidos e avaliados.");
    });
  }
}

function confirmTicket() {
  stopPress();
  const data = movieOf(ui.movieId);
  if (!data) return;
  if (data.ticketIssued && data.ticket) {
    openTicket(ui.movieId);
    return;
  }

  const items = selectedItems(data.items).map(function (item) {
    return { id: item.id, qty: item.qty };
  });

  data.ticket = {
    issuedAt: Date.now(),
    serial: makeSerial(ui.movieId),
    items,
  };
  data.ticketIssued = true;
  ui.freshTicket = false;
  ui.modal = null;
  ui.stage = "emitting";
  saveState();
  render();
  announce(
    "Emitindo o ingresso com " +
      (items.length ? items.length + " acompanhamentos diferentes." : "nenhum acompanhamento.")
  );

  const id = ui.movieId;
  window.clearTimeout(emissionTimer);
  emissionTimer = window.setTimeout(function () {
    emissionTimer = null;
    if (ui.view === "movie" && ui.movieId === id && ui.stage === "emitting") {
      ui.stage = "ticket";
      ui.freshTicket = true;
      render();
      announce("Ingresso emitido. " + FILMS[id].title + ".");
    }
  }, 2600);
}

function resetSession() {
  stopPress();
  window.clearTimeout(emissionTimer);
  window.clearTimeout(toastTimer);
  window.clearTimeout(surpriseTimer);
  emissionTimer = null;
  surpriseTimer = null;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    /* sem acesso ao armazenamento: ainda reinicia em memória */
  }
  state = defaultState();
  ui = {
    view: "intro",
    movieId: null,
    stage: null,
    ratingDrafts: { i: 0, k: 0 },
    modal: null,
    freshTicket: false,
    surpriseStage: 0,
    surprisePrinting: false,
    surpriseGlitch: false,
  };
  withBlackout("APAGANDO AS LUZES", function () {
    render();
    showToast("Sessão reiniciada. A programação está aberta de novo.");
    announce("Sessão reiniciada.");
  });
}

function shakeLockedCard(id) {
  const card = document.querySelector('[data-card="' + id + '"]');
  if (!card) return;
  card.classList.remove("is-shaking");
  void card.offsetWidth;
  card.classList.add("is-shaking");
  window.setTimeout(function () {
    card.classList.remove("is-shaking");
  }, 500);
}

function lockedFilm(id) {
  showToast(
    id === "verity"
      ? "Verity abre após a avaliação de Cara de Barro."
      : "Este cartaz ainda não está disponível.",
    true
  );
  shakeLockedCard(id);
}

/* ---------- contadores com pressão ---------- */

function repeatStep(ticks) {
  if (ticks <= 4) return 1;
  if (ticks <= 9) return 5;
  if (ticks <= 14) return 25;
  return 100;
}

function changeQty(id, type, step) {
  if (ui.view !== "movie" || ui.stage !== "menu") return;
  const movie = movieOf(ui.movieId);
  if (!movie || movie.ticketIssued || movie.watched) return;
  const snack = SNACKS.find(function (entry) {
    return entry.id === id;
  });
  if (!snack) return;

  const current = movie.items[id] || 0;
  const amount = Math.max(1, step || 1);
  let next = current;

  if (type === "plus") {
    if (current === INF) return;
    if (snack.max && current >= snack.max) return;
    if (current >= 9999) {
      next = INF;
    } else {
      next = Math.min(9999, current + amount);
      if (snack.max) next = Math.min(snack.max, next);
    }
  } else if (type === "minus") {
    if (current === 0) return;
    if (current === INF) {
      next = 9999;
    } else {
      next = Math.max(0, current - amount);
    }
  } else {
    return;
  }

  if (next === 0) {
    delete movie.items[id];
  } else {
    movie.items[id] = next;
  }
  saveState();
  updateSnackDom(id);
  return next;
}

function updateSnackDom(id) {
  const movie = movieOf(ui.movieId);
  if (!movie) return;
  const snack = SNACKS.find(function (entry) {
    return entry.id === id;
  });
  const element = document.querySelector('.snack[data-snack="' + id + '"]');
  if (!snack || !element) return;

  const qty = movie.items[id] || 0;
  const value = element.querySelector("[data-value]");
  const plus = element.querySelector('[data-counter="plus"]');
  const minus = element.querySelector('[data-counter="minus"]');

  if (value) {
    value.textContent = formatQty(qty);
    value.classList.toggle("is-inf", qty === INF);
    value.classList.remove("is-bumped");
    void value.offsetWidth;
    value.classList.add("is-bumped");
  }

  element.classList.toggle("is-active", qty !== 0);
  const soldout = Boolean(snack.max && qty >= snack.max);
  element.classList.toggle("is-soldout", soldout);

  if (plus) {
    const disabled = qty === INF || Boolean(snack.max && qty >= snack.max);
    plus.disabled = disabled;
    plus.setAttribute("aria-disabled", disabled ? "true" : "false");
  }
  if (minus) {
    const disabled = qty === 0;
    minus.disabled = disabled;
    minus.setAttribute("aria-disabled", disabled ? "true" : "false");
  }

  updateOrderBarDom();

  if (press && press.id === id && press.type === "plus" && plus && plus.disabled) {
    stopPress();
  }
}

function updateOrderBarDom() {
  const movie = movieOf(ui.movieId);
  const bar = document.querySelector("[data-order-bar]");
  if (!movie || !bar) return;
  const count = countItems(movie.items);
  const total = bar.querySelector("[data-order-total]");
  if (!total) return;
  total.textContent = count.total === Infinity ? "∞" : formatQty(count.total);
  total.classList.toggle("is-inf", count.total === Infinity);
}

function stopPress() {
  if (!press) return;
  window.clearTimeout(press.delay);
  window.clearInterval(press.timer);
  if (press.button) press.button.classList.remove("is-pressing");
  press = null;
}

function startPress(button, id, type, event) {
  stopPress();
  press = {
    id,
    type,
    button,
    pointerId: event.pointerId,
    delay: null,
    timer: null,
    ticks: 0,
  };
  button.classList.add("is-pressing");
  try {
    button.setPointerCapture(event.pointerId);
  } catch (error) {
    /* alguns navegadores não suportam captura em botões */
  }

  changeQty(id, type, 1);
  if (!press) return;
  if (button.disabled) {
    stopPress();
    return;
  }
  press.delay = window.setTimeout(function () {
    if (!press) return;
    press.ticks = 0;
    press.timer = window.setInterval(function () {
      if (!press) return;
      if (press.button.disabled) {
        stopPress();
        return;
      }
      press.ticks += 1;
      changeQty(press.id, press.type, repeatStep(press.ticks));
      if (!press) return;
      if (press.button.disabled) stopPress();
    }, HOLD_TICK);
  }, HOLD_DELAY);
}

function releasePress(event) {
  if (!press) return;
  if (event && typeof event.pointerId === "number" && press.pointerId !== event.pointerId) {
    return;
  }
  stopPress();
}

/* ---------- eventos ---------- */

document.addEventListener("click", function (event) {
  const actionElement = event.target.closest("[data-action]");
  if (!actionElement) return;
  const action = actionElement.getAttribute("data-action");

  switch (action) {
    case "start":
      startSession();
      break;
    case "go-intro":
      goIntro();
      break;
    case "go-lobby":
      goLobby();
      break;
    case "open-final":
      openFinal();
      break;
    case "open-film":
      openFilm(actionElement.getAttribute("data-movie"));
      break;
    case "locked-film":
      lockedFilm(actionElement.getAttribute("data-movie"));
      break;
    case "open-menu":
      openMenu();
      break;
    case "back-details":
      backDetails();
      break;
    case "back-menu":
      backMenu();
      break;
    case "open-review":
      openReview();
      break;
    case "confirm-ticket":
      confirmTicket();
      break;
    case "open-ticket":
      openTicket(actionElement.getAttribute("data-movie"));
      break;
    case "open-watched-confirm":
      openWatchedConfirm();
      break;
    case "begin-rating":
      beginRating();
      break;
    case "pick-star":
      pickStar(
        actionElement.getAttribute("data-person"),
        Number(actionElement.getAttribute("data-star"))
      );
      break;
    case "confirm-rating":
      confirmRating();
      break;
    case "open-surprise":
      openSurprise();
      break;
    case "accept-bonus":
      acceptBonus();
      break;
    case "continue-surprise":
      continueSurprise();
      break;
    case "back-ticket":
      ui.stage = "ticket";
      ui.modal = null;
      render();
      break;
    case "reset-ask":
      ui.modal = { type: "reset" };
      render({ scroll: false });
      break;
    case "reset-confirm":
      resetSession();
      break;
    case "close-modal":
      ui.modal = null;
      render({ scroll: false });
      break;
    default:
      break;
  }
});

document.addEventListener("pointerdown", function (event) {
  const button = event.target.closest(".stepper__btn");
  if (!button) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;
  if (button.disabled || button.getAttribute("aria-disabled") === "true") return;
  if (ui.view !== "movie" || ui.stage !== "menu") return;
  const snackElement = button.closest("[data-snack]");
  if (!snackElement) return;
  event.preventDefault();
  startPress(button, snackElement.getAttribute("data-snack"), button.getAttribute("data-counter"), event);
}, { passive: false });

document.addEventListener("pointerup", releasePress);
document.addEventListener("pointercancel", releasePress);
document.addEventListener("lostpointercapture", releasePress);
window.addEventListener("blur", stopPress);

document.addEventListener("click", function (event) {
  const button = event.target.closest(".stepper__btn");
  if (!button || event.detail !== 0) return;
  if (button.disabled || button.getAttribute("aria-disabled") === "true") return;
  if (ui.view !== "movie" || ui.stage !== "menu") return;
  const snackElement = button.closest("[data-snack]");
  if (!snackElement) return;
  changeQty(
    snackElement.getAttribute("data-snack"),
    button.getAttribute("data-counter"),
    1
  );
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && ui.modal) {
    event.preventDefault();
    ui.modal = null;
    render({ scroll: false });
  }
});

/* ---------- boot ---------- */

function boot() {
  render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}


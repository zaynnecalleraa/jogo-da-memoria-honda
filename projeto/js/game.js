/* ============================================
   SEMANA DA SEGURANÇA — HONDA
   game.js — versão final corrigida
   
   RANKING: salva SOMENTE no Firebase
   GAME STATE: salva em localStorage (temporário,
   só pra navegar entre páginas)
   ============================================ */

// ============================================
// AUTO-SCALE
// ============================================
function autoScale() {
  const frame = document.querySelector('.frame');
  if (!frame) return;
  const scaleX = window.innerWidth / 440;
  const scaleY = window.innerHeight / 956;
  const scale = Math.min(scaleX, scaleY);
  frame.style.transform = 'scale(' + scale + ')';
  frame.style.transformOrigin = 'top center';
  const scaledHeight = 956 * scale;
  const offsetY = Math.max(0, (window.innerHeight - scaledHeight) / 2);
  frame.style.marginTop = offsetY + 'px';
}
window.addEventListener('load', autoScale);
window.addEventListener('resize', autoScale);
window.addEventListener('orientationchange', function() { setTimeout(autoScale, 100); });

// ============================================
// FIREBASE
// ============================================
var FIREBASE_CONFIG = {
  apiKey: "AIzaSyA8fippFB7fwOhLZJhhFNfoAD-ArXtCcyQ",
  authDomain: "jogo-memoria-ef8a3.firebaseapp.com",
  databaseURL: "https://jogo-memoria-ef8a3-default-rtdb.firebaseio.com",
  projectId: "jogo-memoria-ef8a3",
  storageBucket: "jogo-memoria-ef8a3.firebasestorage.app",
  messagingSenderId: "310984492114",
  appId: "1:310984492114:web:70055b5ec5e20e666b8b8b"
};

var db = null;
var firebaseReady = false;

function initFirebase() {
  try {
    if (typeof firebase !== 'undefined') {
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      db = firebase.database();
      firebaseReady = true;
      console.log('✅ Firebase conectado!');
    }
  } catch (e) {
    console.error('❌ Erro ao conectar Firebase:', e);
    firebaseReady = false;
  }
}

// Inicializa imediatamente
initFirebase();

// ============================================
// DADOS DOS 8 PARES
// ============================================
var PAIRS = [
  { id:1, sit:{ title:"Proteção no trabalho", desc:"Uso de equipamentos de segurança no ambiente laboral", icon:"🦺" }, sol:{ title:"Equipamento de segurança", desc:"Capacete, luvas e óculos de proteção", icon:"⛑️" }, quiz:{ q:"Qual é a principal função do EPI?", opts:["Aumentar a produtividade","Proteger o trabalhador de riscos","Substituir treinamento","Evitar fiscalização"], c:1, exp:"O EPI tem como função principal proteger o trabalhador contra riscos ocupacionais." } },

  { id:2, sit:{ title:"Proteção respiratória", desc:"Uso de máscara em ambientes com vapores", icon:"😷" }, sol:{ title:"Risco químico", desc:"Exposição a gases e produtos químicos", icon:"☁️" }, quiz:{ q:"Qual EPI é obrigatório para vapores químicos?", opts:["Capacete","Máscara respiratória adequada","Botina comum","Protetor auricular"], c:1, exp:"O respirador protege contra a inalação de vapores tóxicos." } },

  { id:3, sit:{ title:"Piso molhado", desc:"Superfície escorregadia", icon:"⚠️" }, sol:{ title:"Risco de queda", desc:"Possibilidade de escorregão", icon:"🚶‍♂️" }, quiz:{ q:"O colaborador pode interromper uma atividade quando:", opts:["Está cansado","Identifica risco à segurança","Quer sair mais cedo","Está sozinho"], c:1, exp:"Qualquer atividade deve ser interrompida ao identificar risco." } },

  { id:4, sit:{ title:"Pressa", desc:"Execução rápida sem atenção", icon:"🏃" }, sol:{ title:"Falha humana", desc:"Erros por falta de atenção", icon:"❌" }, quiz:{ q:"Trabalhar com pressa aumenta acidentes porque:", opts:["Melhora o foco","Reduz atenção e aumenta erros","Aumenta experiência","Evita riscos"], c:1, exp:"A pressa reduz a atenção e aumenta a chance de erro." } },

  { id:5, sit:{ title:"Transporte de carga", desc:"Uso de carrinho no trabalho", icon:"🛒" }, sol:{ title:"Movimento seguro", desc:"Forma correta de condução", icon:"👍" }, quiz:{ q:"Como movimentar um carrinho corretamente?", opts:["Puxando","Empurrando com controle e visão frontal","Correndo","De lado"], c:1, exp:"Empurrar com controle garante mais segurança e visão do trajeto." } },

  { id:6, sit:{ title:"Risco de corte", desc:"Peças com bordas afiadas", icon:"🔪" }, sol:{ title:"Proteção das mãos", desc:"Uso de luvas anticorte", icon:"🧤" }, quiz:{ q:"O principal risco ao manusear peças é:", opts:["Sujeira","Corte nas mãos","Calor","Barulho"], c:1, exp:"O contato com superfícies cortantes pode causar lesões graves." } },

  { id:7, sit:{ title:"Situação de risco", desc:"Alarme ou emergência no ambiente", icon:"🚨" }, sol:{ title:"Evacuação segura", desc:"Seguir rotas de fuga", icon:"🏃‍♂️" }, quiz:{ q:"Em caso de emergência, o que deve ser feito?", opts:["Ignorar","Continuar trabalhando","Seguir rota de fuga e procedimentos de segurança","Esperar alguém"], c:2, exp:"Seguir os procedimentos e rotas de fuga é essencial em emergências." } },

  { id:8, sit:{ title:"Fonte de energia", desc:"Painel elétrico ativo", icon:"⚡" }, sol:{ title:"Bloqueio de segurança", desc:"Uso de cadeado e sinalização", icon:"🔒" }, quiz:{ q:"O bloqueio de painel serve para:", opts:["Economizar energia","Evitar acidentes durante manutenção","Melhorar produção","Desligar luz"], c:1, exp:"O bloqueio evita acionamento acidental durante manutenção." } }
];

// ============================================
// GAME STATE — localStorage (só pra navegar entre páginas)
// ============================================
function getState() {
  try { return JSON.parse(localStorage.getItem('hondaGameState')) || {}; }
  catch(e) { return {}; }
}
function saveState(data) {
  var current = getState();
  var merged = Object.assign({}, current, data);
  localStorage.setItem('hondaGameState', JSON.stringify(merged));
}
function clearState() {
  localStorage.removeItem('hondaGameState');
}

// ============================================
// RANKING GERAL — SOMENTE Firebase
// ============================================
async function addToGeralRanking(name, score) {
  if (!firebaseReady) { console.error('Firebase não conectado!'); return; }
  var entry = { name: name, score: score, date: new Date().toLocaleDateString('pt-BR'), ts: Date.now() };
  try {
    await db.ref('rankingGeral').push(entry);
    console.log('✅ Ranking geral salvo:', name, score);
  } catch(e) {
    console.error('❌ Erro ao salvar ranking geral:', e);
  }
}

async function getGeralRanking() {
  if (!firebaseReady) { console.error('Firebase não conectado!'); return []; }
  try {
    var snap = await db.ref('rankingGeral').orderByChild('score').limitToLast(500).once('value');
    var arr = [];
    snap.forEach(function(c) { arr.push(c.val()); });
    arr.sort(function(a, b) { return b.score - a.score; });
    return arr;
  } catch(e) {
    console.error('❌ Erro ao buscar ranking geral:', e);
    return [];
  }
}

// ============================================
// RANKING DA SALA — SOMENTE Firebase
// ============================================
async function addToSalaRanking(code, name, score) {
  if (!firebaseReady) { console.error('Firebase não conectado!'); return []; }
  var entry = { name: name, score: score, ts: Date.now() };
  try {
    await db.ref('rankingSala/' + code).push(entry);
    console.log('✅ Ranking sala salvo:', code, name, score);
  } catch(e) {
    console.error('❌ Erro ao salvar ranking sala:', e);
  }
  return await getSalaRanking(code);
}

async function getSalaRanking(code) {
  if (!firebaseReady) { console.error('Firebase não conectado!'); return []; }
  try {
    var snap = await db.ref('rankingSala/' + code).orderByChild('score').limitToLast(500).once('value');
    var arr = [];
    snap.forEach(function(c) { arr.push(c.val()); });
    arr.sort(function(a, b) { return b.score - a.score; });
    return arr;
  } catch(e) {
    console.error('❌ Erro ao buscar ranking sala:', e);
    return [];
  }
}

// ============================================
// LIMPAR TUDO — apaga Firebase + localStorage
// Rode no console: limparTudo()
// ============================================
async function limparTudo() {
  if (firebaseReady) {
    try {
      await db.ref('rankingGeral').remove();
      await db.ref('rankingSala').remove();
      await db.ref('salas').remove();
      console.log('✅ Firebase limpo!');
    } catch(e) { console.error(e); }
  }
  var keys = Object.keys(localStorage);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].indexOf('honda') === 0) localStorage.removeItem(keys[i]);
  }
  console.log('✅ localStorage limpo!');
  alert('Dados apagados! Recarregue a página.');
}

// ============================================
// GESTÃO DE SALAS — Firebase realtime
// ============================================
async function criarSalaFirebase(code, config) {
  if (!firebaseReady) return;
  try {
    await db.ref('salas/' + code).set({
      nome: config.roomName || '',
      mode: config.mode || 'memory',
      timeTotal: config.timeTotal || 120,
      maxPlayers: config.maxPlayers || null,
      tvMode: config.tvMode || false,
      memorizeTime: config.memorizeTime || 0,
      started: false,
      createdAt: Date.now()
    });
  } catch(e) { console.error('Erro ao criar sala:', e); }
}

async function entrarSalaFirebase(code, playerName) {
  if (!firebaseReady) return false;
  try {
    var snap = await db.ref('salas/' + code).once('value');
    if (!snap.exists()) return false;
    var salaData = snap.val();

    var maxPlayers = salaData.maxPlayers || null;
    if (maxPlayers) {
      var jogSnap = await db.ref('salas/' + code + '/jogadores').once('value');
      var count = jogSnap.exists() ? Object.keys(jogSnap.val() || {}).length : 0;
      if (count >= maxPlayers) return 'lotada';
    }

    var ref = await db.ref('salas/' + code + '/jogadores').push({
      name: playerName, joinedAt: Date.now(), played: false, score: null
    });
    saveState({
      mode: salaData.mode || 'memory',
      timeLeft: salaData.timeTotal || 120,
      timeTotal: salaData.timeTotal || 120,
      tvMode: salaData.tvMode || false,
      memorizeTime: salaData.memorizeTime || 0,
      playerKey: ref.key
    });
    // sessionStorage is tab-isolated — prevents cross-tab key contamination
    sessionStorage.setItem('hondaCurrentPlayerKey', ref.key);
    sessionStorage.setItem('hondaCurrentPlayerName', playerName);
    return true;
  } catch(e) { console.error('Erro ao entrar:', e); return false; }
}

async function iniciarPartidaFirebase(code) {
  if (!firebaseReady) return;
  try { await db.ref('salas/' + code + '/started').set(true); } catch(e) { console.error(e); }
}

function escutarInicioPartida(code, callback) {
  if (!firebaseReady) { setTimeout(callback, 3000); return; }
  var ref = db.ref('salas/' + code + '/started');
  ref.on('value', function(snap) {
    if (snap.val() === true) { ref.off(); callback(); }
  });
}

async function setCurrentTVPlayer(code, playerName) {
  if (!firebaseReady) return;
  try { await db.ref('salas/' + code + '/currentPlayer').set(playerName); }
  catch(e) { console.error(e); }
}

async function markPlayerPlayed(code, playerKey, score) {
  if (!firebaseReady || !playerKey) return;
  try {
    await db.ref('salas/' + code + '/jogadores/' + playerKey).update({ played: true, score: score });
  } catch(e) { console.error(e); }
}

function escutarVezTV(code, playerName, callback) {
  if (!firebaseReady) return;
  var ref = db.ref('salas/' + code + '/currentPlayer');
  ref.on('value', function(snap) {
    if (snap.val() === playerName) { ref.off(); callback(); }
  });
}

// ============================================
// ROOM CODE
// ============================================
function generateCode() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var code = '';
  for (var i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ============================================
// CARD IMAGE MAPPING
// ============================================
function getCardImg(pairId, type) {
  var base = (pairId - 1) * 2;
  var num = type === 'sit' ? base + 1 : base + 2;
  return 'assets/cards/card-' + num + '.png';
}

// ============================================
// SHUFFLE — Fisher-Yates
// ============================================
function shuffleDeck(deck) {
  var arr = deck.slice();
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
  }
  return arr;
}

// ============================================
// TEMPO — dois inputs separados MM : SS
// Cada campo editável independentemente
// Máximo 10:00
// ============================================
function setupTimeInput(minEl, secEl) {
  if (!minEl || !secEl) return;

  function handleMin() {
    var v = minEl.value.replace(/\D/g, '');
    if (v === '') { minEl.value = ''; return; }
    var num = parseInt(v);
    if (num > 10) num = 10;
    if (num === 10 && parseInt(secEl.value || '0') > 0) secEl.value = '00';
    minEl.value = v.length >= 2 ? String(num).padStart(2, '0') : v;
    if (v.length >= 2) secEl.focus();
  }

  function handleSec() {
    var v = secEl.value.replace(/\D/g, '');
    if (v === '') { secEl.value = ''; return; }
    var num = parseInt(v);
    if (num > 59) num = 59;
    if (parseInt(minEl.value || '0') >= 10) num = 0;
    secEl.value = v.length >= 2 ? String(num).padStart(2, '0') : v;
  }

  minEl.addEventListener('input', handleMin);
  secEl.addEventListener('input', handleSec);
  minEl.addEventListener('blur', function() {
    if (!this.value) this.value = '00';
    else this.value = String(parseInt(this.value)).padStart(2, '0');
  });
  secEl.addEventListener('blur', function() {
    if (!this.value) this.value = '00';
    else this.value = String(parseInt(this.value)).padStart(2, '0');
  });
  minEl.addEventListener('focus', function() { this.select(); });
  secEl.addEventListener('focus', function() { this.select(); });
}

function parseTimeFields(minEl, secEl) {
  var min = parseInt(minEl ? minEl.value : '2') || 0;
  var sec = parseInt(secEl ? secEl.value : '0') || 0;
  if (min > 10) min = 10;
  if (min === 10) sec = 0;
  if (sec > 59) sec = 59;
  return Math.min(min * 60 + sec, 600);
}

// ============================================
// NAVIGATE
// ============================================
function goTo(page) { window.location.href = page; }

// ============================================
// TURN-BASED MULTIPLAYER — gameState no Firebase
// ============================================

// Normaliza array do Firebase (pode vir como {0:..., 1:...})
function toArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return Object.keys(val).sort(function(a,b){ return parseInt(a)-parseInt(b); }).map(function(k){ return val[k]; });
}

// Constrói o deck compartilhado (mesma ordem para todos os jogadores)
function buildSharedDeck() {
  var deck = [];
  PAIRS.forEach(function(p) {
    deck.push({ pairId: p.id, type: 'sit', img: getCardImg(p.id, 'sit') });
    deck.push({ pairId: p.id, type: 'sol', img: getCardImg(p.id, 'sol') });
  });
  return shuffleDeck(deck);
}

// Inicializa gameState no Firebase antes de começar a partida
async function initGameState(code, deck, turnOrder, playerNames, timerTotal) {
  if (!firebaseReady) return;
  var scores = {}, names = {}, matchedBy = {};
  turnOrder.forEach(function(k, i) {
    scores[k] = 0;
    names[k] = playerNames[i] || ('Jogador ' + (i + 1));
    matchedBy[k] = 0;
  });
  try {
    await db.ref('salas/' + code + '/gameState').set({
      phase: 'memorization',
      deck: deck,
      flippedCards: [],
      matchedCards: {},
      currentTurnKey: turnOrder[0],
      turnOrder: turnOrder,
      turnIndex: 0,
      scores: scores,
      playerNames: names,
      matchedBy: matchedBy,
      matchedCount: 0,
      memorizeStart: Date.now(),
      timerStart: 0,
      timerTotal: timerTotal,
      pendingQuiz: null
    });
  } catch(e) { console.error('initGameState error:', e); }
}

// Escuta gameState em tempo real
function listenGameState(code, cb) {
  if (!firebaseReady) return;
  db.ref('salas/' + code + '/gameState').on('value', function(snap) { cb(snap.val()); });
}

// Para de escutar gameState
function stopListeningGameState(code) {
  if (firebaseReady) db.ref('salas/' + code + '/gameState').off('value');
}

// Atualiza campos do gameState (suporta paths aninhados com '/')
async function gsUpdate(code, changes) {
  if (!firebaseReady) return;
  try {
    await db.ref('salas/' + code + '/gameState').update(changes);
  } catch(e) { console.error('gsUpdate error:', e); }
}

// ── Modo Simultâneo (cada jogador tem seu próprio board) ──────────────────────

// Cria gameState compartilhado (deck + timer + fase) + board vazio por jogador
async function initGameStateV2(code, playerKeys, timerTotal, memorizeTime) {
  if (!firebaseReady) return;
  var boards = {};
  playerKeys.forEach(function(k) {
    boards[k] = { deck: buildSharedDeck(), flipped: [], matched: {}, score: 0, matchedCount: 0, finished: false, finishedAt: 0 };
  });
  var mt = memorizeTime || 0;
  try {
    await db.ref('salas/' + code + '/gameState').set({
      phase: mt > 0 ? 'memorization' : 'playing',
      memorizeStart: mt > 0 ? Date.now() : 0,
      memorizeTime: mt,
      timerStart: mt > 0 ? 0 : Date.now(),
      timerTotal: timerTotal
    });
    await db.ref('salas/' + code + '/boards').set(boards);
  } catch(e) { console.error('initGameStateV2 error:', e); }
}

// Escuta todos os boards em tempo real
function listenAllBoards(code, cb) {
  if (!firebaseReady) return;
  db.ref('salas/' + code + '/boards').on('value', function(snap) { cb(snap.val()); });
}

// Atualiza o board do próprio jogador (suporta paths aninhados ex: 'matched/3')
async function updateMyBoard(code, playerKey, changes) {
  if (!firebaseReady) return;
  try {
    await db.ref('salas/' + code + '/boards/' + playerKey).update(changes);
  } catch(e) { console.error('updateMyBoard error:', e); }
}

// ============================================
// MODAL PERSONALIZADO
// ============================================
function showModal(title, placeholder, callback) {
  var old = document.getElementById('customModal');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.id = 'customModal';
  overlay.style.cssText = 'position:absolute;inset:0;z-index:999;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center';

  var card = document.createElement('div');
  card.style.cssText = 'width:320px;background:white;border-radius:12px;padding:28px 24px;text-align:center';

  var h = document.createElement('div');
  h.style.cssText = 'color:#026F18;font-size:22px;font-family:Poppins;font-weight:700;margin-bottom:16px';
  h.textContent = title;

  var inp = document.createElement('input');
  inp.type = 'text';
  inp.placeholder = placeholder;
  inp.style.cssText = 'width:100%;height:45px;border:3px solid #026F18;border-radius:6px;text-align:center;font-size:18px;font-family:Poppins;color:#026F18;margin-bottom:16px;padding:0 12px';

  var btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:10px;justify-content:center';

  var btnCancel = document.createElement('div');
  btnCancel.style.cssText = 'width:120px;height:38px;border:3px solid #026F18;border-radius:5px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#026F18;font-size:16px;font-family:Poppins;font-weight:600';
  btnCancel.textContent = 'Cancelar';
  btnCancel.onclick = function() { overlay.remove(); };

  var btnOk = document.createElement('div');
  btnOk.style.cssText = 'width:120px;height:38px;background:#FF0000;border-radius:5px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:white;font-size:16px;font-family:Poppins;font-weight:700';
  btnOk.textContent = 'OK';
  btnOk.onclick = function() {
    var val = inp.value.trim();
    if (!val) { inp.style.borderColor = '#FF0000'; return; }
    overlay.remove();
    callback(val);
  };

  inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') btnOk.click(); });

  btnRow.appendChild(btnCancel);
  btnRow.appendChild(btnOk);
  card.appendChild(h);
  card.appendChild(inp);
  card.appendChild(btnRow);
  overlay.appendChild(card);
  document.querySelector('.frame').appendChild(overlay);
  setTimeout(function() { inp.focus(); }, 100);
}

function showConfirm(title, msg, callback) {
  var old = document.getElementById('customModal');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.id = 'customModal';
  overlay.style.cssText = 'position:absolute;inset:0;z-index:999;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center';

  var card = document.createElement('div');
  card.style.cssText = 'width:320px;background:white;border-radius:12px;padding:28px 24px;text-align:center';

  var h = document.createElement('div');
  h.style.cssText = 'color:#026F18;font-size:22px;font-family:Poppins;font-weight:700;margin-bottom:10px';
  h.textContent = title;

  var p = document.createElement('div');
  p.style.cssText = 'color:#333;font-size:15px;font-family:Poppins;font-weight:400;margin-bottom:20px;line-height:1.4';
  p.textContent = msg;

  var btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:10px;justify-content:center';

  var btnNo = document.createElement('div');
  btnNo.style.cssText = 'width:120px;height:38px;border:3px solid #026F18;border-radius:5px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#026F18;font-size:16px;font-family:Poppins;font-weight:600';
  btnNo.textContent = 'Não';
  btnNo.onclick = function() { overlay.remove(); };

  var btnYes = document.createElement('div');
  btnYes.style.cssText = 'width:120px;height:38px;background:#FF0000;border-radius:5px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:white;font-size:16px;font-family:Poppins;font-weight:700';
  btnYes.textContent = 'Sim';
  btnYes.onclick = function() { overlay.remove(); callback(); };

  btnRow.appendChild(btnNo);
  btnRow.appendChild(btnYes);
  card.appendChild(h);
  card.appendChild(p);
  card.appendChild(btnRow);
  overlay.appendChild(card);
  document.querySelector('.frame').appendChild(overlay);
}

// ============================================
// RENDER RANKING
// SEMPRE mostra as 3 bases + medalhas + área branca
// Texto fica vazio onde não tem jogador
// ============================================
function renderRanking(podiumId, listId, players) {
  var p = players.slice().sort(function(a, b) { return b.score - a.score; });
  var podEl = document.getElementById(podiumId);
  var listEl = document.getElementById(listId);

  if (podEl) {
    var html = '';

    // SEMPRE renderiza as 3 bases do pódio
    html += '<div style="width:125px;height:174px;left:32px;top:342px;position:absolute;background:#ABABCF;border-top-left-radius:12px;border-top-right-radius:12px"></div>';
    html += '<div style="width:125px;height:206px;left:157px;top:310px;position:absolute;background:#F59F0A;border-top-left-radius:12px;border-top-right-radius:12px"></div>';
    html += '<div style="width:125px;height:150px;left:282px;top:366px;position:absolute;background:#FA6B25;border-top-left-radius:12px;border-top-right-radius:12px"></div>';

    // SEMPRE renderiza as 3 medalhas
    html += '<img style="width:143px;height:143px;left:148px;top:253px;position:absolute" src="assets/medal-gold.png" onerror="this.style.display=\'none\'">';
    html += '<img style="width:140px;height:140px;left:25px;top:289px;position:absolute" src="assets/medal-silver.png" onerror="this.style.display=\'none\'">';
    html += '<img style="width:140px;height:140px;left:275px;top:310px;position:absolute" src="assets/medal-bronze.png" onerror="this.style.display=\'none\'">';

    // 1st — texto só se existir
    if (p[0]) {
      html += '<div style="left:160px;top:380px;position:absolute;text-align:center;color:white;font-size:16px;font-family:Poppins;font-weight:500;line-height:18px;width:120px">' + p[0].name + '</div>';
      html += '<div style="left:160px;top:417px;position:absolute;text-align:center;color:white;font-size:14px;font-family:Poppins;font-weight:700;width:120px">' + p[0].score + ' pts</div>';
    }

    // 2nd — texto só se existir
    if (p[1]) {
      html += '<div style="left:35px;top:410px;position:absolute;text-align:center;color:white;font-size:16px;font-family:Poppins;font-weight:500;line-height:18px;width:120px">' + p[1].name + '</div>';
      html += '<div style="left:35px;top:449px;position:absolute;text-align:center;color:white;font-size:14px;font-family:Poppins;font-weight:700;width:120px">' + p[1].score + ' pts</div>';
    }

    // 3rd — texto só se existir
    if (p[2]) {
      html += '<div style="left:285px;top:429px;position:absolute;text-align:center;color:white;font-size:16px;font-family:Poppins;font-weight:500;line-height:18px;width:120px">' + p[2].name + '</div>';
      html += '<div style="left:285px;top:466px;position:absolute;text-align:center;color:white;font-size:14px;font-family:Poppins;font-weight:700;width:120px">' + p[2].score + ' pts</div>';
    }

    podEl.innerHTML = html;
  }

  // Lista rolável com todos os jogadores abaixo do pódio
  if (listEl) {
    var extras = p.slice(3);
    var html2 = '<div style="position:absolute;left:32px;top:516px;width:375px;max-height:400px;overflow-y:auto;background:white;border-bottom-right-radius:12px;border-bottom-left-radius:12px">';
    if (extras.length === 0) {
      html2 += '<div style="padding:18px;text-align:center;color:rgba(2,111,24,0.3);font-size:13px;font-family:Poppins;font-weight:400">Mais jogadores aparecerão aqui</div>';
    } else {
      extras.forEach(function(player, idx) {
        html2 +=
          '<div style="display:flex;align-items:center;padding:6px 16px;border-bottom:1px solid rgba(2,111,24,0.07)">' +
            '<span style="color:#FF0000;font-size:18px;font-family:Poppins;font-weight:700;min-width:36px">' + (idx + 4) + '</span>' +
            '<span style="color:#026F18;font-size:14px;font-family:Poppins;font-weight:500;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-right:8px">' + player.name + '</span>' +
            '<span style="color:#026F18;font-size:14px;font-family:Poppins;font-weight:700;white-space:nowrap">' + player.score + ' pts</span>' +
          '</div>';
      });
    }
    html2 += '</div>';
    listEl.innerHTML = html2;
  }
}
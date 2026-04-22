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
  { id:1, sit:{ title:"Ruído Industrial", desc:"Área de estampagem com níveis de ruído acima de 85 dB", icon:"🔊" }, sol:{ title:"Usar Protetor Auricular", desc:"Protege a audição contra danos permanentes", icon:"🦻" }, quiz:{ q:"A exposição contínua a ruído excessivo pode causar principalmente:", opts:["Cansaço visual","Perda auditiva gradual","Dor nas pernas","Queda de pressão"], c:1, exp:"Ruídos intensos por muito tempo podem comprometer a audição de forma permanente." } },
  { id:2, sit:{ title:"Vapores Tóxicos", desc:"Exposição a produtos químicos na cabine de pintura", icon:"☁️" }, sol:{ title:"Usar Respirador", desc:"Filtra gases e protege o sistema respiratório", icon:"😷" }, quiz:{ q:"Qual é o principal perigo de inalar vapores químicos sem proteção?", opts:["Sono leve","Intoxicação respiratória","Dor no pé","Perda de equilíbrio imediata"], c:1, exp:"A inalação de vapores pode afetar pulmões e vias respiratórias, causando intoxicação." } },
  { id:3, sit:{ title:"Contato com Químicos", desc:"Risco de respingos e contato direto com a pele", icon:"⚗️" }, sol:{ title:"Luvas e Óculos de Proteção", desc:"Evita queimaduras, irritações e lesões nos olhos", icon:"🧤" }, quiz:{ q:"O contato direto com produto químico pode causar:", opts:["Sono e fome","Irritação, queimadura ou lesão","Apenas sujeira","Dor muscular leve"], c:1, exp:"Produtos químicos podem agredir a pele e os olhos, causando danos importantes." } },
  { id:4, sit:{ title:"Superfície Cortante", desc:"Peças metálicas com bordas afiadas", icon:"🔪" }, sol:{ title:"Luva Anticorte", desc:"Reduz o risco de lesões nas mãos", icon:"🧤" }, quiz:{ q:"Ao manusear peças com bordas afiadas, o maior risco é:", opts:["Tontura","Corte nas mãos","Queimadura térmica","Perda de visão"], c:1, exp:"Peças cortantes exigem proteção adequada para evitar ferimentos imediatos." } },
  { id:5, sit:{ title:"Movimentação Incorreta", desc:"Uso errado do carrinho com peças", icon:"🛒" }, sol:{ title:"Empurrar com Postura Correta", desc:"Evita lesões e melhora o controle da carga", icon:"🏋️" }, quiz:{ q:"Movimentar carga de forma incorreta pode causar:", opts:["Lesão muscular ou perda de controle","Mais estabilidade","Menor esforço físico","Mais velocidade com segurança"], c:0, exp:"Postura inadequada e uso errado do carrinho aumentam o risco de acidente e lesão." } },
  { id:6, sit:{ title:"Sem Capacete", desc:"Pilotagem sem proteção na cabeça", icon:"🏍️" }, sol:{ title:"Uso de Capacete", desc:"Reduz o risco de lesões graves e fatais", icon:"⛑️" }, quiz:{ q:"Em um acidente de motocicleta, o capacete protege principalmente:", opts:["Os braços","A cabeça","Os joelhos","As mãos"], c:1, exp:"O capacete é a proteção mais importante para reduzir impactos na cabeça." } },
  { id:7, sit:{ title:"Pista Molhada", desc:"Risco de derrapagem durante a chuva", icon:"🌧️" }, sol:{ title:"Reduzir Velocidade", desc:"Aumenta o controle da moto e a segurança", icon:"🐢" }, quiz:{ q:"Por que a chuva exige mais cuidado ao pilotar?", opts:["Porque a pista fica mais escorregadia","Porque o motor perde força","Porque a moto fica mais pesada","Porque o farol apaga"], c:0, exp:"Com menos aderência, aumenta o risco de derrapagem e perda de controle." } },
  { id:8, sit:{ title:"Área Desorganizada", desc:"Objetos espalhados e circulação insegura", icon:"📦" }, sol:{ title:"Manter Organização", desc:"Evita tropeços, quedas e acidentes", icon:"🧹" }, quiz:{ q:"Um ambiente desorganizado aumenta principalmente o risco de:", opts:["Queda e tropeço","Insolação","Problema respiratório","Ruído excessivo"], c:0, exp:"Materiais fora do lugar atrapalham a circulação e aumentam acidentes no trajeto." } }
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
    var snap = await db.ref('rankingGeral').orderByChild('score').limitToLast(50).once('value');
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
    var snap = await db.ref('rankingSala/' + code).orderByChild('score').limitToLast(50).once('value');
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
      console.log('✅ Firebase limpo!');
    } catch(e) { console.error(e); }
  }
  // Limpa localStorage antigo
  var keys = Object.keys(localStorage);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].indexOf('honda') === 0) localStorage.removeItem(keys[i]);
  }
  console.log('✅ localStorage limpo!');
  alert('Dados apagados! Recarregue a página.');
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
// Sem medalhas quando não tem jogador naquela posição
// ============================================
function renderRanking(podiumId, listId, players) {
  var p = players.slice().sort(function(a, b) { return b.score - a.score; });
  var podEl = document.getElementById(podiumId);
  var listEl = document.getElementById(listId);

  // VAZIO
  if (p.length === 0) {
    if (podEl) {
      podEl.innerHTML = '<div style="width:375px;height:380px;left:32px;top:290px;position:absolute;background:rgba(255,255,255,0.08);border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center">' +
        '<div style="font-size:60px;margin-bottom:12px">🏆</div>' +
        '<div style="color:white;font-size:20px;font-family:Poppins;font-weight:600;text-align:center;margin-bottom:8px">Nenhum jogador ainda</div>' +
        '<div style="color:rgba(255,255,255,0.6);font-size:14px;font-family:Poppins;font-weight:400;text-align:center;line-height:1.4;padding:0 20px">Jogue uma partida para<br>aparecer no ranking!</div>' +
        '</div>';
    }
    if (listEl) listEl.innerHTML = '';
    return;
  }

  // PODIUM — só renderiza a base + medalha se o jogador EXISTE
  if (podEl) {
    var html = '';

    // 1st — sempre existe se length > 0
    html += '<div style="width:125px;height:206px;left:157px;top:310px;position:absolute;background:#F59F0A;border-top-left-radius:12px;border-top-right-radius:12px"></div>';
    html += '<img style="width:143px;height:143px;left:148px;top:253px;position:absolute" src="assets/medal-gold.png" onerror="this.style.display=\'none\'">';
    html += '<div style="left:160px;top:380px;position:absolute;text-align:center;color:white;font-size:16px;font-family:Poppins;font-weight:500;line-height:18px;width:120px">' + p[0].name + '</div>';
    html += '<div style="left:160px;top:417px;position:absolute;text-align:center;color:white;font-size:14px;font-family:Poppins;font-weight:700;width:120px">' + p[0].score + ' pts</div>';

    // 2nd
    if (p[1]) {
      html += '<div style="width:125px;height:174px;left:32px;top:342px;position:absolute;background:#ABABCF;border-top-left-radius:12px;border-top-right-radius:12px"></div>';
      html += '<img style="width:140px;height:140px;left:25px;top:289px;position:absolute" src="assets/medal-silver.png" onerror="this.style.display=\'none\'">';
      html += '<div style="left:35px;top:410px;position:absolute;text-align:center;color:white;font-size:16px;font-family:Poppins;font-weight:500;line-height:18px;width:120px">' + p[1].name + '</div>';
      html += '<div style="left:35px;top:449px;position:absolute;text-align:center;color:white;font-size:14px;font-family:Poppins;font-weight:700;width:120px">' + p[1].score + ' pts</div>';
    }

    // 3rd
    if (p[2]) {
      html += '<div style="width:125px;height:150px;left:282px;top:366px;position:absolute;background:#FA6B25;border-top-left-radius:12px;border-top-right-radius:12px"></div>';
      html += '<img style="width:140px;height:140px;left:275px;top:310px;position:absolute" src="assets/medal-bronze.png" onerror="this.style.display=\'none\'">';
      html += '<div style="left:285px;top:429px;position:absolute;text-align:center;color:white;font-size:16px;font-family:Poppins;font-weight:500;line-height:18px;width:120px">' + p[2].name + '</div>';
      html += '<div style="left:285px;top:466px;position:absolute;text-align:center;color:white;font-size:14px;font-family:Poppins;font-weight:700;width:120px">' + p[2].score + ' pts</div>';
    }

    podEl.innerHTML = html;
  }

  // LIST 4+
  if (listEl) {
    var html2 = '';
    var count = Math.min(p.length - 3, 5);
    if (count > 0) {
      var listHeight = count * 27 + 30;
      html2 += '<div style="width:375px;height:' + listHeight + 'px;left:32px;top:516px;position:absolute;background:white;border-bottom-right-radius:12px;border-bottom-left-radius:12px"></div>';
      for (var i = 3; i < Math.min(p.length, 8); i++) {
        var y = 533 + (i - 3) * 27;
        html2 += '<div style="left:56px;top:' + (y+2) + 'px;position:absolute;color:#FF0000;font-size:20px;font-family:Poppins;font-weight:700">' + (i+1) + '</div>';
        html2 += '<div style="left:80px;top:' + y + 'px;position:absolute;color:#026F18;font-size:14px;font-family:Poppins;font-weight:500;line-height:25px">' + p[i].name + '</div>';
        html2 += '<div style="left:320px;top:' + (y+5) + 'px;position:absolute;color:#026F18;font-size:14px;font-family:Poppins;font-weight:700">' + p[i].score + ' pts</div>';
      }
    }
    listEl.innerHTML = html2;
  }
}

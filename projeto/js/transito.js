/* ============================================================
   CAÇA RISCO NO TRAJETO — lógica completa
   ============================================================ */

/* ------------------------------------------------------------------
   CENAS — 6 cenas, ordem embaralhada por turno
   Posições x/y em % da largura/altura da imagem (0–100)
   Ajuste x e y para alinhar com os objetos reais nas imagens
   ------------------------------------------------------------------ */
var CENAS = [

  /* 1 ── cena6.webp ─────────────────────────────────────────── */
  {
    id: 6,
    image: 'assets/transito/cena6.webp',
    nome: 'Pilotando moto · Centro nublado',
    local: 'Risco climático',
    points: [
      { id: 'c6_celular',   x: 40, y: 42, icon: '📱', type: 'risco',     label: 'Celular em uso ao pilotar' },
      { id: 'c6_capacete',  x: 50, y: 22, icon: '🪖', type: 'risco',     label: 'Sem capacete homologado' },
      { id: 'c6_sinal',     x: 68, y: 50, icon: '🚦', type: 'risco',     label: 'Avançando sinal fechado' },
      { id: 'c6_chuva',     x: 55, y: 65, icon: '🌧️', type: 'risco',     label: 'Velocidade não reduzida na chuva' },
      { id: 'c6_carro',     x: 35, y: 60, icon: '🚗', type: 'risco',     label: 'Moto colada no carro da frente' },
      { id: 'c6_via',       x: 80, y: 42, icon: '🛣️', type: 'pegadinha', label: 'Via pavimentada — não é o risco' },
      { id: 'c6_calcada',   x: 18, y: 72, icon: '🚶', type: 'pegadinha', label: 'Pedestre na calçada corretamente' }
    ]
  },

  /* 2 ── cena5.webp ─────────────────────────────────────────── */
  {
    id: 5,
    image: 'assets/transito/cena5.webp',
    nome: 'Esperando no ponto · Avenida',
    local: 'Distração e risco no entorno',
    points: [
      { id: 'c5_celular',   x: 45, y: 55, icon: '📱', type: 'risco',     label: 'Celular próximo à via' },
      { id: 'c5_fora',      x: 25, y: 72, icon: '🚌', type: 'risco',     label: 'Fora da área de embarque' },
      { id: 'c5_moto',      x: 70, y: 65, icon: '🏍️', type: 'risco',     label: 'Moto trafegando na calçada' },
      { id: 'c5_mochila',   x: 55, y: 60, icon: '🎒', type: 'risco',     label: 'Mochila obstruindo visão da via' },
      { id: 'c5_onibus',    x: 85, y: 50, icon: '🚌', type: 'pegadinha', label: 'Ônibus parado no ponto — correto' },
      { id: 'c5_ponto',     x: 30, y: 35, icon: '🚏', type: 'pegadinha', label: 'Sinalização do ponto — adequada' }
    ]
  },

  /* 3 ── cena4.webp ─────────────────────────────────────────── */
  {
    id: 4,
    image: 'assets/transito/cena4.webp',
    nome: 'Caminhando ao ponto · Centro',
    local: 'Distrações na via',
    points: [
      { id: 'c4_celular',   x: 42, y: 52, icon: '📱', type: 'risco',     label: 'Uso de celular ao caminhar' },
      { id: 'c4_calc',      x: 22, y: 75, icon: '🚫', type: 'risco',     label: 'Caminhando fora da calçada' },
      { id: 'c4_fone',      x: 55, y: 46, icon: '🎒', type: 'risco',     label: 'Mochila pesada obstruindo percepção' },
      { id: 'c4_onibus',    x: 82, y: 58, icon: '🚌', type: 'pegadinha', label: 'Ônibus no corredor — correto' },
      { id: 'c4_arvore',    x: 12, y: 42, icon: '🌳', type: 'pegadinha', label: 'Árvore — não é um risco' },
      { id: 'c4_lixeira',   x: 68, y: 72, icon: '🗑️', type: 'pegadinha', label: 'Lixeira no lugar correto' }
    ]
  },

  /* 4 ── cena3.webp ─────────────────────────────────────────── */
  {
    id: 3,
    image: 'assets/transito/cena3.webp',
    nome: 'Pilotando moto · Kit completo',
    local: 'Trajeto urbano',
    points: [
      { id: 'c3_veloc',     x: 50, y: 60, icon: '🏍️', type: 'risco',     label: 'Velocidade acima do limite' },
      { id: 'c3_dist',      x: 38, y: 55, icon: '🚗', type: 'risco',     label: 'Distância insegura do carro' },
      { id: 'c3_faixa',     x: 62, y: 75, icon: '🛣️', type: 'risco',     label: 'Cortando faixa sem sinalizar' },
      { id: 'c3_capacete',  x: 50, y: 22, icon: '🪖', type: 'pegadinha', label: 'Capacete homologado — correto' },
      { id: 'c3_luvas',     x: 32, y: 55, icon: '🧤', type: 'pegadinha', label: 'Luvas de proteção — correto' },
      { id: 'c3_jaqueta',   x: 50, y: 45, icon: '🦺', type: 'pegadinha', label: 'Jaqueta de proteção — correto' }
    ]
  },

  /* 5 ── cena2.webp ─────────────────────────────────────────── */
  {
    id: 2,
    image: 'assets/transito/cena2.webp',
    nome: 'Esperando no ponto · Industrial',
    local: 'Área industrial',
    points: [
      { id: 'c2_celular',   x: 45, y: 55, icon: '📱', type: 'risco',     label: 'Celular distraindo junto à via' },
      { id: 'c2_sinalizacao',x: 28, y: 70, icon: '🚌', type: 'risco',    label: 'Fora da área de embarque sinalizada' },
      { id: 'c2_colete',    x: 60, y: 50, icon: '🦺', type: 'risco',     label: 'Sem colete de visibilidade' },
      { id: 'c2_lixeira',   x: 78, y: 65, icon: '🗑️', type: 'pegadinha', label: 'Lixeira no lugar correto' },
      { id: 'c2_arvore',    x: 15, y: 45, icon: '🌴', type: 'pegadinha', label: 'Árvore — não é um risco' },
      { id: 'c2_van',       x: 70, y: 75, icon: '🚐', type: 'pegadinha', label: 'Van parada no local correto' }
    ]
  },

  /* 6 ── cena1.webp ─────────────────────────────────────────── */
  {
    id: 1,
    image: 'assets/transito/cena1.webp',
    nome: 'Caminhando ao ponto · Avenida',
    local: 'Risco na travessia',
    points: [
      { id: 'c1_celular',   x: 40, y: 55, icon: '📱', type: 'risco',     label: 'Celular ao atravessar a rua' },
      { id: 'c1_faixa',     x: 55, y: 75, icon: '🚶', type: 'risco',     label: 'Atravessando fora da faixa' },
      { id: 'c1_moto',      x: 72, y: 60, icon: '🏍️', type: 'risco',     label: 'Moto na calçada' },
      { id: 'c1_olhar',     x: 30, y: 50, icon: '🚫', type: 'risco',     label: 'Sem olhar antes de atravessar' },
      { id: 'c1_onibus',    x: 85, y: 52, icon: '🚌', type: 'pegadinha', label: 'Ônibus no ponto — correto' },
      { id: 'c1_proibido',  x: 18, y: 36, icon: '🚫', type: 'pegadinha', label: 'Placa de proibição visível — correto' }
    ]
  }
];

/* ---- embaralha array (Fisher-Yates) ---- */
function shuffleCenas(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

/* ---- estado do jogo ---- */
var G = {
  p1: { name: '', score: 0, hits: 0, errors: 0, timeUsed: 0 },
  p2: { name: '', score: 0, hits: 0, errors: 0, timeUsed: 0 },
  cur: 1,
  scene: 0,
  scenesOrder: [],   /* ordem embaralhada das cenas para o turno atual */
  timer: null,
  timeLeft: 30,
  clicked: {}
};

/* ---- navegação de telas ---- */
function showScreen(id) {
  document.querySelectorAll('.tr-screen').forEach(function(s) {
    s.classList.remove('ativa');
  });
  var el = document.getElementById(id);
  if (el) el.classList.add('ativa');
}

/* ---- intro → jogo ---- */
function iniciarDuelo() {
  var n1 = document.getElementById('inputP1').value.trim();
  var n2 = document.getElementById('inputP2').value.trim();
  if (!n1 || !n2) {
    alert('Informe os nomes dos dois jogadores.');
    return;
  }
  G.p1.name = n1; G.p1.score = 0; G.p1.hits = 0; G.p1.errors = 0; G.p1.timeUsed = 0;
  G.p2.name = n2; G.p2.score = 0; G.p2.hits = 0; G.p2.errors = 0; G.p2.timeUsed = 0;
  G.cur = 1;
  G.scene = 0;
  iniciarTurno();
}

/* ---- inicia turno — embaralha cenas individualmente por jogador ---- */
function iniciarTurno() {
  var p = G.cur === 1 ? G.p1 : G.p2;
  G.scenesOrder = shuffleCenas(CENAS);   /* ordem diferente a cada turno */
  G.scene = 0;
  G.clicked = {};
  document.getElementById('hudNome').textContent = p.name;
  showScreen('screen-game');
  carregarCena();
}

/* ---- carrega a cena atual ---- */
function carregarCena() {
  var cena = G.scenesOrder[G.scene];
  G.clicked = {};
  G.timeLeft = 30;

  var total = G.scenesOrder.length;
  document.getElementById('cenaLabel').textContent = cena.nome + ' · ' + cena.local;
  document.getElementById('cenaNum').textContent = (G.scene + 1) + '/' + total;

  atualizarHUD();

  var sceneEl = document.getElementById('sceneContainer');
  sceneEl.innerHTML = '';
  /* limpa estilo de fallback se existir */
  sceneEl.removeAttribute('style');

  var img = document.createElement('img');
  img.src = cena.image;
  img.alt = cena.nome;
  img.className = 'tr-scene-img';
  img.onerror = function() {
    sceneEl.style.cssText = 'background:#1a472a;display:flex;align-items:center;justify-content:center';
    var msg = document.createElement('div');
    msg.style.cssText = 'color:white;font-size:14px;font-family:Poppins;text-align:center;padding:20px';
    msg.textContent = '📸 ' + cena.nome;
    sceneEl.appendChild(msg);
  };
  sceneEl.appendChild(img);

  cena.points.forEach(function(pt) {
    var btn = document.createElement('button');
    btn.className = 'tr-point';
    btn.id = 'pt-' + pt.id;
    btn.style.left = pt.x + '%';
    btn.style.top  = pt.y + '%';
    btn.textContent = pt.icon;
    btn.setAttribute('aria-label', pt.label);
    btn.addEventListener('click', function() { handleClick(G.scene, pt); });
    sceneEl.appendChild(btn);
  });

  iniciarTimer();
}

/* ---- timer ---- */
function iniciarTimer() {
  clearInterval(G.timer);
  atualizarTimerDisplay();
  G.timer = setInterval(function() {
    G.timeLeft--;
    atualizarTimerDisplay();
    if (G.timeLeft <= 0) {
      clearInterval(G.timer);
      encerrarCena();
    }
  }, 1000);
}

function atualizarTimerDisplay() {
  var el = document.getElementById('hudTimer');
  if (!el) return;
  el.textContent = G.timeLeft + 's';
  el.style.color = G.timeLeft <= 10 ? '#ff4444' : '#026F18';
}

function atualizarHUD() {
  var p = G.cur === 1 ? G.p1 : G.p2;
  var elScore  = document.getElementById('hudScore');
  var elHits   = document.getElementById('hudHits');
  var elErrors = document.getElementById('hudErrors');
  if (elScore)  elScore.textContent  = p.score;
  if (elHits)   elHits.textContent   = p.hits;
  if (elErrors) elErrors.textContent = p.errors;
}

/* ---- clique num ponto ---- */
function handleClick(sceneIdx, pt) {
  if (G.clicked[pt.id]) return;
  G.clicked[pt.id] = true;

  var p = G.cur === 1 ? G.p1 : G.p2;
  var btn = document.getElementById('pt-' + pt.id);

  if (pt.type === 'risco') {
    p.score += 10;
    p.hits++;
    if (btn) { btn.classList.add('acertou'); btn.title = pt.label; }
    mostrarToast('+10 · ' + pt.label, true);
  } else {
    p.score -= 5;
    p.errors++;
    if (btn) { btn.classList.add('errou'); btn.title = pt.label; }
    mostrarToast('-5 · ' + pt.label, false);
  }

  atualizarHUD();

  /* avança automaticamente se todos os riscos foram clicados */
  var cena = G.scenesOrder[sceneIdx];
  var riscos = cena.points.filter(function(r) { return r.type === 'risco'; });
  var todosAcertados = riscos.every(function(r) { return G.clicked[r.id]; });
  if (todosAcertados) {
    clearInterval(G.timer);
    setTimeout(function() { encerrarCena(); }, 600);
  }
}

function mostrarToast(msg, ok) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.background = ok ? '#026F18' : '#cc0000';
  toast.classList.add('visivel');
  setTimeout(function() { toast.classList.remove('visivel'); }, 1500);
}

/* ---- fim da cena ---- */
function encerrarCena() {
  clearInterval(G.timer);
  var p = G.cur === 1 ? G.p1 : G.p2;
  p.timeUsed += (30 - G.timeLeft);

  G.scene++;
  var total = G.scenesOrder.length;

  if (G.scene < total) {
    var overlay = document.getElementById('cenaTransicao');
    if (overlay) {
      overlay.querySelector('.tr-trans-num').textContent = 'Cena ' + (G.scene + 1) + ' de ' + total;
      overlay.querySelector('.tr-trans-nome').textContent = G.scenesOrder[G.scene].nome;
      overlay.classList.add('visivel');
      setTimeout(function() {
        overlay.classList.remove('visivel');
        carregarCena();
      }, 1800);
    } else {
      carregarCena();
    }
  } else {
    encerrarTurno();
  }
}

/* ---- fim do turno ---- */
function encerrarTurno() {
  clearInterval(G.timer);
  if (G.cur === 1) {
    var p = G.p1;
    document.getElementById('switchNome').textContent    = p.name + ' terminou!';
    document.getElementById('switchScore').textContent   = p.score + ' pts';
    document.getElementById('switchHits').textContent    = p.hits;
    document.getElementById('switchErrors').textContent  = p.errors;
    document.getElementById('switchTime').textContent    = p.timeUsed + 's';
    document.getElementById('switchNextNome').textContent = G.p2.name;
    showScreen('screen-switch');
  } else {
    mostrarResultado();
  }
}

/* ---- P2 começa ---- */
function iniciarJogador2() {
  G.cur = 2;
  iniciarTurno();
}

/* ---- resultado final + salva Firebase ---- */
async function mostrarResultado() {
  var p1 = G.p1, p2 = G.p2;

  document.getElementById('resP1Nome').textContent   = p1.name;
  document.getElementById('resP1Score').textContent  = p1.score + ' pts';
  document.getElementById('resP1Hits').textContent   = p1.hits;
  document.getElementById('resP1Errors').textContent = p1.errors;

  document.getElementById('resP2Nome').textContent   = p2.name;
  document.getElementById('resP2Score').textContent  = p2.score + ' pts';
  document.getElementById('resP2Hits').textContent   = p2.hits;
  document.getElementById('resP2Errors').textContent = p2.errors;

  var banner = document.getElementById('resBanner');
  if (p1.score > p2.score) {
    banner.textContent = '🏆 ' + p1.name + ' venceu!';
    banner.style.background = '#026F18';
    document.getElementById('resP1Card').classList.add('vencedor');
  } else if (p2.score > p1.score) {
    banner.textContent = '🏆 ' + p2.name + ' venceu!';
    banner.style.background = '#026F18';
    document.getElementById('resP2Card').classList.add('vencedor');
  } else {
    banner.textContent = '🤝 Empate!';
    banner.style.background = '#b56a00';
  }

  showScreen('screen-result');

  /* salva ambos os jogadores no Firebase */
  if (typeof addToTransitoRanking === 'function') {
    try {
      await addToTransitoRanking(p1.name, p1.score, p1.hits, p1.errors, p1.timeUsed);
      await addToTransitoRanking(p2.name, p2.score, p2.hits, p2.errors, p2.timeUsed);
      console.log('✅ Ranking trânsito salvo!');
    } catch(e) {
      console.warn('Firebase indisponível para trânsito:', e);
    }
  }
}

/* ---- novo duelo ---- */
function novoDuelo() {
  document.getElementById('resP1Card').classList.remove('vencedor');
  document.getElementById('resP2Card').classList.remove('vencedor');
  showScreen('screen-intro');
}

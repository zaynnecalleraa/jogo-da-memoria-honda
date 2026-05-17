/* ============================================================
   CAÇA RISCO NO TRAJETO — lógica completa
   ============================================================ */

const CENAS = [
  {
    id: 1,
    image: 'assets/transito/cena1.png',
    nome: 'Caminhando ao ponto',
    local: 'Centro',
    points: [
      { id: 'celular',    x: 42, y: 55, icon: '📱', type: 'risco',     label: 'Uso de celular ao caminhar' },
      { id: 'colete',     x: 68, y: 40, icon: '🦺', type: 'risco',     label: 'Sem colete refletivo' },
      { id: 'calcada',    x: 20, y: 70, icon: '🚗', type: 'risco',     label: 'Veículo estacionado na calçada' },
      { id: 'fone',       x: 55, y: 48, icon: '🎧', type: 'risco',     label: 'Fone de ouvido reduz atenção' },
      { id: 'arvore',     x: 82, y: 58, icon: '🌳', type: 'pegadinha', label: 'Árvore — não é risco' },
      { id: 'lixeira',    x: 30, y: 78, icon: '🗑️', type: 'pegadinha', label: 'Lixeira no lugar certo' }
    ]
  },
  {
    id: 2,
    image: 'assets/transito/cena2.png',
    nome: 'Esperando no ponto',
    local: 'Avenida',
    points: [
      { id: 'faixa',      x: 35, y: 75, icon: '⚠️', type: 'risco',     label: 'Fora da faixa de pedestre' },
      { id: 'borda',      x: 60, y: 65, icon: '🚧', type: 'risco',     label: 'Muito próximo à via' },
      { id: 'celular2',   x: 48, y: 45, icon: '📱', type: 'risco',     label: 'Celular próximo à via' },
      { id: 'mochila',    x: 25, y: 55, icon: '🎒', type: 'risco',     label: 'Mochila obstruindo visão' },
      { id: 'banco',      x: 75, y: 60, icon: '🪑', type: 'pegadinha', label: 'Banco do ponto — seguro' },
      { id: 'telhado',    x: 85, y: 30, icon: '🏠', type: 'pegadinha', label: 'Cobertura do ponto — seguro' }
    ]
  },
  {
    id: 3,
    image: 'assets/transito/cena3.png',
    nome: 'Pilotando moto · Kit completo',
    local: 'Sem capacete',
    points: [
      { id: 'capacete',   x: 50, y: 25, icon: '⛑️', type: 'risco',     label: 'Sem capacete homologado' },
      { id: 'bocal',      x: 50, y: 35, icon: '🛡️', type: 'risco',     label: 'Bocal sem fixação adequada' },
      { id: 'manga',      x: 38, y: 55, icon: '👕', type: 'risco',     label: 'Manga curta — sem proteção' },
      { id: 'tenis',      x: 48, y: 80, icon: '👟', type: 'risco',     label: 'Tênis em vez de bota' },
      { id: 'luvas',      x: 32, y: 60, icon: '🧤', type: 'risco',     label: 'Sem luvas de proteção' },
      { id: 'espelho',    x: 18, y: 45, icon: '🔲', type: 'pegadinha', label: 'Espelho retrovisor — obrigatório e ok' },
      { id: 'freio',      x: 65, y: 70, icon: '🔧', type: 'pegadinha', label: 'Freio em bom estado' }
    ]
  },
  {
    id: 4,
    image: 'assets/transito/cena4.png',
    nome: 'Pilotando moto',
    local: 'Centro nublado',
    points: [
      { id: 'farol',      x: 50, y: 78, icon: '💡', type: 'risco',     label: 'Farol apagado à noite' },
      { id: 'chuva',      x: 65, y: 30, icon: '🌧️', type: 'risco',     label: 'Piso molhado sem reduzir velocidade' },
      { id: 'faixa2',     x: 30, y: 72, icon: '🚦', type: 'risco',     label: 'Avanço de sinal' },
      { id: 'entrefila',  x: 55, y: 58, icon: '🏍️', type: 'risco',     label: 'Trafegando entre filas' },
      { id: 'capacete2',  x: 50, y: 22, icon: '⛑️', type: 'risco',     label: 'Capacete sem fixação' },
      { id: 'semaforo',   x: 78, y: 40, icon: '🚥', type: 'pegadinha', label: 'Semáforo funcionando — seguro' },
      { id: 'calcada2',   x: 15, y: 60, icon: '🚶', type: 'pegadinha', label: 'Pedestre na calçada — correto' }
    ]
  }
];

const G = {
  p1: { name: '', score: 0, hits: 0, errors: 0, timeUsed: 0 },
  p2: { name: '', score: 0, hits: 0, errors: 0, timeUsed: 0 },
  cur: 1,
  scene: 0,
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

/* ---- inicia turno de um jogador ---- */
function iniciarTurno() {
  var p = G.cur === 1 ? G.p1 : G.p2;
  G.scene = 0;
  G.clicked = {};
  document.getElementById('hudNome').textContent = p.name;
  showScreen('screen-game');
  carregarCena();
}

/* ---- carrega a cena atual ---- */
function carregarCena() {
  var cena = CENAS[G.scene];
  var p = G.cur === 1 ? G.p1 : G.p2;
  G.clicked = {};
  G.timeLeft = 30;

  /* label */
  document.getElementById('cenaLabel').textContent = cena.nome + ' · ' + cena.local;
  document.getElementById('cenaNum').textContent = (G.scene + 1) + '/4';

  /* atualiza HUD score/hits/errors */
  atualizarHUD();

  /* monta cena */
  var sceneEl = document.getElementById('sceneContainer');
  sceneEl.innerHTML = '';

  var img = document.createElement('img');
  img.src = cena.image;
  img.alt = cena.nome;
  img.className = 'tr-scene-img';
  img.onerror = function() {
    /* fallback quando imagem não existe */
    sceneEl.style.background = '#1a472a';
    sceneEl.style.display = 'flex';
    sceneEl.style.alignItems = 'center';
    sceneEl.style.justifyContent = 'center';
    var msg = document.createElement('div');
    msg.style.cssText = 'color:white;font-size:14px;font-family:Poppins;text-align:center;padding:20px';
    msg.textContent = '📸 ' + cena.nome;
    sceneEl.appendChild(msg);
  };
  sceneEl.appendChild(img);

  /* pontos clicáveis */
  cena.points.forEach(function(pt) {
    var btn = document.createElement('button');
    btn.className = 'tr-point';
    btn.id = 'pt-' + pt.id;
    btn.style.left = pt.x + '%';
    btn.style.top = pt.y + '%';
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
  if (el) el.textContent = G.timeLeft + 's';
  if (G.timeLeft <= 10 && el) {
    el.style.color = '#ff4444';
  } else if (el) {
    el.style.color = '#026F18';
  }
}

function atualizarHUD() {
  var p = G.cur === 1 ? G.p1 : G.p2;
  var elScore = document.getElementById('hudScore');
  var elHits  = document.getElementById('hudHits');
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
    if (btn) {
      btn.classList.add('acertou');
      btn.title = pt.label;
    }
    mostrarToast('+10 · ' + pt.label, true);
  } else {
    p.score -= 5;
    p.errors++;
    if (btn) {
      btn.classList.add('errou');
      btn.title = pt.label;
    }
    mostrarToast('-5 · ' + pt.label, false);
  }

  atualizarHUD();

  /* se clicou em todos os riscos reais, avança cena automaticamente */
  var cena = CENAS[sceneIdx];
  var riscos = cena.points.filter(function(p) { return p.type === 'risco'; });
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
  if (G.scene < CENAS.length) {
    /* transição entre cenas */
    var overlay = document.getElementById('cenaTransicao');
    if (overlay) {
      overlay.querySelector('.tr-trans-num').textContent = 'Cena ' + (G.scene + 1) + ' de 4';
      overlay.querySelector('.tr-trans-nome').textContent = CENAS[G.scene].nome;
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
    /* mostra tela de troca */
    var p = G.p1;
    document.getElementById('switchNome').textContent = p.name + ' terminou!';
    document.getElementById('switchScore').textContent = p.score + ' pts';
    document.getElementById('switchHits').textContent  = p.hits;
    document.getElementById('switchErrors').textContent = p.errors;
    document.getElementById('switchTime').textContent  = p.timeUsed + 's';
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

/* ---- resultado final ---- */
function mostrarResultado() {
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
}

/* ---- novo duelo ---- */
function novoDuelo() {
  document.getElementById('resP1Card').classList.remove('vencedor');
  document.getElementById('resP2Card').classList.remove('vencedor');
  showScreen('screen-intro');
}

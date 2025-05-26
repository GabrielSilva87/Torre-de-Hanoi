const towers = [[], [], []];
const towerElements = [
  document.getElementById('tower-0'),
  document.getElementById('tower-1'),
  document.getElementById('tower-2')
];
const diskCountInput = document.getElementById('disk-count');
const moveCountSpan = document.getElementById('move-count');
const messageEl = document.getElementById('message');
const resetBtn = document.getElementById('reset-btn');

const DISK_COLORS = [
  '#e74c3c',
  '#f39c12',
  '#27ae60',
  '#9b59b6',
  '#2980b9',
  '#16a085',
  '#d35400',
  '#c0392b',
  '#8e44ad',
  '#2c3e50',
  '#f1c40f',
  '#34495e'
];

let moveCount = 0;
let selectedTower = null;
let diskCount = parseInt(diskCountInput.value, 10);

function createDisk(size) {
  const disk = document.createElement('div');
  disk.classList.add('disk');
  const width = 60 + (size - 1) * 15;
  disk.style.width = width + 'px';
  disk.style.backgroundColor = DISK_COLORS[(size - 1) % DISK_COLORS.length];
  disk.dataset.size = size;
  disk.setAttribute('aria-label', `Disco tamanho ${size}`);
  disk.setAttribute('role', 'listitem');
  return disk;
}

function render() {
  towerElements.forEach((towerEl, index) => {
    towerEl.querySelectorAll('.disk').forEach(diskEl => diskEl.remove());
    towers[index].slice().reverse().forEach(size => {
      const disk = createDisk(size);
      towerEl.appendChild(disk);
    });
    towerEl.classList.toggle('selected', selectedTower === index);
  });
  moveCountSpan.textContent = moveCount;
}

function moveDisk(from, to) {
  if (!canMove(towers[from], towers[to])) {
    messageEl.textContent = 'Movimento inválido! Disco maior não pode ficar sobre menor.';
    return false;
  }
  const disk = towers[from].pop();
  towers[to].push(disk);
  moveCount++;
  messageEl.textContent = '';
  return true;
}

function onTowerClick(index) {
  if (selectedTower === null) {
    if (towers[index].length === 0) {
      messageEl.textContent = 'Torre selecionada está vazia, escolha outra torre com discos.';
      return;
    }
    selectedTower = index;
    messageEl.textContent = 'Escolha uma torre para mover o disco.';
    render();
  } else {
    if (selectedTower === index) {
      selectedTower = null;
      messageEl.textContent = 'Seleção cancelada.';
      render();
      return;
    }
    if (moveDisk(selectedTower, index)) {
      if (checkWin(towers, diskCount)) {
        messageEl.textContent = `Parabéns! Você venceu em ${moveCount} movimentos! 🎉`;
        selectedTower = null;
        render();
        return;
      }
      selectedTower = null;
      render();
    }
  }
}

function onTowerKeydown(ev, index) {
  if (ev.key === 'Enter' || ev.key === ' ') {
    ev.preventDefault();
    onTowerClick(index);
  }
}

function resetGame() {
  diskCount = Math.min(Math.max(parseInt(diskCountInput.value, 10) || 3, 2), 12);
  diskCountInput.value = diskCount;
  towers[0] = [];
  towers[1] = [];
  towers[2] = [];
  for (let i = diskCount; i >= 1; i--) {
    towers[0].push(i);
  }
  moveCount = 0;
  selectedTower = null;
  messageEl.textContent = '';
  render();
}

// Eventos
towerElements.forEach((el, idx) => {
  el.addEventListener('click', () => onTowerClick(idx));
  el.addEventListener('keydown', e => onTowerKeydown(e, idx));
});
resetBtn.addEventListener('click', resetGame);

// Inicializa o jogo
resetGame();

import React, { useState, useEffect } from 'react';

type Tower = number[];

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
  '#34495e',
];

interface Config {
  minDisks: number;
  maxDisks: number;
  defaultDisks: number;
}

const config: Config = {
  minDisks: 2,
  maxDisks: 12,
  defaultDisks: 3,
};

function canMove(fromTower: Tower, toTower: Tower): boolean {
  if (fromTower.length === 0) return false;
  const movingDisk = fromTower[fromTower.length - 1];
  if (toTower.length === 0) return true;
  const topToDisk = toTower[toTower.length - 1];
  return movingDisk < topToDisk;
}

const App: React.FC = () => {
  const [diskCount, setDiskCount] = useState<number>(config.defaultDisks);
  const [towers, setTowers] = useState<Tower[]>([[], [], []]);
  const [selectedTower, setSelectedTower] = useState<number | null>(null);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  // Initialize game when diskCount changes
  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diskCount]);

  function resetGame() {
    const initialTower = Array.from({ length: diskCount }, (_, i) => diskCount - i);
    setTowers([initialTower, [], []]);
    setSelectedTower(null);
    setMoveCount(0);
    setMessage('');
  }

  function handleDiskCountChange(e: React.ChangeEvent<HTMLInputElement>) {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = config.defaultDisks;
    if (val < config.minDisks) val = config.minDisks;
    if (val > config.maxDisks) val = config.maxDisks;
    setDiskCount(val);
  }

  function handleTowerClick(index: number) {
    if (selectedTower === null) {
      if (towers[index].length === 0) {
        setMessage('Torre selecionada está vazia, escolha outra torre com discos.');
        return;
      }
      setSelectedTower(index);
      setMessage('Escolha uma torre para mover o disco.');
    } else {
      if (selectedTower === index) {
        setSelectedTower(null);
        setMessage('Seleção cancelada.');
        return;
      }
      if (canMove(towers[selectedTower], towers[index])) {
        const newTowers = towers.map(t => [...t]);
        const disk = newTowers[selectedTower].pop()!;
        newTowers[index].push(disk);
        setTowers(newTowers);
        setMoveCount(moveCount + 1);
        setSelectedTower(null);
        setMessage('');
        if (
          newTowers[1].length === diskCount ||
          newTowers[2].length === diskCount
        ) {
          setMessage(`Parabéns! Você venceu em ${moveCount + 1} movimentos! 🎉`);
        }
      } else {
        setMessage('Movimento inválido! Disco maior não pode ficar sobre menor.');
      }
    }
  }

  function renderDisk(size: number, key: number) {
    const width = 60 + (size - 1) * 15;
    const color = DISK_COLORS[(size - 1) % DISK_COLORS.length];
    return (
      <div
        key={key}
        style={{
          width: `${width}px`,
          height: '30px',
          backgroundColor: color,
          borderRadius: '5px',
          margin: '5px auto 0 auto',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          cursor: 'grab',
          transition: 'background-color 0.3s ease, transform 0.2s ease',
        }}
        aria-label={`Disco tamanho ${size}`}
        role="listitem"
      />
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#ecf0f1',
        fontFamily:
          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        userSelect: 'none',
        padding: '1rem',
      }}
    >
      <h1
        style={{
          fontWeight: 700,
          letterSpacing: '2px',
          textShadow: '2px 2px 5px rgba(0,0,0,0.3)',
          marginTop: '1rem',
          marginBottom: '0.5rem',
        }}
      >
        Torre de Hanoi
      </h1>
      <div
        aria-label="Controles do jogo"
        style={{
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          color: '#ecf0f1',
        }}
      >
        <label htmlFor="disk-count">Quantidade de discos:</label>
        <input
          id="disk-count"
          type="number"
          min={config.minDisks}
          max={config.maxDisks}
          value={diskCount}
          onChange={handleDiskCountChange}
          style={{
            width: '60px',
            fontSize: '1.1rem',
            borderRadius: '6px',
            border: 'none',
            padding: '5px 8px',
            textAlign: 'center',
          }}
          aria-describedby="disk-count-desc"
        />
        <span id="disk-count-desc">(mín {config.minDisks}, máx {config.maxDisks})</span>
        <button
          onClick={resetGame}
          style={{
            backgroundColor: '#1abc9c',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '30px',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: '#2c3e50',
            cursor: 'pointer',
            boxShadow: '0 5px 12px rgba(26,188,156,0.6)',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={e => ((e.currentTarget.style.backgroundColor = '#16a085'))}
          onMouseOut={e => ((e.currentTarget.style.backgroundColor = '#1abc9c'))}
          aria-label="Reiniciar jogo"
        >
          Iniciar Jogo
        </button>
      </div>
      <main
        role="main"
        aria-label="Jogo Torre de Hanoi"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          height: '400px',
          gap: '3rem',
          padding: '1rem 2rem',
          width: '100%',
          maxWidth: 900,
        }}
      >
        {towers.map((tower, index) => (
          <div
            key={index}
            className={selectedTower === index ? 'selected' : ''}
            role="list"
            aria-label={`Torre ${index + 1}`}
            tabIndex={0}
            onClick={() => handleTowerClick(index)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTowerClick(index);
              }
            }}
            style={{
              position: 'relative',
              width: '150px',
              height: '320px',
              backgroundColor: selectedTower === index ? '#2980b9' : '#34495e',
              borderRadius: '12px 12px 0 0',
              boxShadow: selectedTower === index ? '0 0 20px #1abc9c' : '0 8px 20px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column-reverse',
              padding: '0 10px 15px 10px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              outline: 'none'
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                width: '12px',
                height: '210px',
                backgroundColor: '#ecf0f1',
                borderRadius: '8px',
                transform: 'translateX(-50%)',
                boxShadow: 'inset 0 0 8px #7f8c8d',
              }}
            ></div>
            {tower
              .slice()
              .reverse()
              .map((diskSize, i) => renderDisk(diskSize, i))}
          </div>
        ))}
      </main>
      <div
        role="alert"
        aria-live="polite"
        style={{
          marginTop: '1.5rem',
          fontSize: '1.3rem',
          fontWeight: 700,
          color: '#2ecc71',
          textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
          minHeight: '36px',
          textAlign: 'center',
          maxWidth: '400px',
        }}
      >
        {message}
      </div>
      <div
        id="info"
        style={{
          marginTop: '1rem',
          fontWeight: 600,
          fontSize: '1.2rem',
          textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
          color: '#ecf0f1',
        }}
      >
        Movimentos: <span>{moveCount}</span>
      </div>
    </div>
  );
};

export default App;

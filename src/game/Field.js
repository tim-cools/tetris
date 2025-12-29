import {Stage, Layer, Rect, Text, Line} from 'react-konva';
import {useEffect, useState} from "react";

const gridLinesColor = "lightgray";
const gridCellsHorizontal = 10;
const gridCellsVertical = 20;
const blockHorizontal = 4;
const blockVertical = 4;
const gridHeight = window.innerHeight - 100;
const cellSize = gridHeight / gridCellsVertical;
const gridWidth = cellSize * gridCellsHorizontal;
const gridLeft = (window.innerWidth - gridWidth) / 2;
const gridRight = gridLeft + gridWidth;
const gridTop = 50;
const blockDefaultLeft = 3;

function rotate3(block) {
  const blocks = block.blocks;
  const rotated = [
    blocks[0], blocks[3], blocks[7], blocks[11],
    blocks[4], blocks[2], blocks[6], blocks[10],
    blocks[8], blocks[1], blocks[5], blocks[9],
    blocks[12], blocks[13], blocks[14], blocks[15]
  ];
  return {...block, blocks: rotated}
}

function rotate(block) {
  return {...block, blocks: block.rotated, rotated: block.blocks}
}

function rotate0(block) {
  return {...block}
}

const availableBlocks = [
  {color: "#7E6C5A", blocks: [0, 0, 0, 0,  0, 1, 1, 0,  0, 1, 1, 0,  0, 0, 0, 0], rotate: rotate0, top: -1}, //O
  {color: "#9966ff", blocks: [0, 0, 0, 0,  0, 0, 0, 0,  1, 1, 1, 1,  0, 0, 0, 0], rotate: rotate,  top: -2,
                    rotated: [0, 0, 1, 0,  0, 0, 1, 0,  0, 0, 1, 0,  0, 0, 1, 0]}, //l
  {color: "#2DA828", blocks: [0, 0, 0, 0,  0, 0, 1, 1,  0, 1, 1, 0,  0, 0, 0, 0], rotate: rotate,  top: -1,
                    rotated: [0, 0, 0, 0,  0, 0, 1, 0,  0, 0, 1, 1,  0, 0, 0, 1]}, //s
  {color: "#33A9A7", blocks: [0, 0, 0, 0,  0, 1, 1, 0,  0, 0, 1, 1,  0, 0, 0, 0], rotate: rotate,  top: -1,
                    rotated: [0, 0, 0, 0,  0, 0, 0, 1,  0, 0, 1, 1,  0, 0, 1, 0]}, //z
  {color: "#A75622", blocks: [0, 0, 0, 0,  0, 1, 1, 1,  0, 0, 1, 0,  0, 0, 0, 0], rotate: rotate3, top: -1}, //t
  {color: "#AAAAAA", blocks: [0, 0, 0, 0,  0, 1, 1, 1,  0, 1, 0, 0,  0, 0, 0, 0], rotate: rotate3, top: -1}, //J
  {color: "#BDA77C", blocks: [0, 0, 0, 0,  0, 1, 1, 1,  0, 0, 0, 1,  0, 0, 0, 0], rotate: rotate3, top: -1}, //L
];

const PreviewBlockLayer = (props) => {
  const {nextBlock} = props;

  const previewLeft = gridLeft - (5 * cellSize);
  const previewRight = gridLeft - cellSize;
  const previewHeight = 4 * cellSize;

  const shapes = [];

  for (let horizontal = 0 ; horizontal <= blockHorizontal ; horizontal++) {
    const offset = horizontal * cellSize;
    const points = [previewLeft + offset, gridTop, previewLeft + offset, gridTop + previewHeight];
    shapes.push(<Line points={points} stroke={gridLinesColor} strokeWidth={2} key={'h' + horizontal} />);
  }

  for (let vertical = 0 ; vertical <= blockVertical ; vertical++) {
    const offset = vertical * cellSize;
    const points = [previewLeft, gridTop + offset, previewRight, gridTop + offset];
    shapes.push(<Line points={points} stroke={gridLinesColor} strokeWidth={2} key={'v' + vertical} />);
  }

  if (nextBlock != null) {
    for (let horizontal = 0; horizontal < blockHorizontal; horizontal++) {
      for (let vertical = 0; vertical < blockVertical; vertical++) {
        const offsetHorizontal = previewLeft + horizontal * cellSize;
        const offsetVertical = gridTop + vertical * cellSize;
        const cell = nextBlock.blocks[horizontal + vertical * blockHorizontal];
        if (cell) {
          shapes.push(<Rect
            x={offsetHorizontal} y={offsetVertical}
            width={cellSize} height={cellSize}
            fill={nextBlock.color}
            key={'c' + horizontal + '.' + vertical}/>);
        }
      }
    }
  }

  return <Layer>
    {shapes}
  </Layer>;
}

const ScoreLayer = (props) => {
  const {score, level, lines, top, left} = props;
  console.log(score);

  const scoreLeft = gridLeft - (5 * cellSize);
  const scoreTop = gridTop + 5 * cellSize;
  const scoreWidth = 4 * cellSize;

  return <Layer>
    <Text x={scoreLeft} y={scoreTop}
          width={scoreWidth} height={20}
          text={`Score: ${score}`}
          fontSize={25}
          fontFamily="Helvetica"
          fill="#333"
          align="center" />
    <Text x={scoreLeft} y={scoreTop + 30}
          width={scoreWidth} height={20}
          text={`Level: ${level}`}
          fontSize={25}
          fontFamily="Helvetica"
          fill="#333"
          align="center" />
    <Text x={scoreLeft} y={scoreTop + 60}
          width={scoreWidth} height={20}
          text={`Lines: ${lines}`}
          fontSize={25}
          fontFamily="Helvetica"
          fill="#333"
          align="center" />
    <Text x={scoreLeft} y={scoreTop + 90}
          width={scoreWidth} height={20}
          text={`Top: ${top}`}
          fontSize={25}
          fontFamily="Helvetica"
          fill="#333"
          align="center" />
    <Text x={scoreLeft} y={scoreTop + 120}
          width={scoreWidth} height={20}
          text={`Left: ${top}`}
          fontSize={25}
          fontFamily="Helvetica"
          fill="#333"
          align="center" />
  </Layer>;
}

const BlocksLayer = (props) => {

  const {grid} = props;
  if (!grid) return <></>;

  const blocks = [];
  for (let horizontal = 0 ; horizontal < gridCellsHorizontal ; horizontal++) {
    for (let vertical = 0; vertical < gridCellsVertical ; vertical++) {
      const offsetHorizontal = gridLeft + horizontal * cellSize;
      const offsetVertical = gridTop + vertical * cellSize;
      const cell = grid[horizontal][vertical];
      if (cell.color) {
        blocks.push(<Rect
          x={offsetHorizontal} y={offsetVertical}
          width={cellSize} height={cellSize}
          fill={cell.color}
          key={'c' + horizontal + '.' + vertical} />);
      }
    }
  }

  return <Layer>
    {blocks}
  </Layer>;
}

const GameOverLayer = (props) => {
  const {gameOver} = props;
  if (!gameOver) return <></>;
  return <Layer>
    <Rect
      x={0}
      y={0}
      fill="#dddd"
      width={window.innerWidth}
      height={window.innerHeight} />
    <Text
      x={window.innerWidth / 2 - 100}
      y={window.innerHeight / 2 - 100}
      width={200}
      heigth={200}
      text="Game Over"
      fontSize={60}
      fontFamily="Helvetica"
      fill="#333"
      align="center" />
  </Layer>;
}

const GridLayer = () => {

  const lines = [];

  for (let horizontal = 0 ; horizontal <= gridCellsHorizontal ; horizontal++) {
    const offset = horizontal * cellSize;
    const points = [gridLeft + offset, gridTop, gridLeft + offset, gridTop + gridHeight];
    lines.push(<Line points={points} stroke={gridLinesColor} strokeWidth={2} key={'h' + horizontal} />);
  }

  for (let vertical = 0; vertical <= gridCellsVertical ; vertical++) {
    const offset = vertical * cellSize;
    const points = [gridLeft, gridTop + offset, gridRight, gridTop + offset];
    lines.push(<Line points={points} stroke={gridLinesColor} strokeWidth={2} key={'v' + vertical} />);
  }

  return <Layer>
    {lines}
  </Layer>;
};

const Controller = (props) => {

  const keyHandlers = {
    "ArrowLeft": () => blockLeft(),
    "ArrowRight": () => blockRight(),
    "ArrowDown": () => blockDown(),
    "ArrowUp": () => blockRotate(),
    " ": () => blockDropOrNewGame(),
  };
  const {setGameData} = props;
  const gameData = {...props.gameData};

  const [command, setCommand] = useState(null);
  const [elapsedPrevious, setElapsedPrevious] = useState(0);
  const [elapsed, setElapsed] = useState(() => new Date().getTime());

  useEffect(() => {
    const intervalTimeout = Math.pow(0.8 - ((gameData.level-1) * 0.007), gameData.level-1) * 1000; // 400;
    const interval = setInterval(() => {
      setElapsed(() => new Date().getTime())
    }, intervalTimeout) ;
    return () => clearInterval(interval);
  }, [elapsed]);

  useEffect(() => {
    const handleKey = (event) => {
      if (keyHandlers[event.key]) {
        setCommand(event.key);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [keyHandlers]);

  useEffect(() => {
    if (command) {
      keyHandlers[command]();
      setCommand(null);
    }
  }, [command, gameData]);

  let changed = false;

  function initialize(gameData) {
    if (gameData == null) {
      gameData = {};
    }
    gameData.score = 0;
    gameData.level = 1;
    gameData.lines = 0;
    gameData.initialized = true;
    gameData.gridSet = newGrid();
    gameData.gridView = newGrid();
    gameData.nextBlock = randomBlock();
    return gameData;
  }

  function clone(grid) {
    return grid.map(line => line.map(column => column));
  }

  function blockLeft() {
    if (canPlace(gameData.currentBlock, gameData.currentBlock.left - 1, gameData.currentBlock.top)) {
      gameData.currentBlock.left -= 1;
      addBlock(gameData.currentBlock);
      setGameData(gameData);
    }
  }

  function blockRight() {
    if (canPlace(gameData.currentBlock, gameData.currentBlock.left + 1, gameData.currentBlock.top)) {
      gameData.currentBlock.left += 1;
      addBlock(gameData.currentBlock);
      setGameData(gameData);
    }
  }

  function blockDown() {
    if (canPlace(gameData.currentBlock, gameData.currentBlock.left, gameData.currentBlock.top + 1)) {
      gameData.currentBlock.top = gameData.currentBlock.top + 1;
      gameData.score += 1;
      addBlock(gameData.currentBlock);
      setGameData(gameData);
    }
  }

  function blockDrop() {
    let top = gameData.currentBlock.top;
    while (canPlace(gameData.currentBlock, gameData.currentBlock.left, top + 1)) {
      top += 1;
    }

    if (top === gameData.currentBlock.top) return;
    gameData.score += (top - gameData.currentBlock.top) * 2;
    console.log("gameData.score: " + gameData.score);
    gameData.currentBlock.top = top;

    setGameData(gameData);
    setElapsed(new Date().getTime());
  }

  function blockDropOrNewGame() {
    if (gameData.gameOver) {
      return setGameData(initialize());
    }

    blockDrop();
  }

  function blockRotate() {
    const rotated = rotate(gameData.currentBlock);
    if (canPlace(rotated, rotated.left, rotated.top, false)) {
      gameData.currentBlock = rotated;
      addBlock(gameData.currentBlock);
      setGameData(gameData);
    }
  }

  function randomBlock() {
    const blockIndex = Math.floor(Math.random() * availableBlocks.length);
    return {left: blockDefaultLeft, ...availableBlocks[blockIndex]};
  }

  function rotate(block) {
    return block.rotate(block);
  }

  function canPlace(block, left, top, checkTop = false) {
    for (let cell = 0 ; cell < blockHorizontal * blockVertical ; cell++) {
      const cellHorizontal = cell % blockHorizontal + left;
      const cellVertical = Math.floor(cell / blockVertical) + top;
      if (block.blocks[cell] === 1) {
        if (cellHorizontal < 0 || cellHorizontal >= gridCellsHorizontal) return false;
        if ((checkTop && cellVertical < 0) || cellVertical >= gridCellsVertical) return false;
        if (cellVertical >= 0) {
          const cell = gameData.gridSet[cellHorizontal][cellVertical];
          if (cell.color) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function addBlock(block) {
    gameData.gridView = clone(gameData.gridSet);
    let collision = false;
    for (let cell = 0 ; cell < blockHorizontal * blockVertical ; cell++) {
      const cellHorizontal = cell % blockHorizontal + block.left;
      const cellVertical = Math.floor(cell / blockVertical) + block.top;
      if (cellVertical < 0) continue;
      if (block.blocks[cell] === 1) {
        if (gameData.gridSet[cellHorizontal][cellVertical].color) {
          collision = true;
        }
        gameData.gridView[cellHorizontal][cellVertical] = {color: block.color};
      }
    }
    return collision;
  }

  function fixBlock(block) {
    for (let cell = 0 ; cell < blockHorizontal * blockVertical ; cell++) {
      const cellHorizontal = cell % blockHorizontal + block.left;
      const cellVertical = Math.floor(cell / blockVertical) + block.top;
      if (block.blocks[cell] === 1) {
        gameData.gridSet[cellHorizontal][cellVertical] = {color: block.color};
      }
    }
    gameData.gridView = clone(gameData.gridSet);
  }

  function newGrid() {
    const grid = new Array(gridCellsHorizontal);
    for (let horizontal = 0; horizontal < gridCellsHorizontal; horizontal++) {
      grid[horizontal] = new Array(gridCellsVertical);
      for (let vertical = 0; vertical < gridCellsVertical; vertical++) {
        grid[horizontal][vertical] = {};
      }
    }
    return grid;
  }

  function fullLine(grid, line) {
    for (let column = 0; column < gridCellsHorizontal; column++) {
      if (!grid[column][line].color) {
        return false;
      }
    }
    return true;
  }

  if (gameData.gameOver) return <></>;

  if (!gameData.initialized) {
    initialize(gameData);
    changed = true;
  }

  if (!gameData.currentBlock) {
    gameData.currentBlock = gameData.nextBlock;
    gameData.nextBlock = randomBlock();
    if (addBlock(gameData.currentBlock)) {
      gameData.gameOver = true;
    }
    changed = true;
  }

  function moveLinesUp(line) {
    for (let fillLine = line; fillLine > 1; fillLine--) {
      for (let column = 0; column < gridCellsHorizontal; column++) {
        gameData.gridSet[column][fillLine] = gameData.gridSet[column][fillLine - 1];
      }
    }
  }

  function clearFirstLine() {
    for (let column = 0; column < gridCellsHorizontal; column++) {
      gameData.gridSet[column][0] = {};
    }
  }

  function removeLine(line) {
    moveLinesUp(line);
    clearFirstLine();
    gameData.lines += 1;
  }

  function addLineScore(count) {
    if (count === 1) {
      gameData.score += (100 * gameData.level);
    } else if (count === 2) {
      gameData.score += (300 * gameData.level);
    } else if (count === 3) {
      gameData.score += (500 * gameData.level);
    } else if (count === 4) {
      gameData.score += (800 * gameData.level);
    }
  }

  function checkFullLines() {
    let line = gridCellsVertical - 1;
    let count = 0;
    while (line >= 0) {
      if (fullLine(gameData.gridSet, line)) {
        removeLine(line);
        count++;
      } else {
        line--;
      }
    }
    addLineScore(count);
  }

  if (elapsedPrevious !== elapsed) {
    setElapsedPrevious(elapsed);
    if (canPlace(gameData.currentBlock, gameData.currentBlock.left, gameData.currentBlock.top + 1)) {
      gameData.currentBlock.top += 1;
      addBlock(gameData.currentBlock);
    } else {
      fixBlock(gameData.currentBlock)
      gameData.currentBlock = null;
      checkFullLines();
    }
    changed = true;
  }

  const level = Math.floor(gameData.lines / 10) + 1;
  if (gameData.level !== level) {
    gameData.level = level;
  }

  if (changed) {
    setGameData(gameData);
  }

  return <></>;
};

export default function Field() {

  const [gameData, setGameData] = useState({});

  console.log(JSON.stringify(gameData.currentBlock));

  return <Stage width={window.innerWidth} height={window.innerHeight}>
    <Controller gameData={gameData} setGameData={setGameData} />
    <PreviewBlockLayer nextBlock={gameData.nextBlock} />
    <ScoreLayer score={gameData.score} level={gameData.level} lines={gameData.lines} top={gameData.currentBlock?.top} left={gameData.currentBlock?.left} />
    <GridLayer />
    <BlocksLayer grid={gameData.gridView} />
    <GameOverLayer gameOver={gameData.gameOver} />
  </Stage>
}
/* eslint-disable react/prop-types */
import { useState } from "react";

const winningCombos = [
  [0, 1, 2], // Horizontal
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // Vertical
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // Diagonal
  [2, 4, 6],
];

const determineStatus = (squares, xIsNext) => {
  const winner = calculateWinner(squares);
  if (winner) return `Winner: ${winner}`;
  if (squares.every((square) => square)) return "It's a draw!";
  return `Next player: ${xIsNext ? "X" : "O"}`;
};

const winningCombo = (squares) =>
  winningCombos.find(
    ([a, b, c]) =>
      squares[a] && squares[a] === squares[b] && squares[a] === squares[c]
  );

const calculateWinner = (squares) => {
  const combo = winningCombo(squares);
  return combo ? squares[combo[0]] : null;
};

const getHistoryText = (move, currentMove) => {
  if (move === 0 && move === currentMove) return "Game start";
  if (move === 0) return "Go to game start";
  if (move === currentMove) return `Viewing move #${move}`;
  return `Go to move #${move}`;
};

const Square = ({ active, index, value, onSquareClick }) => {
  return (
    <button
      className="square"
      data-active={active}
      onClick={() => onSquareClick(index)}
    >
      {value}
    </button>
  );
};

const Board = ({ xIsNext, squares, onPlay }) => {
  const handleClick = (i) => {
    if (calculateWinner(squares) || squares[i]) return;
    const row = Math.floor(i / 3);
    const col = i % 3;
    const player = xIsNext ? "X" : "O";
    console.log(`${player} clicked (${row}, ${col})`);
    onPlay(squares.toSpliced(i, 1, player));
  };

  const combo = winningCombo(squares);

  return (
    <div className="game-board">
      <div className="status">{determineStatus(squares, xIsNext)}</div>
      <div className="board">
        {squares.map((value, index) => (
          <Square
            key={index}
            active={combo && combo.includes(index)}
            index={index}
            value={value}
            onSquareClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
};

const HistoryEntry = ({ move, currentMove, onClick }) => {
  if (move === currentMove) {
    return getHistoryText(move, currentMove);
  }
  return <button onClick={onClick}>{getHistoryText(move)}</button>;
};

const History = ({ currentMove, history, setCurrentMove }) => {
  return (
    <div className="game-info">
      <ol>
        {history.map((_squares, move) => (
          <li key={move}>
            <HistoryEntry
              move={move}
              currentMove={currentMove}
              onClick={() => setCurrentMove(move)}
            />
          </li>
        ))}
      </ol>
    </div>
  );
};

const Game = () => {
  const [history, setHistory] = useState([new Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const onPlay = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  return (
    <div className="game">
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={onPlay} />
      <History
        history={history}
        currentMove={currentMove}
        setCurrentMove={setCurrentMove}
      />
    </div>
  );
};

export default Game;

/* eslint-disable react/prop-types */
import { useState } from "react";

function Square({ index, value, onSquareClick }) {
  return (
    <button className="square" onClick={() => onSquareClick(index)}>
      {value}
    </button>
  );
}

function determineStatus(squares, xIsNext) {
  const winner = calculateWinner(squares);
  if (winner) return `Winner: ${winner}`;
  return `Next player: ${xIsNext ? "X" : "O"}`;
}

function Board({ xIsNext, squares, onPlay }) {
  const handleClick = (i) => {
    if (calculateWinner(squares) || squares[i]) return;
    onPlay(squares.toSpliced(i, 1, xIsNext ? "X" : "O"));
  };

  let status = determineStatus(squares, xIsNext);

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((value, index) => (
          <Square
            key={index}
            index={index}
            value={value}
            onSquareClick={handleClick}
          />
        ))}
      </div>
    </>
  );
}

// eslint-disable-next-line no-unused-vars
const range = (start, end, step = 1) =>
  Array.from({ length: end - start }, (_, i) => start + i * step);

const vector = (n) => new Array(n).fill(null);

export default function Game() {
  const [history, setHistory] = useState([vector(9)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `Go to move #${move}`;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

function calculateWinner(squares) {
  for (let i = 0; i < winningCombos.length; i++) {
    const [a, b, c] = winningCombos[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

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
  return `Next player: ${xIsNext ? "X" : "O"}`;
};

const calculateWinner = (squares) => {
  for (let i = 0; i < winningCombos.length; i++) {
    const [a, b, c] = winningCombos[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const getHistoryText = (move) =>
  move > 0 ? `Go to move #${move}` : "Go to game start";

const Square = ({ index, value, onSquareClick }) => {
  return (
    <button className="square" onClick={() => onSquareClick(index)}>
      {value}
    </button>
  );
};

const Board = ({ xIsNext, squares, onPlay }) => {
  const handleClick = (i) => {
    if (calculateWinner(squares) || squares[i]) return;
    onPlay(squares.toSpliced(i, 1, xIsNext ? "X" : "O"));
  };

  return (
    <>
      <div className="status">{determineStatus(squares, xIsNext)}</div>
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
};

export default function Game() {
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
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={onPlay} />
      </div>
      <div className="game-info">
        <ol>
          {history.map((squares, move) => (
            <li key={move}>
              <button onClick={() => setCurrentMove(move)}>
                {getHistoryText(move)}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

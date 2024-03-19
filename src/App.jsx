/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import './App.css'


function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    
    const nextSquares = squares.slice();
    // Human player 'X'
    nextSquares[i] = 'X';

    const winner = calculateWinner(nextSquares);
    if (!winner) {
      const aiMove = findBestMove(nextSquares, 'O');
      nextSquares[aiMove] = 'O';
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner === "X") {
    status = 'Winner: You!';
  } else if (winner === "O") {
    status = 'Winner: AI!';
  } else if (!squares.includes(null)) {
    status = 'Draw!';
  }
    else {
    status = 'Go!';
  }

  return (
    <div className="game">
      <div className="board">
        {[0, 1, 2].map((row) => (
          <div key={row} className="board-row">
            {[0, 1, 2].map((col) => {
              const i = row * 3 + col;
              return <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />;
            })}
          </div>
        ))}
      </div>
      <div className="status">{status}</div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
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
      description = move;
    } else {
      description = '0';
    }
    return (
      <div key={move}>
        <button className="move" onClick={() => jumpTo(move)}>{description}</button>
      </div>
    );
  });

  return (
    <div className="game">
      <h1>Tic Tac Toe: "You will never win!"</h1>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="history">
        <div className="moves">
          Moves:
          {moves.map((move, index) => (
            <div key={index} className="move">{move}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Horizontal lines
      [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Vertical lines
      [0, 4, 8], [2, 4, 6]  // Diagonal lines
  ];

  for (const line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
      }
  }

  return null; // Return null if there is no winner
}

function minimax(squares, player) {
  const result = calculateWinner(squares);
  if (result) {
      return result === 'X' ? -10 : 10;
  } else if (!squares.includes(null)) {
      return 0;
  }

  if (player === 'O') {
      let bestScore = -Infinity;
      for (let i = 0; i < squares.length; i++) {
          if (squares[i] === null) {
              squares[i] = player;
              const score = minimax(squares, 'X');
              squares[i] = null;
              bestScore = Math.max(bestScore, score);
          }
      }
      return bestScore;
  } else {
      let bestScore = Infinity;
      for (let i = 0; i < squares.length; i++) {
          if (squares[i] === null) {
              squares[i] = player;
              const score = minimax(squares, 'O');
              squares[i] = null;
              bestScore = Math.min(bestScore, score);
          }
      }
      return bestScore;
  }
}

function findBestMove(squares, player) {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
          squares[i] = 'O';
          const score = minimax(squares, 'X');
          squares[i] = null;
          
          if (score > bestScore) {
              bestScore = score;
              bestMove = i;
          }
      }
  }

  return bestMove;
}

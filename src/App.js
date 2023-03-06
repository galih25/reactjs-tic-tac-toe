import { useState } from "react";

function Square({ value, onSquareClick, isWinner }) {
  let className = "square";
  className = className + (isWinner ? " winner" : "");
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  //const [xIsNext, setXIsNext] = useState(true);
  //const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    //setSquares(nextSquare);
    //setXIsNext(!xIsNext);
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + (xIsNext ? "O" : "X");
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  let boardSquares = [];
  for (let row = 0; row < 3; row++) {
    let boardRow = [];
    for (let col = 0; col < 3; col++) {
      const id = row * 3 + col;
      const isWinner = winner == null ? false : winner.includes(id);
      console.log(row + " " + col + " " + id + " " + isWinner);
      boardRow.push(
        <Square
          key={id}
          value={squares[id]}
          onSquareClick={() => handleClick(id)}
          isWinner={isWinner}
        />
      );
    }
    boardSquares.push(
      <div className="board-row" key={row}>
        {boardRow}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardSquares}
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const currentSquare = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleSort() {
    setIsAscending(!isAscending);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Goto move #" + (move + 1);
    } else {
      description = "Goto game start";
    }

    return (
      <li key={move}>
        {move === currentMove ? (
          "You are at move #" + (move + 1)
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquare} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <p>Current Move: {currentMove + 1}</p>
        <ol>{isAscending ? moves : moves.reverse()}</ol>
        <button onClick={handleSort}>Toggle sort</button>
      </div>
    </div>
  );
}

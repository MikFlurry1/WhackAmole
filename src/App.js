import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [highScore, setHighScore] = useState(
    () => parseInt(localStorage.getItem("highScore")) || 0
  );
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");

  useEffect(() => {
    if (gameStarted === false) return;

    const holes = document.getElementsByClassName("hole");

    const handleClick = (event) => {
      if (event.target.classList.contains("chosenone")) {
        setScore(prev => prev + 1);
        event.target.classList.remove("chosenone");
      }
    };

    Array.from(holes).forEach(hole => {
      hole.addEventListener("click", handleClick);
    });

    const speedMap = {
      easy: 1000,
      medium: 600,
      hard: 350,
    };
    const moleSpeed = speedMap[difficulty];

    const moleInterval = setInterval(() => {
      Array.from(holes).forEach(hole => hole.classList.remove('chosenone'));
      const randomIndex = Math.floor(Math.random() * holes.length);
      holes[randomIndex].classList.add('chosenone');
    }, moleSpeed);

    const timerInterval = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          var gameover = document.getElementById("GAMEOVER");
          gameover.style.display = "block";
          clearInterval(timerInterval);
          clearInterval(moleInterval);
          if (score > highScore) {
            localStorage.setItem("highScore", score);
            setHighScore(score);
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(moleInterval);
      clearInterval(timerInterval);
      Array.from(holes).forEach(hole =>
        hole.removeEventListener("click", handleClick)
      );
    };
  }, [score, highScore, gameStarted, difficulty]);

  const onStartGame = () => { 
    setGameStarted(true); 
    setScore(0);
    setTime(30);
  };

  return (
    <div className="App">
      <header className="App-header bg">
        <h1 id="title">WHACK-A-MOLE</h1>
        {gameStarted && (<>
          <h2 id='GAMEOVER' style={{ display: "none" }}>GAME OVER</h2>
          <div className="game-board">
            <div className="hole" id="hole1"></div>
            <div className="hole" id="hole2"></div>
            <div className="hole" id="hole3"></div>
            <div className="hole" id="hole4"></div>
            <div className="hole" id="hole5"></div>
            <div className="hole" id="hole6"></div>
          </div>
          <p id="score">SCORE: {score}</p>
          <p id="timer">TIME: {time}</p>
          <p id="highScore">HIGH SCORE: {highScore}</p>
        </>)}

        {!gameStarted && (
          <>
            <select 
              name="difficulty" 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">EASY</option>
              <option value="medium">MEDIUM</option>
              <option value="hard">HARD</option>
            </select>
            <button onClick={onStartGame}>START GAME</button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;


import React, { useState } from "react"
import { AppContext } from "../App"

function GameOver() {
  const { gameOver, currAttempt, correctWord, mode, onRestart } = React.useContext(AppContext)
  const [hasAccepted, setHasAccepted] = useState(false)
  const [noBtnPosition, setNoBtnPosition] = useState({ top: "0px", left: "0px" })
  const [isNoBtnEvasive, setIsNoBtnEvasive] = useState(false)

  // Makes the "No" button jump to a random location on hover/touch!
  const moveNoButton = () => {
    setIsNoBtnEvasive(true)
    const randomX = Math.floor(Math.random() * 200) - 100 // -100px to +100px
    const randomY = Math.floor(Math.random() * 100) - 50   // -50px to +50px
    setNoBtnPosition({ top: `${randomY}px`, left: `${randomX}px` })
  }

  // Generate background heart particles
  const hearts = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${3 + Math.random() * 4}s`,
    animationDelay: `${Math.random() * 2}s`,
    size: `${14 + Math.random() * 20}px`,
  }))

  if (mode === "normal") {
    const messages = ["Genius", "Magnificent", "Impressive", "Splendid", "Great", "Phew"]
    const result = gameOver.guessedWord
      ? messages[Math.max(0, currAttempt.attempt - 1)]
      : `The word was ${correctWord}`

    return (
      <div className="game-over-container">
        <div className="game-over-card">
          <h2>{result}</h2>
          <p>{gameOver.guessedWord ? `Solved in ${currAttempt.attempt}/6` : "Better luck next time"}</p>
          <button className="retry-button" onClick={onRestart}>
            Play Again
          </button>
        </div>
      </div>
    )
  }

  if (!gameOver.guessedWord) {
    return (
      <div className="game-over-container">
        <div className="game-over-card">
          <button className="retry-button" onClick={onRestart}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="proposal-container">
      {/* Floating Hearts Animation */}
      <div className="hearts-overlay">
        {hearts.map((h) => (
          <span
            key={h.id}
            className="floating-heart"
            style={{
              left: h.left,
              animationDuration: h.animationDuration,
              animationDelay: h.animationDelay,
              fontSize: h.size,
            }}
          >
            ❤️
          </span>
        ))}
      </div>

      {hasAccepted ? (
        <div className="proposal-accepted">
          <h2 className="proposal-title">She Said Yes! 💖💍</h2>
          <p className="proposal-subtitle">Here's to forever! ✨</p>
        </div>
      ) : (
        <div className="proposal-card">
          <h2 className="proposal-title">Will you marry me?</h2>

          {/* Engagement Ring Box Illustration */}
          <div className="ring-box-wrapper">
            <div className="ring-box">
              <div className="sparkle sparkle-1">✨</div>
              <div className="sparkle sparkle-2">✨</div>
              <div className="ring-diamond">💎</div>
              <div className="ring-cushion"></div>
            </div>
          </div>

          <div className="proposal-buttons">
            <button
              className="btn-yes"
              onClick={() => setHasAccepted(true)}
            >
              YES! 💖
            </button>
            <button
              className="btn-no"
              style={{
                position: isNoBtnEvasive ? "relative" : "static",
                top: noBtnPosition.top,
                left: noBtnPosition.left,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
            >
              NO
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameOver

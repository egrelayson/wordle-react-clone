import React, { useContext, useEffect } from "react"

import { AppContext } from "../App"
import { LetterStatus } from "../helpers"

type Props = {
  letterPos: number
  attemptVal: number
}

function Letter({ letterPos, attemptVal }: Props) {
  const {
    board,
    boardStatus,
    currAttempt,
    correctWord,
    letterStatus,
    setLetterStatus,
  } = useContext(AppContext)
  const letter = board[attemptVal][letterPos]

  // compute color
  let letterState = ""
  let status = LetterStatus.Unknown

  if (currAttempt.attempt > attemptVal) {
    status = boardStatus[attemptVal][letterPos]

    switch (status) {
      case LetterStatus.Letter:
        letterState = "almost"
        break
      case LetterStatus.LetterAndPosition:
        letterState = "correct"
        break
      case LetterStatus.Disabled:
        letterState = "error"
        break
      default:
        break
    }
  }

  const isSubmitted = currAttempt.attempt > attemptVal
  const shouldPop = Boolean(letter) && !isSubmitted

  useEffect(() => {
    if (currAttempt.attempt > attemptVal) {
      let newLetterStatus = new Map<string, LetterStatus>(letterStatus)
      const oldStatus = newLetterStatus.get(letter) || LetterStatus.Unknown
      const newStatus = boardStatus[attemptVal][letterPos]
      if (oldStatus < newStatus) {
        newLetterStatus.set(letter, newStatus)
        setLetterStatus(newLetterStatus)
      }
    }
  }, [
    currAttempt,
    letterStatus,
    attemptVal,
    boardStatus,
    letter,
    letterPos,
    setLetterStatus,
  ])

  return (
    <div
      key={letter || `empty-${attemptVal}-${letterPos}`}
      className={`letter${shouldPop ? " pop" : ""}${isSubmitted ? " flip" : ""}`}
      id={letterState}
      style={{
        animationDelay: isSubmitted ? `${letterPos * 250}ms` : undefined,
      }}
    >
      {letter}
    </div>
  )
}

export default Letter

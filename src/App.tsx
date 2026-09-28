import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react"

import "./App.css"

import {
  boardDefault,
  boardStatusDefault,
  computeGuessStatus,
  generateAcceptableWordSet,
  generateMainWordSet,
  getRandomItemFromSet,
  LetterStatus,
} from "./helpers"
import Board from "./components/Board"
import Keyboard from "./components/Keyboard"
import GameOver from "./components/GameOver"

export interface IWordleGameContext {
  mode: "normal" | "special"
  onRestart: () => void
  board: string[][]
  setBoard: Dispatch<SetStateAction<string[][]>>
  boardStatus: LetterStatus[][]
  setBoardStatus: Dispatch<SetStateAction<LetterStatus[][]>>
  currAttempt: { attempt: number; letterPos: number }
  setCurrAttempt: Dispatch<
    SetStateAction<{ attempt: number; letterPos: number }>
  >
  onDelete: () => void
  onEnter: () => void
  onSelectLetter: (key: string) => void
  correctWord: string
  letterStatus: Map<string, LetterStatus>
  setLetterStatus: Dispatch<SetStateAction<Map<string, LetterStatus>>>
  gameOver: { gameOver: boolean; guessedWord: boolean }
  setGameOver: Dispatch<
    SetStateAction<{ gameOver: boolean; guessedWord: boolean }>
  >
}

export const AppContext = createContext<IWordleGameContext>(
  {} as IWordleGameContext
)

type GameMode = "normal" | "special"

const GAME_CONFIG = {
  mode: "normal" as GameMode,
}

function App() {
  const [mode, setMode] = useState<GameMode>(GAME_CONFIG.mode)
  const modeRef = useRef(mode)
  const [board, setBoard] = useState(boardDefault)
  const [boardStatus, setBoardStatus] = useState(boardStatusDefault)
  const [currAttempt, setCurrAttempt] = useState({
    attempt: 0,
    letterPos: 0,
  })
  const [wordSet, setWordSet] = useState<Set<string>>(new Set())
  const [mainWordSet, setMainWordSet] = useState<Set<string>>(new Set())
  const [letterStatus, setLetterStatus] = useState(new Map())
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  })

  const [correctWord, setCorrectWord] = useState("MARRY")

  // generate set once (by empty deps)
  useEffect(() => {
    // this is the word bank of acceptable words
    generateAcceptableWordSet().then((words) => {
      setWordSet(words.wordSet)
    })
    generateMainWordSet().then((words) => {
      setMainWordSet(words.wordSet)
      if (modeRef.current === "normal") {
        setCorrectWord(getRandomItemFromSet(words.wordSet))
      }
    })
  }, [])

  const resetGame = (nextMode: GameMode = GAME_CONFIG.mode) => {
    modeRef.current = nextMode
    setMode(nextMode)
    setBoard(boardDefault.map((row) => [...row]))
    setBoardStatus(boardStatusDefault.map((row) => [...row]))
    setCurrAttempt({ attempt: 0, letterPos: 0 })
    setLetterStatus(new Map())
    setGameOver({ gameOver: false, guessedWord: false })
    if (nextMode === "normal" && mainWordSet.size > 0) {
      setCorrectWord(getRandomItemFromSet(mainWordSet))
    } else {
      setCorrectWord("MARRY")
    }
  }

  const onSelectLetter = (key: string) => {
    if (currAttempt.letterPos >= 5) return
    const newBoard = board.map((row) => [...row])
    newBoard[currAttempt.attempt][currAttempt.letterPos] = key
    setBoard(newBoard)
    setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos + 1 })
  }

  const onDelete = () => {
    if (currAttempt.letterPos === 0) return
    const newBoard = board.map((row) => [...row])
    newBoard[currAttempt.attempt][currAttempt.letterPos - 1] = ""
    setBoard(newBoard)
    setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos - 1 })
  }

  const onEnter = () => {
    if (currAttempt.letterPos !== 5) return

    let currWord = board[currAttempt.attempt].join("").toUpperCase()
    
    if (wordSet.size > 0 && !wordSet.has(currWord)) {
      return alert("Word not found")
    }

    // compute the status of the letters
    const newBoardStatus = [...boardStatus]
    newBoardStatus[currAttempt.attempt] = computeGuessStatus(
      currWord,
      correctWord
    )
    setBoardStatus(newBoardStatus)

    const nextAttemptCount = currAttempt.attempt + 1

    setCurrAttempt({
      attempt: nextAttemptCount,
      letterPos: 0,
    })

    if (currWord === correctWord) {
      setGameOver({
        gameOver: true,
        guessedWord: true,
      })
    } else if (nextAttemptCount === 6) {
      setGameOver({
        gameOver: true,
        guessedWord: false,
      })
    }
  }

  return (
    <div className="App">
      <nav>
        <h1>Wordle</h1>
      </nav>
      <AppContext.Provider
        value={{
          mode,
          onRestart: () => resetGame(),
          board,
          setBoard,
          boardStatus,
          setBoardStatus,
          currAttempt,
          setCurrAttempt,
          onDelete,
          onEnter,
          onSelectLetter,
          correctWord,
          letterStatus,
          setLetterStatus,
          gameOver,
          setGameOver,
        }}
      >
        <div className="game">
          <Board />
          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>
      </AppContext.Provider>
    </div>
  )
}

export default App

import { useCallback, useEffect, useState } from "react";
import "./App.css";
import words from "./WordList.json";
import HangmanDrawing from "./HangmanDrawing";
import HangmanWord from "./HangmanWord";
import Keyboard from "./Keyboard";

function App() {
  const [wordToGuess] = useState(() => {
    return words[Math.floor(Math.random() * words.length)];
  });

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const inCorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );
  console.log(wordToGuess);

  const isLoser = inCorrectLetters.length >= 6;
  const isWinner = wordToGuess
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isWinner || isLoser) return;
      setGuessedLetters((currentLetters) => [...currentLetters, letter]);
    },
    [guessedLetters, isWinner, isLoser]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessedLetter(key);
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessedLetters]);

  return (
    <>
      <div
        style={{
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          margin: "0 auto",
          alignItems: "center",
          zoom: 0.45
        }}
      >
        <div style={{ fontSize: "2rem", textAlign: "center", fontWeight: "bold", marginTop: "1rem" }}>
          <div
            style={{
              display: "flex",
              gap: ".5em",
              fontSize: "6rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              fontFamily: "monospace",
              marginBottom: "2rem",
            }}
          >
            HANGMAN GAME
          </div>
          {isWinner && "Congratulations! You won! - Refresh to try again."}
          {isLoser &&
            `Nice try! The word was "${wordToGuess}". - Refresh to try again.`}
          {!isWinner && !isLoser && "Guess the word!"}
        </div>
        <HangmanDrawing numberOfGuesses={inCorrectLetters.length} />
        <HangmanWord
          guessedLetters={guessedLetters}
          wordToGuess={wordToGuess}
        />
        <div style={{ alignSelf: "stretch" }}>
          <Keyboard
            activeLetters={guessedLetters.filter((letter) =>
              wordToGuess.includes(letter)
            )}
            inactiveLetters={inCorrectLetters}
            addGuessedLetter={addGuessedLetter}
            disabled={isWinner || isLoser}
          />
        </div>
      </div>
    </>
  );
}

export default App;

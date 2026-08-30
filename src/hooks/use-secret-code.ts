import { useEffect, useRef } from "react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const SECRET_WORDS = ["rickroll", "astley", "nevergonna"];

const SEQUENCES = [KONAMI_CODE, ...SECRET_WORDS.map((word) => word.split(""))];
const MAX_LENGTH = Math.max(...SEQUENCES.map((sequence) => sequence.length));

function endsWithSequence(buffer: string[], sequence: string[]): boolean {
  if (buffer.length < sequence.length) return false;
  const offset = buffer.length - sequence.length;
  return sequence.every((item, i) => buffer[offset + i] === item);
}

/**
 * Watches for the Konami code or a couple of typed words anywhere on the
 * page (input focus doesn't matter — nothing is prevented or intercepted)
 * and fires `onUnlock` once the sequence is completed.
 */
export function useSecretCode(onUnlock: () => void) {
  const bufferRef = useRef<string[]>([]);
  const onUnlockRef = useRef(onUnlock);

  useEffect(() => {
    onUnlockRef.current = onUnlock;
  }, [onUnlock]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const buffer = [...bufferRef.current, key].slice(-MAX_LENGTH);
      bufferRef.current = buffer;

      if (SEQUENCES.some((sequence) => endsWithSequence(buffer, sequence))) {
        bufferRef.current = [];
        onUnlockRef.current();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}


export function getColorIndicator(squareIndex, winner) {
  if (winner && winner.index.includes(squareIndex)) {
    return "green";
  } else if (winner) {
    return "red";
  }
  return null;
}

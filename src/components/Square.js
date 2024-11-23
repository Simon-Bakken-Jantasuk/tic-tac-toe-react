export function Square({ value, onSquareClick, color }) {
  return <button className={!color ? "square" : `square ${color}`} onClick={onSquareClick}>{value}</button>;
}

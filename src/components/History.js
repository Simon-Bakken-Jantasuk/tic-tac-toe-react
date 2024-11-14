export function History({ sort, moves, setSort }) {
  const handleClick = () => {
    setSort(!sort);
  };
  return (
    <div className="game-info">
      <button onClick={handleClick}>
        {sort ? "Sort in acending order" : "Sort in decending order"}
      </button>
      <ol>{sort ? moves.slice().reverse() : moves}</ol>
    </div>
  );
}

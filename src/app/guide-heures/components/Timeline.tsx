export default function Timeline() {
  const hours = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className="grid grid-cols-[200px_repeat(24,1fr)] bg-white text-xs text-gray-600 select-none border border-gray-300 rounded-t-lg">
      <div></div>
      {hours.map(h => (
        <div key={h} className="border-l border-gray-300 px-1 text-center py-1">
          {h}h
        </div>
      ))}
    </div>
  );
}

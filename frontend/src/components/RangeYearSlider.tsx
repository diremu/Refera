type Props = {
    min: number;
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void
}

const thumb =   "pointer-events-none absolute inset-0 h-6 w-full appearance-none bg-transparent " +
  "[&::-webkit-slider-runnable-track]:appearance-none [&::-moz-range-track]:bg-transparent " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none " +
  "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full " +
  "[&::-webkit-slider-thumb]:bg-[#0f172a] [&::-webkit-slider-thumb]:cursor-pointer " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 " +
  "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 " +
  "[&::-moz-range-thumb]:bg-[#0f172a] [&::-moz-range-thumb]:cursor-pointer";

export default function RangeYearSlider({ min, max, value, onChange }: Props) {
  const [start, end] = value;
  const pct = (year: number) => ((year - min) / (max - min)) * 100;

  return (
    <div className="px-3 pt-3 font-grotesk">
      <div className="flex justify-between text-sm font-medium">
        <span>{start}</span>
        <span>{end}</span>
      </div>

      <div className="relative mt-3 h-6">
        {/* full track */}
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded bg-gray-200" />
        {/* selected segment between the thumbs */}
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded bg-[#0f172a]"
          style={{ left: `${pct(start)}%`, width: `${pct(end) - pct(start)}%` }}
        />

        <input
          type="range"
          aria-label="Start year"
          min={min}
          max={max}
          value={start}
          onChange={(e) => onChange([Math.min(Number(e.target.value), end), end])}
          className={thumb}
          // when both thumbs reach the far right, keep the start thumb on top so it can still be dragged back
          style={{ zIndex: start > max - (max - min) / 10 ? 5 : 3 }}
        />
        <input
          type="range"
          aria-label="End year"
          min={min}
          max={max}
          value={end}
          onChange={(e) => onChange([start, Math.max(Number(e.target.value), start)])}
          className={thumb}
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
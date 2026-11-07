type Props = {
  min: number;
  max: number;
  value: [number, number];
  singleYear: boolean;
  onChange: (value: [number, number]) => void;
};

const thumb =
  "pointer-events-none absolute inset-0 h-6 w-full appearance-none bg-transparent " +
  "[&::-webkit-slider-runnable-track]:appearance-none [&::-moz-range-track]:bg-transparent " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none " +
  "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full " +
  "[&::-webkit-slider-thumb]:bg-[#0f172a] [&::-webkit-slider-thumb]:cursor-grab " +
  "[&::-webkit-slider-thumb]:transition-transform [&:active::-webkit-slider-thumb]:scale-125 " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 " +
  "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 " +
  "[&::-moz-range-thumb]:bg-[#0f172a] [&::-moz-range-thumb]:cursor-grab " +
  "[&::-moz-range-thumb]:transition-transform [&:active::-moz-range-thumb]:scale-125";

export default function RangeYearSlider({ min, max, value, singleYear, onChange }: Props) {
  const [start, end] = value;
  const ratio = (year: number) => (year - min) / (max - min);

  // the fill is one full-width bar, positioned and sized with transform only
  const fillOffset = singleYear ? 0 : ratio(start);
  const fillSize = singleYear ? 0 : ratio(end) - ratio(start);

  return (
    <div className="px-3 pt-3 font-grotesk">
      <div className="flex justify-between text-sm font-medium">
        {singleYear ? (
          <span className="mx-auto">{start}</span>
        ) : (
          <>
            <span>{start}</span>
            <span>{end}</span>
          </>
        )}
      </div>

      <div className="relative mt-3 h-6">
        {/* inset-x-2 (8px) = half a thumb, so 0%-100% of this track matches the thumb centres */}
        <div className="pointer-events-none absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 rounded bg-gray-200">
          <div
            className="absolute inset-y-0 w-full origin-left rounded bg-[#0f172a] will-change-transform"
            style={{ transform: `translateX(${fillOffset * 100}%) scaleX(${fillSize})` }}
          />
        </div>

        {singleYear ? (
          <input
            type="range"
            aria-label="Year"
            min={min}
            max={max}
            value={start}
            onChange={(e) => {
              const y = Number(e.target.value);
              onChange([y, y]);
            }}
            className={thumb}
          />
        ) : (
          <>
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
          </>
        )}
      </div>

      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
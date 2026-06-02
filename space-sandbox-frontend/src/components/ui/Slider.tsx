export const Slider = ({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
}: {
  label: string;
  value: number;
  min: string | number;
  max: string | number;
  step: string | number;
  displayValue: string;
  onChange: (val: number) => void;
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between">
      <label className="text-xs text-white/50 uppercase tracking-wider">{label}</label>
      <span className="text-xs font-mono">{displayValue}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-blue-500"
    />
  </div>
);

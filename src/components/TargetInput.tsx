import React from "react";

interface TargetInputProps {
  value: number;
  onChange: (value: number) => void;
}

export const TargetInput: React.FC<TargetInputProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="font-semibold" htmlFor="target-input">
        目標金額
      </label>
      <input
        id="target-input"
        type="number"
        min={1}
        className="w-32 px-2 py-1 border rounded text-center"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder="金額"
      />
      <span>千円</span>
    </div>
  );
};

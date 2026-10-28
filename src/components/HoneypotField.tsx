import React from 'react';

interface HoneypotFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Off-screen field that people never see or fill in; spam bots usually do,
 * which lets the API drop their submissions quietly.
 */
export default function HoneypotField({ value, onChange }: HoneypotFieldProps) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
      <label htmlFor="website-field">Leave this field empty</label>
      <input
        id="website-field"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

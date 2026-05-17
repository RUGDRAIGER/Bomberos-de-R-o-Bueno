export function SiNoField({
  label,
  value,
  onChange,
}: {
  label: string
  value?: string
  onChange: (v: 'SI' | 'NO') => void
}) {
  return (
    <div className="field">
      <label>{label} *</label>
      <div className="radio-row">
        {(['SI', 'NO'] as const).map((v) => (
          <label key={v}>
            <input type="radio" checked={value === v} onChange={() => onChange(v)} />
            {v}
          </label>
        ))}
      </div>
    </div>
  )
}

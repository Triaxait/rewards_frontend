export default function Input({
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  error,
}) {
  return (
    <div className="space-y-1">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full h-12 px-4 rounded-lg bg-white
          border ${error ? "border-red-500" : "border-border"}
          text-text placeholder:text-muted
          focus:outline-none focus:border-primary
        `}
      />
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

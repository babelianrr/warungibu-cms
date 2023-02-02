export default function InputLabel({id, error, label, boldLabel, className}) {
  return (
    <label
      htmlFor={id}
      className={`block text-sm font-medium ${error ? 'text-red-900' : 'text-gray-700'} ${
        boldLabel ? 'font-semibold' : ''
      } ${className}`}
    >
      {label}
    </label>
  )
}

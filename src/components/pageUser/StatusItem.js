export default function StatusItem({value, trueLabel, falseLabel}) {
  return (
    <p>
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        {value ? trueLabel : falseLabel}
      </span>
    </p>
  )
}

export default function ColoredLabel({color = 'green', text}) {
  const colorTable = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    blue: 'bg-blue-100 text-blue-800',
  }
  return (
    <span className={`p-2 inline-flex text-xs leading-5 font-semibold rounded-md ${colorTable[color]}`}>{text}</span>
  )
}

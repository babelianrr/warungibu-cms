import {formatSentenceCase} from 'helpers/formatter'
export default function StatusItem({type}) {
  const generateColor = (type) => {
    switch (type) {
      case 'valid':
        return 'bg-green-100 text-green-800'
      case 'request':
        return 'bg-yellow-100 text-yellow-800'
      case 'invalid':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <p>
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${generateColor(type)}`}>
        {formatSentenceCase(type)}
      </span>
    </p>
  )
}

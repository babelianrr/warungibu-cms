import {formatSentenceCase} from 'helpers/formatter'

export default function BaseItem({value}) {
  return <div className="text-sm text-gray-700">{formatSentenceCase(value)}</div>
}

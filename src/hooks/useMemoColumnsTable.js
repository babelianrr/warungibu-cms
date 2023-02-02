import {useMemo} from 'react'
import {formatSentenceCase} from '../helpers/formatter'

export default function useMemoColumsProduct(columns) {
  const data = useMemo(
    () =>
      columns.map((column) => ({
        Header: formatSentenceCase(column),
        accessor: column,
      })),
    [columns]
  )
  return data
}

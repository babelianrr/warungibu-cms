import {useMemo} from 'react'
import {BaseItem, StatusItem} from '../components/pageUser'

export default function useMemoTableAdmin(payload) {
  const data = useMemo(
    () =>
      payload.map((admin) => ({
        id: admin.id,
        name: <BaseItem value={admin.name} />,
        email: admin.email,
        status: <StatusItem value={admin.status} trueLabel={'Active'} falseLabel={'Inactive'} />,
      })),
    [payload]
  )
  return data
}

import {useMemo} from 'react'
import {BaseItem, StatusItem, ValidationItem, UserItem, ActionItem} from '../components/pageUser'

export default function useMemoTableUser(payload) {
  const data = useMemo(
    () =>
      payload.map((user) => ({
        id: user.id,
        name: <UserItem name={user.name} imageUrl={user.imageUrl} noKTP={user.noKTP} noNPWP={user.noNPWP} />,
        role: <BaseItem value={user.role} />,
        outletName: user.outletName,
        outletType: user.outletType,
        status: <StatusItem value={user.status} trueLabel="Active" falseLabel="Pending" />,
        documentValidation: <ValidationItem type={user.documentValidation} />,
        action: <ActionItem />,
      })),
    [payload]
  )
  return data
}

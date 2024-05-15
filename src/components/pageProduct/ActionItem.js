import {Link} from 'react-router-dom'

export default function ActionItem({id, payload}) {
  return (
    <div className="flex justify-between">
      <Link
        to={{
          pathname: `/products/${id}/edit`,
          state: payload,
        }}
        className="text-dnr-dark-orange hover:text-dnr-orange"
      >
        Edit
      </Link>
      |
      <Link
        to={{
          pathname: `/products/${id}/detail`,
          state: payload,
        }}
        className="text-dnr-dark-orange hover:text-dnr-orange"
      >
        Detail
      </Link>
    </div>
  )
}

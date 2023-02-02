export default function UserItem({name, photoUrl, email, customerId, noKTP, ...rest}) {
  return (
    <div className="flex flex-row space-x-2 items-center">
      <div className="flex-shrink-0 h-16 w-16">
        <img className="w-16" src={photoUrl} alt={name} />
      </div>
      <div className="flex flex-col space-y-1">
        <span className="text-dnr-dark-orange hover:text-dnr-orange cursor-pointer">{name}</span>
        <div className="text-xs text-left font-medium text-gray-500">No. KTP: {noKTP}</div>
        <div className="text-xs text-left font-medium text-gray-500">Customer Id: {customerId}</div>
        <div className="text-xs text-left font-medium text-gray-500">Email: {email}</div>
      </div>
    </div>
  )
}

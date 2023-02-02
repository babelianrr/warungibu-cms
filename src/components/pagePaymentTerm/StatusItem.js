export default function StatusItem({ status }) {
  if (!status || new Date(status) < Date.now())
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800`}>
        InActive
      </span>
    )

  return (
    <p>
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}>
        Active
      </span>
    </p>
  )
}

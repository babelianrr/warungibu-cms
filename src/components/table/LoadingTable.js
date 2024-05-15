import Skeleton from 'react-loading-skeleton'

export default function LoadingTable({col = 5, row = 3}) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {Array(col)
            .fill(0)
            .map((el, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border rounded-lg border-gray-200"
              >
                <Skeleton count="1" />
              </th>
            ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {Array(row)
          .fill(0)
          .map((el, index) => (
            <tr key={index + 'x'}>
              {Array(col)
                .fill(0)
                .map((el, index) => (
                  <td
                    key={index + 'b'}
                    className="px-6 py-4 text-sm whitespace-nowrap border rounded-lg border-gray-200"
                  >
                    <Skeleton count="1" />
                  </td>
                ))}
            </tr>
          ))}
      </tbody>
    </table>
  )
}

import {useHistory} from 'react-router-dom'

export default function ProductItem({product}) {
  const history = useHistory()

  return (
    <div className="flex flex-row space-x-2 items-center">
      <div className="flex-shrink-0 h-16 w-16">
        <img
          className="w-16"
          src={product.images[0]?.url || 'https://via.placeholder.com/300/F7FFFC'}
          alt={product.slug}
        />
      </div>
      <div className="flex flex-col space-y-3">
        <div className="text-sm text-left font-medium text-gray-500">No.SKU: {product.sku_number}</div>
        <span
          className="text-dnr-dark-orange hover:underline cursor-pointer"
          onClick={() => history.push(`/products/${product.id}/detail`)}
        >
          {product.name}
        </span>
        {/* <div className="w-1/4 px-4 text-center text-xs leading-5 font-semibold rounded-full bg-dnr-turqoise text-white">
            {category}
          </div> */}
      </div>
    </div>
  )
}

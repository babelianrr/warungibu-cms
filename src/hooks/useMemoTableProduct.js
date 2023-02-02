import {useMemo} from 'react'
import {ProductItem, NumberItem, StatusItem, ActionItem} from '../components/pageProduct'
import InputToggle from '../components/form/InputToggle'
import InputDiscount from '../components/pageProduct/InputDiscount'

import {currencyConverter} from '../helpers/formatter'

export default function useDataTableProduct(payload) {
  const data = useMemo(
    () =>
      payload.map((product) => ({
        id: product.id,
        name: (
          <ProductItem
            skuID={product.skuID}
            name={product.name}
            imageUrl={product.imageUrl}
            category={product.category}
            description={product.description}
          />
        ),
        price: <NumberItem value={currencyConverter(product.price)} />,
        discount: <InputDiscount value={product.discount} />,
        activePrice: <NumberItem value={currencyConverter(product.activePrice)} />,
        status: <StatusItem status={product.status} />,
        flashSale: <InputToggle value={product.flashSale} />,
        sold: <NumberItem value={product.sold} />,
        rating: <NumberItem value={product.rating} />,
        action: <ActionItem id={product.id} payload={product} />,
      })),
    [payload]
  )
  return data
}

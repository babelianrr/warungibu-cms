export default function currencyConverter(num) {
  // return `Rp. ${num.toLocaleString()}`
  // return new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR', minimumFractionDigits: 0}).format(num)
  return new Intl.NumberFormat({minimumFractionDigits: 0}).format(num)
}

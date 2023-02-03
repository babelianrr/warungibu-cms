import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export function formatCurrency(num) {
  if (!num) {
    return '-'
  }
  // return `Rp. ${num.toLocaleString()}`
  return `${num.toLocaleString()}`
}

export function formatSentenceCase(camelCase) {
  if (!camelCase) return camelCase
  const result = camelCase.replace(/([A-Z])/g, ' $1')
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1)
  return finalResult
}

export function formatQueryString(object) {
  const keys = Object.keys(object)
  if (keys.length === 0) return ''

  let queries = []
  for (let key in object) {
    if (object[key]) {
      queries.push(encodeURIComponent(key) + '=' + encodeURIComponent(object[key]))
    }
  }
  return '?' + queries.join('&')
}

export function formatDate(date, option = {}) {
  let formatCode = 'dd MMMM yyyy'

  return format(new Date(date), formatCode, { locale: id })
}

import {useState} from 'react'
// ! totalPage from backend?
export default function usePagination(totalPage = 10) {
  const [page, setPage] = useState(1)

  function nextPage() {
    if (page < totalPage) {
      setPage((prev) => prev + 1)
    }
  }
  function prevPage() {
    const MIN_PAGE = 1
    if (page > MIN_PAGE) {
      setPage((prev) => prev - 1)
    }
  }

  return {page, nextPage, prevPage}
}

import {useQuery} from 'react-query'
import {useParams} from 'react-router'
import {formatDistance} from 'date-fns'

import LoadingPage from 'components/base/LoadingPage'
import ErrorPage from 'components/base/ErrorPage'

import {getNewsBySlug} from 'API'

export default function NewsDetail() {
  const {slug} = useParams()

  const {data, isLoading, isError, error} = useQuery(['news', slug], () => getNewsBySlug(slug))

  if (isLoading) return <LoadingPage />
  if (isError) return <ErrorPage error={error} />

  return (
    <>
      <div className="max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Detail News</h1>
      </div>
      <section className="px-4 sm:px-0 sm:max-w-screen-lg lg:max-w-screen-lg xl:max-w-screen-4xl mx-auto">
        <div className="bg-gray-50 my-10 flex justify-center border">
          <img className="object-cover h-full w-full object-center" alt={data.title} src={data.image} />
        </div>
        <div className="text-sm text-gray-500 mb-10">
          <p className="text-dnr-bicart text-xl sm:text-2xl font-dayOne leading-7">{data.title}</p>
          <time dateTime={data.created_at}>
            {formatDistance(new Date(data.created_at), new Date(), {addSuffix: true})}
          </time>
        </div>
        <div className="mb-10">
          <Content content={data.content} />
        </div>
      </section>
    </>
  )
}

function Content({content}) {
  if (!content) return <span>-</span>

  return <p className="text-gray-600 mb-4 text-justify leading-relaxed" dangerouslySetInnerHTML={{__html: content}}></p>
}

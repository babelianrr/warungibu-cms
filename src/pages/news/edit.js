import {useState, useEffect} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {useForm} from 'react-hook-form'
import {useHistory, useParams} from 'react-router-dom'

import {Input, InputFile, InputTextRich} from 'components/form'
import {getNewsBySlug, editNews, createNewsImage} from 'API'

export default function NewsEditPage() {
  const history = useHistory()
  const queryClient = useQueryClient()
  const {slug, id} = useParams()
  const [data, setData] = useState({})
  const {register, handleSubmit} = useForm()
  const [images, setImages] = useState([])
  const [content, setContent] = useState('')

  // fetch by id
  useEffect(() => {
    async function fetch() {
      const news = await getNewsBySlug(slug)
      setData(news)
      setImages([
        {
          id: news.id,
          url: news.image,
        },
      ])
      setContent(news.content)
    }
    fetch()
  }, [id])

  // patch by id
  const {mutate} = useMutation((payload) => editNews(id, payload), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['news'])
      history.push('/news')
    },
  })

  // upload images
  const {mutate: mutateUploadImage, isLoading: isLoadingUpload} = useMutation(createNewsImage, {
    onSuccess: (image) => {
      setImages([image])
    },
  })

  const onSubmit = (payload) => {
    mutate({
      title: payload.title || data.title,
      content: content || data.content,
      image: images[0].url,
    })
  }

  return (
    <>
      <div className="max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Edit News</h1>
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div>
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <InputFile
                  label="Image"
                  name="image"
                  images={images}
                  setImages={setImages}
                  mutateUploadImage={mutateUploadImage}
                />
                <Input register={register} label="Title" name={'title'} type={'text'} defaultValue={data.title} />
                <InputTextRich
                  label="Content"
                  name={'content'}
                  value={content}
                  setValue={setContent}
                  defaultValue={content}
                />
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dnr-bicart focus:border-wi-blue"
                    onClick={() => history.goBack()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-wi-blue hover:bg-wi-dark-wi focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dnr-bicart focus:border-wi-blue"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

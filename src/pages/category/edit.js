import {useState, useEffect} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {useForm} from 'react-hook-form'
import {useHistory, useParams} from 'react-router-dom'

import {Input, InputFile} from 'components/form'
import {fetchCategoryById, fetchPatchCategory, fetchUploadCategory} from 'API'

export default function CategoryEditPage() {
  const history = useHistory()
  const queryClient = useQueryClient()
  const {id} = useParams()
  const [data, setData] = useState({})
  const {register, handleSubmit} = useForm()
  const [images, setImages] = useState([])

  // fetch by id
  useEffect(() => {
    async function fetch() {
      let category = await fetchCategoryById(id)
      setData(category)
      setImages([
        {
          id: category.id,
          url: category.icon_url,
        },
      ])
    }
    fetch()
  }, [id])

  // patch by id
  const {mutate} = useMutation((payload) => fetchPatchCategory(id, payload), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['categories'])
      history.push('/categories')
    },
  })

  // upload images
  const {mutate: mutateUploadImage, isLoading: isLoadingUpload} = useMutation(fetchUploadCategory, {
    onSuccess: (icon) => {
      setImages([icon])
    },
  })

  const onSubmit = (payload) => {
    mutate({
      name: payload.name || data.name,
      icon_url: images[0].url,
    })
  }

  return (
    <>
      <div className="max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Category</h1>
      </div>
      <div className="py-4 mx-auto">
        <div className="-my-2 overflow-x-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div>
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <Input register={register} label="Name" name={'name'} type={'text'} defaultValue={data.name} />
                <InputFile
                  label="Icon"
                  images={images}
                  setImages={setImages}
                  mutateUploadImage={mutateUploadImage}
                  isLoadingUpload={isLoadingUpload}
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

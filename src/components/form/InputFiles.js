import {PhotographIcon} from '@heroicons/react/outline'
import ImageUploading from 'react-images-uploading'

export default function UploadImage({
  label,
  images,
  isLoading,
  mutateUploadImage = () => {},
  mutateDeleteImage = () => {},
  handleDeleteImage = () => {},
  isLoadingDeleteImage,
  multiple = true,
  ...rest
}) {
  const maxNumber = 69

  const onChange = (imageList, addUpdateIndex) => {
    if (addUpdateIndex) {
      const formData = new FormData()

      imageList.forEach((image, indexImage) => {
        let check = false
        addUpdateIndex.forEach((index) => {
          if (indexImage === index) check = true
        })

        if (check) {
          formData.append('file', image.file)
        }
      })

      mutateUploadImage(formData)
    }
  }

  const onImageRemoveFn = (event, onImageRemove, imageList, index) => {
    event.preventDefault()

    const selectedImage = imageList[index]
    mutateDeleteImage({
      imageId: selectedImage.id,
    })
    handleDeleteImage(selectedImage.id)
  }

  if (isLoading) return <InputFileLoading />

  return (
    <>
      <ImageUploading multiple value={images} onChange={onChange} maxNumber={maxNumber} dataURLKey="url">
        {({imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps}) => (
          <div className="sm:col-span-6">
            <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            {imageList.length === 0 ? (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <PhotographIcon className="mx-auto h-12 w-12 text-gray-400" />
                  {/* triggred method upload */}
                  <button
                    style={isDragging ? {color: 'red'} : undefined}
                    onClick={(event) => {
                      event.preventDefault()
                      onImageUpload()
                    }}
                    {...dragProps}
                  >
                    <div className="flex text-sm text-gray-600">
                      <p className="text-sm relative cursor-pointer bg-white rounded-md font-medium text-dnr-turqoise hover:text-dnr-dark-turqoise focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-dnr-turqoise">
                        Upload images
                      </p>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                  </button>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            ) : (
              <>
                {/* Render images upload */}
                <div className="mt-1 flex px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md space-x-4">
                  {imageList.map((image, index) => (
                    <div key={index} className="flex flex-col space-y-2">
                      <img
                        src={
                          image.url[0] === '/' ? `${process.env.REACT_APP_PUBLIC_URL}/${image['url']}` : image['url']
                        }
                        alt=""
                        width="120"
                      />
                      {/* <button
                        className="bg-dnr-turqoise hover:bg-dnr-dark-turqoise text-white rounded-xl text-sm"
                        onClick={() => onImageUpdate(index)}
                      >
                        Update
                      </button> */}
                      {isLoadingDeleteImage ? (
                        <button className="bg-yellow-600 hover:bg-yellow-400 text-white rounded-xl text-sm py-1">
                          Loading
                        </button>
                      ) : (
                        <button
                          className="bg-red-600 hover:bg-red-400 text-white rounded-xl text-sm py-1"
                          onClick={(e) => onImageRemoveFn(e, onImageRemove, imageList, index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <button
                    style={isDragging ? {color: 'red'} : undefined}
                    onClick={(event) => {
                      event.preventDefault()
                      onImageUpload()
                    }}
                    {...dragProps}
                  >
                    <div className="flex text-sm text-gray-600">
                      <p className="text-sm relative cursor-pointer bg-white rounded-md font-medium text-dnr-turqoise hover:text-dnr-dark-turqoise focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-dnr-turqoise">
                        Upload more
                      </p>
                    </div>
                  </button>
                  {/* reset images upload */}
                  {/* <button onClick={onImageRemoveAll}>
                    <div>
                      <p className="text-sm relative cursor-pointer bg-white rounded-md font-medium text-dnr-turqoise hover:text-dnr-dark-turqoise focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-dnr-turqoise">
                        Remove all images
                      </p>
                    </div>
                  </button> */}
                </div>
              </>
            )}
          </div>
        )}
      </ImageUploading>
    </>
  )
}

function InputFileLoading() {
  return (
    <div className="sm:col-span-6">
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <div className="flex text-sm text-gray-600">
            <p className="text-sm relative cursor-pointer bg-white rounded-md font-medium text-dnr-turqoise hover:text-dnr-dark-turqoise focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-dnr-turqoise">
              Loading...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

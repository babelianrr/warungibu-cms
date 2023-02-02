import FadeLoader from 'react-spinners/FadeLoader'

export default function LoadingPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-screen flex justify-center items-center">
            <FadeLoader color={'#2394BA'} loading={true} size={150} />
          </div>
        </div>
      </div>
    </>
  )
}

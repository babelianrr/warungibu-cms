export default function ErrorPage(error = {}) {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-screen mx-auto">
            <h1>Something went wrong!!</h1>
            <p>{JSON.stringify(error)}</p>
          </div>
        </div>
      </div>
    </>
  )
}

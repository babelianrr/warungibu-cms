import Sidebar from '../base/Sidebar'

export default function MainLayout({children, ...rest}) {
  return (
    <div className="h-screen flex overflow-hidden bg-white">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative z-0 overflow-y-auto overflow-x-auto focus:outline-none">
          <div className="py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

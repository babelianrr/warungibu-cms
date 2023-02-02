export default function Button({
  children,
  className,
  type,
  padding = 'py-3 px-3',
  onClick = () => {},
  color = 'orange',
}) {
  const colorStyle = {
    orange:
      'bg-dnr-dark-orange border border-dnr-dark-orange hover:bg-dnr-dark-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dnr-dark-orange focus:border-dnr-dark-orange',
    turqoise:
      'bg-dnr-turqoise border border-dnr-dark-turqoise hover:bg-dnr-dark-turqoise focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dnr-turqoise focus:border-dnr-turqoise',
    bicart:
      'bg-wi-blue border border-wi-blue hover:bg-wi-dark-wi focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dnr-bicart focus:border-wi-blue',
  }
  if (type === 'disabled') {
    return (
      <button
        className={`border bg-gray-300 text-white cursor-not-allowed rounded-md ${padding} flex items-center justify-center  focus:outline-none ${className}`}
        onClick={onClick}
        disabled
      >
        {children}
      </button>
    )
  }

  if (type === 'processing') {
    return (
      <button
        className={`border bg-gray-300 text-white cursor-not-allowed rounded-md ${padding} flex items-center justify-center  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
        onClick={onClick}
        disabled
      >
        {/* TODO, bisa diganti jadi loading nanti */}
        Memproses Request
      </button>
    )
  }
  return (
    <button
      className={`border ${padding} rounded-md items-center text-white  hover:text-white transition-colors ease-in-out ${className} ${colorStyle[color]}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

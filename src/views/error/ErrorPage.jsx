const ErrorPage = ({ code = 404, message = 'Không tìm thấy trang', description = 'Trang bạn đang tìm kiếm không tồn tại.' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">{code}</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{message}</h2>
      <p className="text-gray-600 mb-8">{description}</p>
      <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Quay lại trang chủ
      </a>
    </div>
  )
}

export default ErrorPage

import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/components/ThemeProvider'

// A small background grid component
const GridShape = () => {
  return (
    <>
      <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
        <img
          src="/images/shape/grid-01.svg"
          alt="grid"
          onError={(e) => (e.target.style.display = 'none')}
        />
      </div>
      <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
        <img
          src="/images/shape/grid-01.svg"
          alt="grid"
          onError={(e) => (e.target.style.display = 'none')}
        />
      </div>
    </>
  )
}

const AuthLayout = () => {
  return (
    <div className="relative bg-white z-1 dark:bg-gray-900">
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="relative flex lg:flex-row w-full min-h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">
          <Outlet />

          <div className="lg:w-1/2 w-full h-full bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 dark:from-green-900 dark:via-green-950 dark:to-gray-950 lg:grid items-center hidden relative overflow-hidden min-h-screen">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <GridShape />
            </div>

            {/* Content */}
            <div className="relative items-center justify-center flex z-1 px-12">
              <div className="flex flex-col items-center max-w-lg">
                {/* Logo */}
                <div className="mb-6 rounded-2xl bg-white p-5 shadow-2xl">
                  {/* Using standard img since next/image is not available in vanilla React/Vite */}
                  <img
                    src="/images/logo/logo-nobackground.png"
                    alt="Nam Việt Logo"
                    className="w-[160px] h-[160px] object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/160?text=Logo"
                    }}
                  />
                </div>

                {/* Company Name */}
                <h1 className="mb-2 text-center text-2xl font-bold text-white">
                  CÔNG TY CỔ PHẦN HÓA SINH NAM VIỆT
                </h1>

                {/* Slogan */}
                <div className="mb-6 rounded-lg bg-white/10 backdrop-blur-sm px-6 py-3">
                  <p className="text-center text-lg font-semibold text-yellow-300">
                    "Nam Việt! Tuyệt chiêu của nhà nông!"
                  </p>
                </div>

                {/* Description */}
                <p className="mb-8 text-center text-base text-green-50">
                  Hệ thống quản lý nội bộ - Quản lý sản xuất, kho hàng, bán hàng
                  và tài chính
                </p>

                {/* Core Values */}
                <div className="w-full space-y-3">
                  <div className="flex items-start gap-3 rounded-lg bg-white/5 p-3 backdrop-blur-sm">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-500">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        Lấy chất lượng đặt lên hàng đầu
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg bg-white/5 p-3 backdrop-blur-sm">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        Cân bằng lợi ích: Công ty - Đại lý - Nông dân
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg bg-white/5 p-3 backdrop-blur-sm">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-500">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        Hợp tác liên kết cùng phát triển
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-center text-xs text-green-100">
                  <p>Quốc lộ 30, ấp Đông Mỹ, xã Mỹ Hội</p>
                  <p>Huyện Cao Lãnh, tỉnh Đồng Tháp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </div>
  )
}

export default AuthLayout

import { Button } from '@/components/custom/Button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { forgotPasswordSchema } from './schema'
import { IconArrowLeft } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Mock API action for forgot-password
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success(
        'Đã gửi mã OTP khôi phục mật khẩu. Vui lòng kiểm tra email của bạn.',
      )

      form.reset()
      return navigate('/reset-password')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi yêu cầu khôi phục mật khẩu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Khôi phục mật khẩu'
  }, [])

  const isAuthenticated = !!localStorage.getItem('accessToken')

  const checkAuthenticated = () => {
    if (isAuthenticated) {
      return navigate('/dashboard')
    }
  }

  useEffect(() => {
    checkAuthenticated()
  }, [])

  return (
    <div className="flex flex-1 flex-col lg:w-1/2">
      <div className="flex flex-1 flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-left">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Khôi phục mật khẩu
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Điền địa chỉ email vào bên dưới để có thể khôi phục mật khẩu
            </p>
          </div>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Email <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormMessage className="text-red-500 text-xs font-normal relative top-[1px]" />
                      </div>
                      <FormControl>
                        <Input
                          type="email"
                          autoFocus
                          autoComplete="off"
                          placeholder="Nhập địa chỉ email"
                          className="h-11 rounded-lg border-gray-300 focus:border-brand-500 focus:ring-brand-500"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                className="h-11 w-full rounded-lg bg-success-600 hover:bg-success-700 text-white font-medium text-base shadow-sm mt-4"
                disabled={loading}
              >
                Gửi yêu cầu khôi phục mật khẩu
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-xs font-medium text-gray-500">
                    HOẶC
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  to="/"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 inline-flex items-center justify-center transition-colors"
                >
                  <IconArrowLeft className="mr-2 h-4 w-4" /> Quay lại trang đăng
                  nhập
                </Link>
              </div>
            </form>
          </FormProvider>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Liên hệ quản trị viên nếu bạn gặp vấn đề.{' '}
              <a
                href="tel:0889881010"
                className="font-medium text-gray-900 hover:underline dark:text-white inline-block mt-1"
              >
                Hotline: 0889881010
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage

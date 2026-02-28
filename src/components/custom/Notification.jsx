import useSocketEvent from '@/hooks/UseSocketEvent'
import { toast } from 'sonner'

const Notification = () => {
  const eventHandlers = {
    create_invoice: (response) =>
      toast.success(`${response.message}`, { duration: 10000 }),
    update_invoice: (response) =>
      toast.success(`${response.message}`, { duration: 10000 }),
  }

  useSocketEvent(eventHandlers)

  return null
}

export default Notification

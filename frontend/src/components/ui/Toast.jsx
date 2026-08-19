import toast from 'react-hot-toast'

export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  loading: (message) => toast.loading(message),
  info: (message) => toast(message),
  promise: (promise, msgs) => toast.promise(promise, msgs),
  dismiss: (id) => toast.dismiss(id),
}

export default showToast

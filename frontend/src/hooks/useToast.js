import { toast } from 'react-toastify';

export const useToast = () => {
  const showToast = (message, type = 'success', options = {}) => {
    const defaultOptions = {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    };

    switch (type) {
      case 'success':
        toast.success(message, defaultOptions);
        break;
      case 'error':
        toast.error(message, defaultOptions);
        break;
      case 'warning':
        toast.warning(message, defaultOptions);
        break;
      case 'info':
        toast.info(message, defaultOptions);
        break;
      default:
        toast(message, defaultOptions);
    }
  };

  const showPromise = (promise, messages, options = {}) => {
    const defaultOptions = {
      position: 'top-right',
      autoClose: 3000,
      ...options,
    };
    return toast.promise(promise, messages, defaultOptions);
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  return { showToast, showPromise, dismissAll };
};
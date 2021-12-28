import { toast } from 'react-toastify';
import { getRespMessage } from '../global';
import { MESSAGES } from '../messages';

toast.configure({
  hideProgressBar: true,
  autoClose: false,
});

export const NOTIFICATION_TYPE = {
  success: 'success',
  error: 'error',
  warning: 'warn',
  info: 'info',
};

/**
 * Toast notification
 * @param type message type i.e. success | info | warn | error
 * @param message message to display
 */
const notification = (type: string, message: string, delay: number = 3000) => {
  switch (type) {
    case NOTIFICATION_TYPE.success:
      return toast.success(message, {
        onOpen: () => {
          setTimeout(() => {
            toast.dismiss();
          }, delay);
        },
      });
    case NOTIFICATION_TYPE.info:
      return toast.info(message, {
        onOpen: () => {
          setTimeout(() => {
            toast.dismiss();
          }, delay);
        },
      });
    case NOTIFICATION_TYPE.warning:
      return toast.warning(message, {
        onOpen: () => {
          setTimeout(() => {
            toast.dismiss();
          }, delay);
        },
      });
    case NOTIFICATION_TYPE.error:
      return toast.error(message, {
        onOpen: () => {
          setTimeout(() => {
            toast.dismiss();
          }, delay);
        },
      });
    default:
      return toast('Done!');
  }
};
/**
 * Display toast notification based on message type either success or error
 * @param resp api response
 * @param type message type i.e. success | error
 */
export const displayToast = (resp: any, type: string) => {
  if (type === 'success') {
    if (resp.hasOwnProperty('messages')) {
      notification(NOTIFICATION_TYPE.success, getRespMessage(resp.messages));
    } else {
      notification(NOTIFICATION_TYPE.success, MESSAGES.defaultSuccess);
    }
  } else if (type === 'error') {
    if (resp.hasOwnProperty('messages')) {
      notification(NOTIFICATION_TYPE.error, getRespMessage(resp.messages));
    } else {
      notification(NOTIFICATION_TYPE.error, MESSAGES.defaultError);
    }
  }
};

export default notification;

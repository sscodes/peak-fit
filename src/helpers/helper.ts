import { toast } from 'react-toastify';
import { notificationProperties } from './constants';

export const notifyError = (error: string) =>
  toast.error(error, notificationProperties);

export const notifySuccess = (message: string) =>
  toast.success(message, notificationProperties);

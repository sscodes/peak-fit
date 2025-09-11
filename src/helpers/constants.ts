import type { Theme, ToastPosition } from 'react-toastify';

export const notificationProperties = {
  position: 'top-right' as ToastPosition,
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
  theme: 'colored' as Theme,
};

// export const LOADING_COPIES = [
//   {
//     title: 'Loading TaskMate...',
//     subTitle: 'Mapping the steps to your future self',
//   },
//   {
//     title: 'Getting TaskMate ready...',
//     subTitle: 'Where big goals become daily action',
//   },
//   {
//     title: 'Starting TaskMate...',
//     subTitle: 'Turning ambition into a plan',
//   },
//   {
//     title: 'TaskMate is getting ready...',
//     subTitle: 'Your path to progress begins here',
//   },
//   {
//     title: 'Warming up your productivity engine...',
//     subTitle: 'Precision guidance, personalized for you',
//   },
//   {
//     title: 'Just a moment...',
//     subTitle: 'Crafting clarity from your chaos',
//   },
//   {
//     title: 'Almost there...',
//     subTitle: 'The journey from idea to action starts soon',
//   },
// ];

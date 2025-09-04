export const taskKeys = {
  all: ['tasks'],
  readTasks: () => [...taskKeys.all, 'readTasks'],
};

export const authKeys = {
  all: ['users'],
  createUser: () => [...authKeys.all, 'create-user'],
  deleteUser: () => [...authKeys.all, 'delete-user'],
  loginUser: () => [...authKeys.all, 'login-user'],
  updateUserPassword: () => [...authKeys.all, 'update-user-password'],
  sendOTPMail: () => [...authKeys.all, 'send-otp-mail'],
  checkOTP: () => [...authKeys.all, 'check-otp'],
  currentUser: () => [...authKeys.all, 'get-current-user'],
};

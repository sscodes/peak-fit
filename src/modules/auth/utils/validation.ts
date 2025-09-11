import * as yup from 'yup';

export const signUpValidation = yup.object().shape({
  fullName: yup
    .string()
    .min(3, 'Name cannot be less than 3 characters')
    .max(50, 'Name cannot be more than 50 characters')
    .required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
});

export const signInValidation = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const sendOTPMailValidation = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

export const otpValidation = yup.object().shape({
  otp: yup
    .string()
    .required('OTP is required')
    .matches(/^[0-9]+$/, 'OTP must contain only numbers')
    .length(6, 'OTP must be exactly 6 digits'),
});

export const forgotPasswordValidation = yup.object().shape({
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
});

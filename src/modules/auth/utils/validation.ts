import { object, ref, string } from 'yup';

export const signUpValidation = object().shape({
  fullName: string()
    .min(3, 'Name cannot be less than 3 characters')
    .max(50, 'Name cannot be more than 50 characters')
    .required('Name is required'),
  email: string().email('Invalid email').required('Email is required'),
  password: string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: string()
    .oneOf([ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
});

export const signInValidation = object().shape({
  email: string().email('Invalid email').required('Email is required'),
  password: string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const emailValidation = object().shape({
  email: string().email('Invalid email').required('Email is required'),
});

export const passwordResetValidation = object().shape({
  password: string().required('Password is required'),
  confirmPassword: string()
    .oneOf([ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
});

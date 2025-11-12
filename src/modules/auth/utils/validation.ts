import * as yup from 'yup';

export const signUpValidation = yup.object().shape({
  fullName: yup
    .string()
    .min(3, 'Name cannot be less than 3 characters')
    .max(50, 'Name cannot be more than 50 characters')
    .required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
});

export const signInValidation = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const emailValidation = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

export const passwordResetValidation = yup.object().shape({
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
});

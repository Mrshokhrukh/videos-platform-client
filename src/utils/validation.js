import * as yup from 'yup';

export const registerValidation = yup.object({
  fullName: yup
    .string()
    .min(4, 'kamida 5 ta bolsin')
    .required('fullName kiritish majburiy'),
  username: yup.string().required('username kiritish majburiy'),
  email: yup
    .string()
    .email('email xato ketdi')
    .required('email kiritish majburiy'),
  password: yup
    .string()
    .min(6, 'kamida 6 ta belgi bolishi majburiy')
    .required('Password kiritish majburiy')
    .matches(/[a-zA-Z0-9]{8,}/),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Password bilan togri tushmadi'),
});

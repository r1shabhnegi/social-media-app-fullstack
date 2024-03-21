import { RegisterTypes } from './pages/Register';
import { SignInTypes } from './pages/SignIn';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const register = async (formData: RegisterTypes) => {
  const response = await fetch(`${API_BASE_URL}/api/user/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Token invalid');
  }

  return response.json();
};

// export const signIn = async (formData: SignInTypes) => {
//   const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
//     method: 'POST',
//     credentials: 'include',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(formData),
//   });

//   if (!response.ok) {
//     throw new Error('sign-in failed');
//   }
//   return response.json();
// };

export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: 'include',
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Logout Failed');
  }
};

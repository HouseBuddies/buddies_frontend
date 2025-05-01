import { API } from '../api';

export async function sign_in(email: string, password: string) {
  const response = await API.post('/auth/sign_in', {
    email,
    password,
  });

  return response;
}

export async function sign_up(name: string, email: string, password: string) {
  const response = await API.post('/auth/sign_up', {
    name,
    email,
    password,
  });
  return response.data;
}
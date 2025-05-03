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

export async function sign_out(token: string) {
  const response = await API.post(
    '/auth/sign_out',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}

export async function fetchUserInfo(token: string) {
  const response = await API.get(`/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
import { API } from '../api';

export async function sign_in(email: string, password: string) {
  console.log(email, password);
  const response = await API.post('/auth/sign_in', {
    email,
    password,
  });
  console.log(response, "response");
  return response.data;
}

export async function sign_up(name: string, email: string, password: string) {
  const response = await API.post('/auth/sign_up', {
    name,
    email,
    password,
  });
  return response.data;
}
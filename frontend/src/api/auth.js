import axios from 'axios';
const API = process.env.REACT_APP_API || '';

export async function login(email, password){
  const r = await axios.post(`${API}/api/auth/login`, { email, password });
  return r.data;
}

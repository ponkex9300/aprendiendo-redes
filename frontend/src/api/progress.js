import axios from 'axios';
const API = process.env.REACT_APP_API || '';

export async function watch(videoId, token){
  const r = await axios.post(`${API}/api/progress/watch`, { videoId }, { headers: { Authorization: `Bearer ${token}` } });
  return r.data;
}

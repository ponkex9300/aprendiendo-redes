import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUrl } from '../api/videos';
import { watch } from '../api/progress';

export default function VideoPlayer(){
  const { id } = useParams();
  const [url,setUrl] = useState(null);
  const [showFinal,setShowFinal] = useState(false);
  const token = localStorage.getItem('token');
  const nav = useNavigate();

  useEffect(()=> {
    async function load(){
      const r = await getUrl(id, token);
      setUrl(r.url);
    }
    load();
  }, [id, token]);

  async function onEnded(){
    const r = await watch(Number(id), token);
    if (r.courseCompleted) setShowFinal(true);
  }

  return (
    <div>
      <h3>Reproductor</h3>
      {url ? (
        <video src={url} controls onEnded={onEnded} autoPlay style={{ width: '100%', maxWidth: 800 }} />
      ) : <p>Cargando...</p>}
      {showFinal && <button onClick={()=>nav('/dashboard')}>Curso finalizado</button>}
    </div>
  );
}

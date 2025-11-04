import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVideoUrl } from '../api/videos';
import { watch } from '../api/progress';
import { storage } from '../utils/storage';

export default function VideoPlayer(){
  const { id } = useParams();
  const [url,setUrl] = useState(null);
  const [showFinal,setShowFinal] = useState(false);
  const token = storage.getToken();
  const nav = useNavigate();

  useEffect(()=> {
    async function load(){
      const r = await getVideoUrl(token, id);
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

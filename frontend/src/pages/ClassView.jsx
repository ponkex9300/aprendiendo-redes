import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

export default function ClassView(){
  const { id } = useParams();
  const [modules, setModules] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(()=> {
    async function load(){
      const r = await axios.get(`${process.env.REACT_APP_API || ''}/api/student/classes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setModules(r.data.modules || []);
    }
    load();
  }, [id, token]);

  return (
    <div>
      <h3>Clase {id}</h3>
      {modules.map(m => (
        <div key={m.id}>
          <h4>{m.title}</h4>
          <ul>
            {(m.Videos || []).map(v => (
              <li key={v.id}><Link to={`/video/${v.id}`}>{v.title || `Video ${v.id}`}</Link></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

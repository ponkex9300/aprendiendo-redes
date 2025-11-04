// API helper functions for video management

export const getPresignedUploadUrl = async (token, data, isAdmin = false) => {
  const endpoint = isAdmin ? '/api/admin/videos/presign' : '/api/videos/presign';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error obteniendo URL de carga');
  }
  
  return res.json();
};

export const uploadVideoToS3 = (uploadUrl, file, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Error subiendo video: ${xhr.status}`));
      }
    });
    
    xhr.addEventListener('error', () => {
      reject(new Error('Error de red al subir video'));
    });
    
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
};

export const confirmVideoUpload = async (token, videoId, isAdmin = false) => {
  const endpoint = isAdmin ? '/api/admin/videos/confirm' : '/api/videos/confirm';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ videoId })
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error confirmando subida');
  }
  
  return res.json();
};

export const getVideoUrl = async (token, videoId) => {
  const res = await fetch(`/api/videos/${videoId}/url`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error obteniendo URL del video');
  }
  
  return res.json();
};

export const getVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    
    video.onerror = () => {
      reject(new Error('Error al leer el archivo de video'));
    };
    
    video.src = URL.createObjectURL(file);
  });
};

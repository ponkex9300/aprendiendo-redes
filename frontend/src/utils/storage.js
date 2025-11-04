// Utility para manejar almacenamiento por pestaña (sessionStorage)
// Esto permite que cada pestaña del navegador mantenga su propia sesión independiente

export const storage = {
  setToken: (token) => {
    sessionStorage.setItem('token', token);
  },
  
  getToken: () => {
    return sessionStorage.getItem('token');
  },
  
  removeToken: () => {
    sessionStorage.removeItem('token');
  },
  
  setUser: (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser: () => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  removeUser: () => {
    sessionStorage.removeItem('user');
  },
  
  clear: () => {
    sessionStorage.clear();
  }
};

import axios from 'axios';

export const api = axios.create({
  // Pega a URL do .env.local de forma automática. Se falhar, usa o localhost por padrão.
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

// Interceptor ajustado para garantir tipagem e envio limpo do cabeçalho
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('@erp:token');
      
      if (token) {
        // Inicializa o objeto de headers caso ele esteja indefinido
        config.headers = config.headers || {};
        // Define o cabeçalho exatamente como o seu authMiddleware espera receber
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
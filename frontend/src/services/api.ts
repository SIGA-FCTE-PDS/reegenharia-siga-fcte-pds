import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Interceptor para pegar os erros do Spring Boot de forma padronizada
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const mensagemErro = error.response?.data?.mensagem || 'Erro inesperado de conexão com o servidor';
        console.error('⚠️ Erro na API:', mensagemErro);
        return Promise.reject(error);
    }
);
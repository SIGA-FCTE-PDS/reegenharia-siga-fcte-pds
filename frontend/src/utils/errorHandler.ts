import axios from 'axios';

/**
 * Extrai a mensagem de erro do backend de forma inteligente.
 * Cobre os formatos mais comuns do Spring Boot:
 * - { message: "..." }
 * - { error: "..." }
 * - string pura
 * - erros de rede (sem conexão)
 */
export function extractErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
        const data = err.response?.data;

        // Spring Boot lança { message: "Turma lotada" } ou { error: "..." }
        if (typeof data === 'object' && data !== null) {
            if (typeof data.message === 'string' && data.message) return data.message;
            if (typeof data.error === 'string' && data.error) return data.error;
            if (typeof data.detail === 'string' && data.detail) return data.detail;
        }

        // Resposta em texto puro
        if (typeof data === 'string' && data) return data;

        // Sem resposta — problema de rede/CORS
        if (!err.response) return 'Sem conexão com o servidor. Verifique se o backend está rodando.';

        // Fallback pelo status HTTP
        const status = err.response.status;
        if (status === 400) return 'Dados inválidos. Verifique os campos e tente novamente.';
        if (status === 404) return 'Recurso não encontrado.';
        if (status === 409) return 'Conflito: o registro já existe ou viola uma regra do sistema.';
        if (status === 500) return 'Erro interno do servidor. Tente novamente mais tarde.';
    }

    if (err instanceof Error) return err.message;

    return 'Ocorreu um erro inesperado.';
}
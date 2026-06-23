import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' },
});

// ─── AUTH ─────────────────────────────────────────────────
export const loginProfessor = (id: number) =>
    api.get(`/api/professores/${id}`);

export const loginAluno = (matricula: string) =>
    api.get(`/api/alunos/${matricula}`);

// ─── ALUNOS → /api/alunos ─────────────────────────────────
export const getAlunos  = () => api.get('/api/alunos');
export const getAluno   = (matricula: string) => api.get(`/api/alunos/${matricula}`);
export const criarAluno = (payload: object)   => api.post('/api/alunos', payload);
export const deletarAluno = (matricula: string) => api.delete(`/api/alunos/${matricula}`);

// ─── PROFESSORES → /api/professores ───────────────────────
export const getProfessores = () => api.get('/api/professores');
export const getProfessor   = (id: number) => api.get(`/api/professores/${id}`);

// ─── DISCIPLINAS → /api/disciplinas ───────────────────────
export const getDisciplinas = () => api.get('/api/disciplinas');

// ─── TURMAS → /api/turmas ─────────────────────────────────
export const getTurmas     = () => api.get('/api/turmas');
export const getTurma      = (id: number) => api.get(`/api/turmas/${id}`);
export const criarTurma    = (payload: object) => api.post('/api/turmas', payload);
export const deletarTurma = (id: number) => api.delete(`/api/turmas/${id}`);

// ─── MATRÍCULAS ───────────────────────────────────────────
export const getMatriculas = () =>
    api.get('/api/matriculas');

export const getMatriculasPorTurma = (turmaId: number) =>
    api.get(`/api/turmas/${turmaId}/matriculas`);

export const realizarMatricula = (payload: { alunoMatricula: string; turmaId: number }) =>
    api.post('/api/turmas/matriculas', payload);

export const cancelarMatricula = (id: number) =>
    api.delete(`/api/matriculas/${id}`);

// ─── BOLETIM → /api/boletim ───────────────────────────────
export const lancarNota = (payload: { alunoMatricula: string; avaliacaoId: number; valor: number }) =>
    api.post('/api/boletim/notas', payload);

export const getNotasPorAlunoETurma = (matriculaAluno: string, turmaId: number) =>
    api.get('/api/boletim/notas', { params: { matriculaAluno, turmaId } });

// ─── NOTIFICAÇÕES → /api/notificacoes ─────────────────────
export const getNotificacoesAluno = (matriculaAluno: string) =>
    api.get(`/api/notificacoes/aluno/${matriculaAluno}`);

export default api;
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' },
});

// ─── AUTH ────────────────────────────────────────────────
export const loginProfessor = (email: string) =>
    api.get(`/professores/email/${email}`);

export const loginAluno = (matricula: string) =>
    api.get(`/alunos/${matricula}`);

// ─── ALUNOS ──────────────────────────────────────────────
export const getAlunos = () =>
    api.get('/alunos');

export const getAluno = (matricula: string) =>
    api.get(`/alunos/${matricula}`);

export const criarAluno = (payload: {
    matricula: string;
    nome: string;
    cpf: string;
    email: string;
    curso: string;
    telefone?: string;
    status: string;
}) => api.post('/alunos', payload);

export const atualizarAluno = (matricula: string, payload: object) =>
    api.put(`/alunos/${matricula}`, payload);

export const deletarAluno = (matricula: string) =>
    api.delete(`/alunos/${matricula}`);

// ─── TURMAS ──────────────────────────────────────────────
export const getTurmas = () =>
    api.get('/turmas');

export const getTurma = (id: number) =>
    api.get(`/turmas/${id}`);

export const criarTurma = (payload: {
    codigoTurma: string;
    semestreLetivo: string;
    sala?: string;
    horario?: string;
    capacidadeMaxima: number;
    modalidade?: string;
    disciplinaCodigo: string;
    professorId: number;
}) => api.post('/turmas', payload);

export const atualizarTurma = (id: number, payload: object) =>
    api.put(`/turmas/${id}`, payload);

export const deletarTurma = (id: number) =>
    api.delete(`/turmas/${id}`);

// ─── MATRÍCULAS ──────────────────────────────────────────
export const getMatriculas = () =>
    api.get('/matriculas');

export const realizarMatricula = (payload: {
    alunoMatricula: string;
    turmaId: number;
}) => api.post('/matriculas', payload);

export const cancelarMatricula = (id: number) =>
    api.delete(`/matriculas/${id}`);

// ─── PROFESSOR ───────────────────────────────────────────
export const getTurmasProfessor = (professorId: number) =>
    api.get(`/turmas/professor/${professorId}`);

export const getAvaliacoesTurma = (turmaId: number) =>
    api.get(`/avaliacoes/turma/${turmaId}`);

export const getAlunosTurma = (turmaId: number) =>
    api.get(`/matriculas/turma/${turmaId}`);

export const lancarNota = (payload: {
    alunoMatricula: string;
    avaliacaoId: number;
    valor: number;
}) => api.post('/notas', payload);

export const lancarFalta = (payload: {
    alunoMatricula: string;
    turmaId: number;
    data: string;
    presente: boolean;
}) => api.post('/frequencias', payload);

// ─── ALUNO ───────────────────────────────────────────────
export const getNotificacoesAluno = (matricula: string) =>
    api.get(`/notificacoes/aluno/${matricula}`);

export default api;
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' },
});

// ─── AUTH ──────────────────────────────────────────────────────────
// Professor loga com ID numérico → GET /api/professores/{id}
export const loginProfessor = (id: number) =>
    api.get(`/api/professores/${id}`);

// Aluno loga com matrícula → GET /api/alunos/{matricula}
export const loginAluno = (matricula: string) =>
    api.get(`/api/alunos/${matricula}`);

// ─── ALUNOS → /api/alunos ──────────────────────────────────────────
export const getAlunos    = ()                   => api.get('/api/alunos');
export const getAluno     = (matricula: string)  => api.get(`/api/alunos/${matricula}`);
export const criarAluno   = (payload: object)    => api.post('/api/alunos', payload);
export const deletarAluno = (matricula: string)  => api.delete(`/api/alunos/${matricula}`);

// ─── PROFESSORES → /api/professores ────────────────────────────────
export const getProfessores = ()           => api.get('/api/professores');
export const getProfessor   = (id: number) => api.get(`/api/professores/${id}`);

// ─── DISCIPLINAS → /api/disciplinas ────────────────────────────────
export const getDisciplinas = () => api.get('/api/disciplinas');

// ─── TURMAS → /api/turmas ──────────────────────────────────────────
export const getTurmas    = ()               => api.get('/api/turmas');
export const criarTurma   = (p: object)      => api.post('/api/turmas', p);
export const deletarTurma = (id: number)     => api.delete(`/api/turmas/${id}`);

// ─── MATRÍCULAS ────────────────────────────────────────────────────
// Listar todas as matrículas (Usado na MatriculasPage)
export const getMatriculas = () =>
    api.get('/api/matriculas');

// Cancelar uma matrícula (Usado na MatriculasPage)
export const cancelarMatricula = (id: number) =>
    api.delete(`/api/matriculas/${id}`);

// Listar alunos de uma turma específica
export const getMatriculasPorTurma = (turmaId: number) =>
    api.get(`/api/turmas/${turmaId}/matriculas`);

// Matricular aluno em uma turma
export const realizarMatricula = (payload: { alunoMatricula: string; turmaId: number }) =>
    api.post('/api/turmas/matriculas', payload);

// ─── BOLETIM & DESEMPENHO → /api/boletim ───────────────────────────
// Professor lança nota
export const lancarNota = (payload: { alunoMatricula: string; avaliacaoId: number; valor: number }) =>
    api.post('/api/boletim/notas', payload);

// Essa função atende o ProfessorDashboard (pesquisa explícita)
export const getNotasPorAlunoETurma = (matriculaAluno: string, turmaId: number) =>
    api.get('/api/boletim/notas', { params: { matriculaAluno, turmaId } });

// Essa função atende o AlunoDashboard
export const getNotas = (matriculaAluno: string, turmaId: number) =>
    api.get('/api/boletim/notas', { params: { matriculaAluno, turmaId } });

// ─── FREQUÊNCIA → /api/frequencias ─────────────────────────────────
// Professor registra presença/falta
export const registrarFrequencia = (payload: {
    alunoMatricula: string;
    turmaId: number;
    data: string;
    presente: boolean;
}) => api.post('/api/frequencias', payload);

// Aluno consulta o seu histórico de frequências/faltas
export const getFrequencias = (matriculaAluno: string, turmaId: number) =>
    api.get('/api/frequencias', { params: { matriculaAluno, turmaId } });

// ─── NOTIFICAÇÕES → /api/notificacoes ──────────────────────────────
export const getNotificacoesAluno = (matriculaAluno: string) =>
    api.get(`/api/notificacoes/aluno/${matriculaAluno}`);

export default api;
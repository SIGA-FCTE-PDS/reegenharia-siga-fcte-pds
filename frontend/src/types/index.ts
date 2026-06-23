// ─── ENTIDADES ─────────────────────────────────────────────
export interface Professor {
    id: number;
    nome: string;
    email: string;
    turmas?: Turma[];
}

export interface Aluno {
    matricula: string;
    nome: string;
    cpf: string;
    email: string;
    curso: string;
    telefone?: string;
    endereco?: string;
    status: string;
    dataNascimento?: string;
    tipoAluno?: string;
    matriculas?: MatriculaCompleta[];
}

export interface Disciplina {
    codigo: string;
    nome: string;
    cargaHoraria: number;
    tipo: string;
}

export interface Turma {
    id: number;
    codigoTurma: string;
    semestreLetivo: string;
    sala?: string;
    horario?: string;
    capacidadeMaxima: number;
    modalidade?: string;
    disciplina: Disciplina;
    professor?: Professor;
}

export interface MatriculaCompleta {
    id: number;
    statusMatricula: string;
    aluno: Aluno;
    turma: Turma;
}

export interface NotaResponse {
    id: number;
    valor: number;
    avaliacao: { id: number; descricao: string };
    aluno: { matricula: string; nome: string };
}

export interface FrequenciaResponse {
    id: number;
    data: string;
    presente: boolean;
    aluno: { matricula: string; nome: string };
    turma: { id: number; codigoTurma: string };
}

export interface Notificacao {
    id: number;
    mensagem: string;
    dataCriacao: string;
    turma: { id: number; codigoTurma: string; disciplina: { nome: string } };
}

// ─── AUTH ──────────────────────────────────────────────────
export type UserRole = 'professor' | 'aluno' | 'admin';

export interface AuthUser {
    role: UserRole;
    professor?: Professor;
    aluno?: Aluno;
}
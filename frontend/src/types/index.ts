export interface Professor {
    id: number;
    nome: string;
    email: string;
}

export interface Aluno {
    matricula: string;
    nome: string;
    cpf: string;
    email: string;
    curso: string;
    telefone?: string;
    status: string;
    matriculas?: Matricula[];
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

export interface Matricula {
    id: number;
    statusMatricula: string;
    aluno: Aluno;
    turma: Turma;
}

export interface Avaliacao {
    id: number;
    descricao: string;
    turma: Turma;
}

export interface Notificacao {
    id: number;
    mensagem: string;
    dataCriacao: string;
    turma: { id: number; codigoTurma: string; disciplina: { nome: string } };
}

export type UserRole = 'professor' | 'aluno';

export interface AuthUser {
    role: UserRole;
    professor?: Professor;
    aluno?: Aluno;
}

export interface ApiError {
    message: string;
    status?: number;
}
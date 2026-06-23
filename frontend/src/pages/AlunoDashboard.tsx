import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAluno, getNotificacoesAluno } from '../services/api';
import NotificacaoSino from '../components/NotificacaoSino';
import type { Notificacao } from '../types';

interface NotaItem { valor: number; avaliacao: { descricao: string }; }
interface MatriculaCompleta {
    id: number;
    statusMatricula: string;
    turma: {
        id: number;
        codigoTurma: string;
        semestreLetivo: string;
        horario?: string;
        sala?: string;
        disciplina: { nome: string; cargaHoraria: number };
        professor?: { nome: string };
    };
    notas?: NotaItem[];
}

export default function AlunoDashboard() {
    const { user } = useAuth();
    const aluno = user!.aluno!;

    const [dados, setDados]                 = useState<typeof aluno | null>(null);
    const [matriculas, setMatriculas]       = useState<MatriculaCompleta[]>([]);
    const [notificacoes, setNotificacoes]   = useState<Notificacao[]>([]);
    const [aba, setAba]                     = useState<'turmas'|'notificacoes'>('turmas');
    const [loading, setLoading]             = useState(true);

    const carregar = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await getAluno(aluno.matricula);
            setDados(data);
            setMatriculas(data.matriculas ?? []);
        } catch { /* silencioso */ } finally { setLoading(false); }
    }, [aluno.matricula]);

    const carregarNotificacoes = useCallback(async () => {
        try {
            const { data } = await getNotificacoesAluno(aluno.matricula);
            setNotificacoes(data);
        } catch { setNotificacoes([]); }
    }, [aluno.matricula]);

    useEffect(() => { void carregar(); }, [carregar]);
    useEffect(() => { void carregarNotificacoes(); const t = setInterval(() => void carregarNotificacoes(), 30000); return () => clearInterval(t); }, [carregarNotificacoes]);

    const alunoInfo = dados ?? aluno;

    // Calcula média de notas por turma
    const media = (notas: NotaItem[] = []) => {
        if (!notas.length) return null;
        return (notas.reduce((s, n) => s + n.valor, 0) / notas.length).toFixed(1);
    };

    return (
        <div className="page">
            {/* HEADER com sino */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Meu Painel</h1>
                    <p className="page-sub">Bem-vindo(a), {alunoInfo.nome}</p>
                </div>
                <NotificacaoSino matricula={aluno.matricula} />
            </div>

            {/* CARD DE PERFIL */}
            <div className="aluno-perfil-card">
                <div className="perfil-avatar">{alunoInfo.nome?.charAt(0).toUpperCase()}</div>
                <div className="perfil-info">
                    <h2>{alunoInfo.nome}</h2>
                    <div className="info-grid">
                        <div className="info-item"><span className="info-label">Matrícula</span><span className="info-value"><code>{alunoInfo.matricula}</code></span></div>
                        <div className="info-item"><span className="info-label">Curso</span><span className="info-value">{alunoInfo.curso ?? '—'}</span></div>
                        <div className="info-item"><span className="info-label">E-mail</span><span className="info-value">{alunoInfo.email ?? '—'}</span></div>
                        <div className="info-item"><span className="info-label">Status</span><span className={`badge badge-${alunoInfo.status?.toLowerCase()}`}>{alunoInfo.status ?? '—'}</span></div>
                    </div>
                </div>
            </div>

            {/* ABAS */}
            <div className="abas">
                <button className={`aba-btn ${aba === 'turmas' ? 'active' : ''}`} onClick={() => setAba('turmas')}>
                    📚 Minhas Turmas ({matriculas.length})
                </button>
                <button className={`aba-btn ${aba === 'notificacoes' ? 'active' : ''}`} onClick={() => { setAba('notificacoes'); void carregarNotificacoes(); }}>
                    🔔 Notificações {notificacoes.length > 0 && <span className="aba-badge">{notificacoes.length}</span>}
                </button>
            </div>

            {/* ABA: TURMAS E NOTAS */}
            {aba === 'turmas' && (
                loading ? <div className="table-loading">Carregando...</div> : (
                    matriculas.length === 0
                        ? <div className="dash-empty"><span>📚</span><p>Você ainda não está matriculado em nenhuma turma.</p></div>
                        : <div className="turmas-grid">
                            {matriculas.map(m => (
                                <div key={m.id} className="turma-card">
                                    <div className="turma-card-header">
                                        <h3>{m.turma.disciplina?.nome}</h3>
                                        <span className={`badge badge-${m.statusMatricula?.toLowerCase()}`}>{m.statusMatricula}</span>
                                    </div>
                                    <div className="turma-card-meta">
                                        <span>📋 {m.turma.codigoTurma} · {m.turma.semestreLetivo}</span>
                                        {m.turma.horario  && <span>🕐 {m.turma.horario}</span>}
                                        {m.turma.sala     && <span>📍 {m.turma.sala}</span>}
                                        {m.turma.professor && <span>👨‍🏫 {m.turma.professor.nome}</span>}
                                        <span>⏱ {m.turma.disciplina?.cargaHoraria}h</span>
                                    </div>
                                    {/* Notas da turma */}
                                    {m.notas && m.notas.length > 0 && (
                                        <div className="turma-notas">
                                            <p className="turma-notas-title">Notas</p>
                                            {m.notas.map((n, i) => (
                                                <div key={i} className="nota-row">
                                                    <span>{n.avaliacao?.descricao}</span>
                                                    <span className={`nota-valor ${Number(n.valor) >= 5 ? 'aprovado' : 'reprovado'}`}>{n.valor}</span>
                                                </div>
                                            ))}
                                            <div className="nota-row nota-media">
                                                <span>Média</span>
                                                <span className={`nota-valor ${Number(media(m.notas)) >= 5 ? 'aprovado' : 'reprovado'}`}>{media(m.notas)}</span>
                                            </div>
                                        </div>
                                    )}
                                    {(!m.notas || m.notas.length === 0) && (
                                        <p className="hint-text" style={{ marginTop: '.5rem' }}>Nenhuma nota lançada ainda.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                )
            )}

            {/* ABA: NOTIFICAÇÕES */}
            {aba === 'notificacoes' && (
                notificacoes.length === 0
                    ? <div className="dash-empty"><span>🔔</span><p>Nenhuma notificação no momento.</p></div>
                    : <div className="notif-lista">
                        {notificacoes.map(n => (
                            <div key={n.id} className="notif-item">
                                <span className="notif-icon">⚠️</span>
                                <div>
                                    <p className="notif-msg">{n.mensagem}</p>
                                    <span className="notif-turma">{n.turma?.disciplina?.nome ?? n.turma?.codigoTurma}</span>
                                    <span className="notif-data">{new Date(n.dataCriacao).toLocaleString('pt-BR')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
            )}
        </div>
    );
}
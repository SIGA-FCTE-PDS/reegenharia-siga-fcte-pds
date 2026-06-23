import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAluno, getNotas, getFrequencias, getNotificacoesAluno } from '../services/api';
import type { Notificacao, NotaResponse, FrequenciaResponse } from '../types';

interface MatriculaItem {
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
}

type Aba = 'turmas' | 'notificacoes';

export default function AlunoDashboard() {
    const { user } = useAuth();
    const aluno = user!.aluno!;
    const montado = useRef(true);

    useEffect(() => {
        montado.current = true;
        return () => { montado.current = false; };
    }, []);

    const [matriculas, setMatriculas]         = useState<MatriculaItem[]>([]);
    const [notificacoes, setNotificacoes]     = useState<Notificacao[]>([]);
    const [aba, setAba]                       = useState<Aba>('turmas');
    const [loading, setLoading]               = useState(true);
    const [turmaSel, setTurmaSel]             = useState<number | null>(null);
    const [notas, setNotas]                   = useState<NotaResponse[]>([]);
    const [frequencias, setFrequencias]       = useState<FrequenciaResponse[]>([]);
    const [loadingDetalhe, setLoadingDetalhe] = useState(false);

    // ── Carrega dados do aluno ──────────────────────────────────────────────
    useEffect(() => {
        void (async () => {
            setLoading(true);
            try {
                const { data } = await getAluno(aluno.matricula);
                if (montado.current) setMatriculas(data.matriculas ?? []);
            } catch { /* silencioso */ }
            finally { if (montado.current) setLoading(false); }
        })();
    }, [aluno.matricula]);

    // ── Carrega + polling de notificações ──────────────────────────────────
    useEffect(() => {
        const fetchNotif = async () => {
            try {
                const { data } = await getNotificacoesAluno(aluno.matricula);
                if (montado.current) setNotificacoes(data);
            } catch {
                if (montado.current) setNotificacoes([]);
            }
        };
        void fetchNotif();
        const t = setInterval(() => { void fetchNotif(); }, 30_000);
        return () => clearInterval(t);
    }, [aluno.matricula]);

    // ── Carrega notas + frequência ao selecionar turma ─────────────────────
    useEffect(() => {
        if (!turmaSel) return;
        void (async () => {
            setLoadingDetalhe(true);
            const [notasRes, freqRes] = await Promise.allSettled([
                getNotas(aluno.matricula, turmaSel),
                getFrequencias(aluno.matricula, turmaSel),
            ]);
            if (!montado.current) return;
            setLoadingDetalhe(false);
            setNotas(
                notasRes.status === 'fulfilled' ? notasRes.value.data : []
            );
            setFrequencias(
                freqRes.status === 'fulfilled' ? freqRes.value.data : []
            );
        })();
    }, [turmaSel, aluno.matricula]);

    // ── Helpers ────────────────────────────────────────────────────────────
    const media = (ns: NotaResponse[]) =>
        ns.length ? (ns.reduce((s, n) => s + n.valor, 0) / ns.length).toFixed(1) : null;

    const faltas           = frequencias.filter(f => !f.presente).length;
    const presencas        = frequencias.filter(f =>  f.presente).length;
    const pct              = frequencias.length
        ? Math.round((presencas / frequencias.length) * 100) : null;
    const turmaSelecionada = matriculas.find(m => m.turma.id === turmaSel);

    const handleAbaNotif = () => {
        setAba('notificacoes');
        void (async () => {
            try {
                const { data } = await getNotificacoesAluno(aluno.matricula);
                if (montado.current) setNotificacoes(data);
            } catch { /* silencioso */ }
        })();
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Meu Painel</h1>
                    <p className="page-sub">Olá, {aluno.nome}</p>
                </div>
                {notificacoes.length > 0 && (
                    <button className="notif-alerta" onClick={() => setAba('notificacoes')}>
                        ⚠️ {notificacoes.length} alerta(s) de falta
                    </button>
                )}
            </div>

            {/* Perfil */}
            <div className="aluno-perfil-card">
                <div className="perfil-avatar">{aluno.nome?.charAt(0).toUpperCase()}</div>
                <div className="perfil-info">
                    <h2>{aluno.nome}</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Matrícula</span>
                            <span className="info-value"><code>{aluno.matricula}</code></span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Curso</span>
                            <span className="info-value">{aluno.curso ?? '—'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">E-mail</span>
                            <span className="info-value">{aluno.email ?? '—'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Status</span>
                            <span className={`badge badge-${aluno.status?.toLowerCase()}`}>{aluno.status}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Abas */}
            <div className="abas">
                <button
                    className={`aba-btn ${aba === 'turmas' ? 'active' : ''}`}
                    onClick={() => setAba('turmas')}
                >
                    📚 Minhas Turmas ({matriculas.length})
                </button>
                <button
                    className={`aba-btn ${aba === 'notificacoes' ? 'active' : ''}`}
                    onClick={handleAbaNotif}
                >
                    🔔 Notificações{' '}
                    {notificacoes.length > 0 && (
                        <span className="aba-badge">{notificacoes.length}</span>
                    )}
                </button>
            </div>

            {/* ABA TURMAS */}
            {aba === 'turmas' && (
                loading
                    ? <div className="table-loading">Carregando...</div>
                    : matriculas.length === 0
                        ? (
                            <div className="dash-empty">
                                <span>📚</span>
                                <p>Você não está matriculado em nenhuma turma.</p>
                            </div>
                        ) : (
                            <div className="dash-cards">
                                {/* Lista lateral */}
                                <div className="dash-card" style={{ minWidth: 220, maxWidth: 260 }}>
                                    <h3 className="card-title">
                                        <span className="card-icon">📋</span> Turmas
                                    </h3>
                                    {matriculas.map(m => (
                                        <button
                                            key={m.id}
                                            className={`turma-lista-item ${turmaSel === m.turma.id ? 'active' : ''}`}
                                            onClick={() => setTurmaSel(m.turma.id)}
                                        >
                                            <span className="turma-lista-nome">{m.turma.disciplina?.nome}</span>
                                            <span className="turma-lista-meta">
                                                {m.turma.codigoTurma} · {m.turma.semestreLetivo}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Detalhe */}
                                <div className="dash-card" style={{ flex: 1 }}>
                                    {!turmaSel && (
                                        <div className="dash-empty">
                                            <span>👈</span>
                                            <p>Selecione uma turma para ver suas notas e frequência.</p>
                                        </div>
                                    )}
                                    {turmaSel && loadingDetalhe && (
                                        <div className="table-loading">Carregando...</div>
                                    )}
                                    {turmaSel && !loadingDetalhe && (
                                        <>
                                            <h3 className="card-title">
                                                <span className="card-icon">📖</span>
                                                {turmaSelecionada?.turma.disciplina?.nome}
                                            </h3>
                                            <div className="turma-card-meta">
                                                {turmaSelecionada?.turma.professor && (
                                                    <span>👨‍🏫 {turmaSelecionada.turma.professor.nome}</span>
                                                )}
                                                {turmaSelecionada?.turma.horario && (
                                                    <span>🕐 {turmaSelecionada.turma.horario}</span>
                                                )}
                                                {turmaSelecionada?.turma.sala && (
                                                    <span>📍 {turmaSelecionada.turma.sala}</span>
                                                )}
                                                <span>⏱ {turmaSelecionada?.turma.disciplina?.cargaHoraria}h</span>
                                            </div>

                                            {/* Resumo */}
                                            <div className="resumo-bar" style={{ margin: '.75rem 0' }}>
                                                {media(notas) && (
                                                    <span className={`nota-valor ${Number(media(notas)) >= 5 ? 'aprovado' : 'reprovado'}`}>
                                                        Média: {media(notas)}
                                                    </span>
                                                )}
                                                {pct !== null && (
                                                    <span className={pct < 75 ? 'reprovado' : ''}>
                                                        Frequência: {pct}%
                                                    </span>
                                                )}
                                                <span>✅ {presencas} presenças · ❌ {faltas} faltas</span>
                                            </div>

                                            {/* Notas */}
                                            {notas.length > 0 && (
                                                <>
                                                    <p className="turma-notas-title">Notas</p>
                                                    <div className="table-wrapper">
                                                        <table className="data-table">
                                                            <thead>
                                                            <tr><th>Avaliação</th><th>Nota</th></tr>
                                                            </thead>
                                                            <tbody>
                                                            {notas.map(n => (
                                                                <tr key={n.id}>
                                                                    <td>{n.avaliacao?.descricao ?? `Avaliação ${n.avaliacao?.id}`}</td>
                                                                    <td>
                                                                            <span className={`nota-valor ${n.valor >= 5 ? 'aprovado' : 'reprovado'}`}>
                                                                                <strong>{n.valor}</strong>
                                                                            </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>
                                            )}

                                            {/* Frequência */}
                                            {frequencias.length > 0 && (
                                                <>
                                                    <p className="turma-notas-title" style={{ marginTop: '1rem' }}>
                                                        Frequência
                                                    </p>
                                                    <div className="table-wrapper">
                                                        <table className="data-table">
                                                            <thead>
                                                            <tr><th>Data</th><th>Situação</th></tr>
                                                            </thead>
                                                            <tbody>
                                                            {frequencias.map(f => (
                                                                <tr key={f.id}>
                                                                    <td>{new Date(f.data).toLocaleDateString('pt-BR')}</td>
                                                                    <td>
                                                                        {f.presente
                                                                            ? <span className="badge badge-ativo">Presente</span>
                                                                            : <span className="badge badge-cancelada">Falta</span>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>
                                            )}

                                            {notas.length === 0 && frequencias.length === 0 && (
                                                <p className="hint-text" style={{ marginTop: '.5rem' }}>
                                                    Nenhum dado lançado ainda para esta disciplina.
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )
            )}

            {/* ABA NOTIFICAÇÕES */}
            {aba === 'notificacoes' && (
                notificacoes.length === 0
                    ? (
                        <div className="dash-empty">
                            <span>🔔</span>
                            <p>Nenhuma notificação no momento.</p>
                        </div>
                    ) : (
                        <div className="notif-lista">
                            {notificacoes.map(n => (
                                <div key={n.id} className="notif-item">
                                    <span className="notif-icon">⚠️</span>
                                    <div>
                                        <p className="notif-msg">{n.mensagem}</p>
                                        <span className="notif-turma">
                                            {n.turma?.disciplina?.nome ?? n.turma?.codigoTurma}
                                        </span>
                                        <span className="notif-data">
                                            {new Date(n.dataCriacao).toLocaleString('pt-BR')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
            )}
        </div>
    );
}
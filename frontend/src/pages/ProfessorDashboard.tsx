import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    getTurmasProfessor,
    getAvaliacoesTurma,
    getAlunosTurma,
    lancarNota,
    lancarFalta,
} from '../services/api';
import type { Turma, Avaliacao } from '../types';

interface AlunoMatricula {
    id: number;
    aluno: { matricula: string; nome: string };
}

export default function ProfessorDashboard() {
    const { user, logout } = useAuth();
    const professor = user!.professor!;

    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [turmaSel, setTurmaSel] = useState('');
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    const [alunos, setAlunos] = useState<AlunoMatricula[]>([]);

    // Formulário nota
    const [avaliacaoId, setAvaliacaoId] = useState('');
    const [alunoNota, setAlunoNota] = useState('');
    const [valorNota, setValorNota] = useState('');

    // Formulário falta
    const [alunoFalta, setAlunoFalta] = useState('');
    const [dataFalta, setDataFalta] = useState(() => new Date().toISOString().slice(0, 10));
    const [presente, setPresente] = useState(false);

    const [feedbackNota, setFeedbackNota] = useState<{ tipo: 'ok' | 'erro'; msg: string } | null>(null);
    const [feedbackFalta, setFeedbackFalta] = useState<{ tipo: 'ok' | 'erro'; msg: string } | null>(null);
    const [loadingNota, setLoadingNota] = useState(false);
    const [loadingFalta, setLoadingFalta] = useState(false);

    useEffect(() => {
        getTurmasProfessor(professor.id).then(r => setTurmas(r.data)).catch(() => {});
    }, [professor.id]);

    useEffect(() => {
        if (!turmaSel) return;
        const id = Number(turmaSel);

        const carregarDadosTurma = async () => {
            const [resAval, resAlunos] = await Promise.all([
                getAvaliacoesTurma(id),
                getAlunosTurma(id),
            ]);
            setAvaliacoes(resAval.data);
            setAlunos(resAlunos.data);
            setAvaliacaoId('');
            setAlunoNota('');
            setAlunoFalta('');
            setFeedbackNota(null);
            setFeedbackFalta(null);
        };

        carregarDadosTurma();
    }, [turmaSel]);

    const handleLancarNota = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingNota(true);
        setFeedbackNota(null);
        try {
            await lancarNota({ alunoMatricula: alunoNota, avaliacaoId: Number(avaliacaoId), valor: Number(valorNota) });
            setFeedbackNota({ tipo: 'ok', msg: 'Nota lançada com sucesso!' });
            setAlunoNota('');
            setAvaliacaoId('');
            setValorNota('');
        } catch {
            setFeedbackNota({ tipo: 'erro', msg: 'Erro ao lançar nota. Tente novamente.' });
        } finally {
            setLoadingNota(false);
        }
    };

    const handleLancarFalta = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingFalta(true);
        setFeedbackFalta(null);
        try {
            await lancarFalta({ alunoMatricula: alunoFalta, turmaId: Number(turmaSel), data: dataFalta, presente });
            setFeedbackFalta({ tipo: 'ok', msg: presente ? 'Presença registrada!' : 'Falta registrada com sucesso!' });
            setAlunoFalta('');
            setPresente(false);
        } catch {
            setFeedbackFalta({ tipo: 'erro', msg: 'Erro ao registrar frequência. Tente novamente.' });
        } finally {
            setLoadingFalta(false);
        }
    };

    return (
        <div className="dashboard-page">
            <header className="dash-header">
                <div className="dash-header-left">
                    <div className="logo-icon-sm">S</div>
                    <div>
                        <span className="dash-role">Professor</span>
                        <h2 className="dash-name">{professor.nome}</h2>
                    </div>
                </div>
                <button className="btn-logout" onClick={logout}>Sair</button>
            </header>

            <main className="dash-main">
                <section className="dash-section">
                    <h3 className="section-title">Selecionar Turma</h3>
                    <select
                        className="select-field"
                        value={turmaSel}
                        onChange={e => setTurmaSel(e.target.value)}
                    >
                        <option value="">— Escolha uma turma —</option>
                        {turmas.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.disciplina?.nome} — {t.codigoTurma} ({t.semestreLetivo})
                            </option>
                        ))}
                    </select>
                </section>

                {turmaSel && (
                    <div className="dash-cards">
                        {/* CARD: Lançar Nota */}
                        <div className="dash-card">
                            <h3 className="card-title">
                                <span className="card-icon">📝</span> Lançar Nota
                            </h3>
                            <form onSubmit={handleLancarNota} className="dash-form">
                                <div className="field-group">
                                    <label>Aluno</label>
                                    <select className="select-field" value={alunoNota} onChange={e => setAlunoNota(e.target.value)} required>
                                        <option value="">— Selecione o aluno —</option>
                                        {alunos.map(m => (
                                            <option key={m.id} value={m.aluno.matricula}>
                                                {m.aluno.nome} ({m.aluno.matricula})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="field-group">
                                    <label>Avaliação</label>
                                    <select className="select-field" value={avaliacaoId} onChange={e => setAvaliacaoId(e.target.value)} required>
                                        <option value="">— Selecione a avaliação —</option>
                                        {avaliacoes.map(a => (
                                            <option key={a.id} value={a.id}>{a.descricao}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="field-group">
                                    <label>Nota (0 – 10)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        className="input-field"
                                        placeholder="Ex: 8.5"
                                        value={valorNota}
                                        onChange={e => setValorNota(e.target.value)}
                                        required
                                    />
                                </div>

                                {feedbackNota && (
                                    <p className={`feedback ${feedbackNota.tipo}`}>{feedbackNota.msg}</p>
                                )}

                                <button type="submit" className="btn-primary" disabled={loadingNota}>
                                    {loadingNota ? 'Salvando...' : 'Lançar Nota'}
                                </button>
                            </form>
                        </div>

                        {/* CARD: Registrar Frequência */}
                        <div className="dash-card">
                            <h3 className="card-title">
                                <span className="card-icon">📅</span> Registrar Frequência
                            </h3>
                            <form onSubmit={handleLancarFalta} className="dash-form">
                                <div className="field-group">
                                    <label>Aluno</label>
                                    <select className="select-field" value={alunoFalta} onChange={e => setAlunoFalta(e.target.value)} required>
                                        <option value="">— Selecione o aluno —</option>
                                        {alunos.map(m => (
                                            <option key={m.id} value={m.aluno.matricula}>
                                                {m.aluno.nome} ({m.aluno.matricula})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="field-group">
                                    <label>Data da Aula</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={dataFalta}
                                        onChange={e => setDataFalta(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="field-group-inline">
                                    <label className="toggle-label">
                                        <input
                                            type="checkbox"
                                            checked={presente}
                                            onChange={e => setPresente(e.target.checked)}
                                        />
                                        <span className="toggle-track">
                      <span className="toggle-thumb" />
                    </span>
                                        <span>{presente ? 'Presente' : 'Falta'}</span>
                                    </label>
                                </div>

                                {feedbackFalta && (
                                    <p className={`feedback ${feedbackFalta.tipo}`}>{feedbackFalta.msg}</p>
                                )}

                                <button type="submit" className="btn-primary" disabled={loadingFalta}>
                                    {loadingFalta ? 'Salvando...' : 'Registrar'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {!turmaSel && (
                    <div className="dash-empty">
                        <span>👆</span>
                        <p>Selecione uma turma para começar a lançar notas e registrar frequências.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
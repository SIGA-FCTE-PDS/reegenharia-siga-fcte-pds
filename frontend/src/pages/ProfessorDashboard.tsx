import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTurmas, getMatriculasPorTurma, lancarNota, getNotasPorAlunoETurma } from '../services/api';
import type { Turma } from '../types';
import { extractErrorMessage } from '../utils/errorHandler';

interface AlunoTurma { id: number; aluno: { matricula: string; nome: string }; }
interface Nota { id: number; valor: number; avaliacao: { id: number; descricao: string }; aluno: { nome: string; matricula: string }; }

export default function ProfessorDashboard() {
    const { user } = useAuth();
    const professor = user!.professor!;

    const [turmas, setTurmas]       = useState<Turma[]>([]);
    const [turmaSel, setTurmaSel]   = useState('');
    const [alunos, setAlunos]       = useState<AlunoTurma[]>([]);
    const [notas, setNotas]         = useState<Nota[]>([]);
    const [alunoSel, setAlunoSel]   = useState('');

    // form nota
    const [avaliacaoId, setAvaliacaoId] = useState('');
    const [valorNota, setValorNota]     = useState('');
    const [feedback, setFeedback]       = useState<{ tipo: 'ok'|'erro'; msg: string }|null>(null);
    const [salvando, setSalvando]       = useState(false);

    // Carrega só as turmas deste professor
    const carregarTurmas = useCallback(async () => {
        try {
            const { data } = await getTurmas();
            setTurmas((data as Turma[]).filter(t => t.professor?.id === professor.id));
        } catch { /* silencioso */ }
    }, [professor.id]);

    useEffect(() => { void carregarTurmas(); }, [carregarTurmas]);

    // Ao trocar turma: carrega alunos matriculados
    useEffect(() => {
        if (!turmaSel) return;
        const run = async () => {
            try { const { data } = await getMatriculasPorTurma(Number(turmaSel)); setAlunos(data); }
            catch { setAlunos([]); }
            setAlunoSel(''); setNotas([]); setFeedback(null);
        };
        void run();
    }, [turmaSel]);

    // Ao selecionar aluno: carrega histórico de notas dele na turma
    useEffect(() => {
        if (!alunoSel || !turmaSel) return;
        const run = async () => {
            try { const { data } = await getNotasPorAlunoETurma(alunoSel, Number(turmaSel)); setNotas(data); }
            catch { setNotas([]); }
        };
        void run();
    }, [alunoSel, turmaSel]);

    const handleLancarNota = (e: React.FormEvent) => {
        e.preventDefault();
        const run = async () => {
            setSalvando(true); setFeedback(null);
            try {
                await lancarNota({ alunoMatricula: alunoSel, avaliacaoId: Number(avaliacaoId), valor: Number(valorNota) });
                setFeedback({ tipo: 'ok', msg: `Nota ${valorNota} lançada com sucesso!` });
                setAvaliacaoId(''); setValorNota('');
                // Recarrega notas
                const { data } = await getNotasPorAlunoETurma(alunoSel, Number(turmaSel));
                setNotas(data);
            } catch (err) {
                setFeedback({ tipo: 'erro', msg: extractErrorMessage(err) });
            } finally { setSalvando(false); }
        };
        void run();
    };

    const turmaSelecionada = turmas.find(t => t.id === Number(turmaSel));
    const alunoSelecionado = alunos.find(a => a.aluno.matricula === alunoSel);

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Painel do Professor</h1>
                    <p className="page-sub">Bem-vindo, {professor.nome}</p>
                </div>
            </div>

            {/* PASSO 1 — Selecionar turma */}
            <div className="dash-card">
                <h3 className="card-title"><span className="card-icon">📚</span> 1. Selecione a Turma</h3>
                <select className="select-field" value={turmaSel} onChange={e => setTurmaSel(e.target.value)}>
                    <option value="">— Escolha uma das suas turmas —</option>
                    {turmas.map(t => (
                        <option key={t.id} value={t.id}>
                            {t.disciplina?.nome} · {t.codigoTurma} · {t.semestreLetivo} · {t.horario ?? 'sem horário'}
                        </option>
                    ))}
                </select>
                {turmas.length === 0 && <p className="hint-text">Nenhuma turma associada ao seu cadastro ainda.</p>}
            </div>

            {/* PASSO 2 — Selecionar aluno */}
            {turmaSel && (
                <div className="dash-card">
                    <h3 className="card-title"><span className="card-icon">👤</span> 2. Selecione o Aluno</h3>
                    <p className="hint-text">{alunos.length} aluno(s) matriculado(s) em {turmaSelecionada?.disciplina?.nome}</p>
                    <select className="select-field" value={alunoSel} onChange={e => setAlunoSel(e.target.value)}>
                        <option value="">— Escolha o aluno —</option>
                        {alunos.map(m => (
                            <option key={m.id} value={m.aluno.matricula}>
                                {m.aluno.nome} · {m.aluno.matricula}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* PASSO 3 — Lançar nota + histórico */}
            {alunoSel && (
                <div className="dash-cards">
                    {/* Formulário */}
                    <div className="dash-card">
                        <h3 className="card-title"><span className="card-icon">📝</span> 3. Lançar Nota</h3>
                        <p className="hint-text">Aluno: <strong>{alunoSelecionado?.aluno.nome}</strong></p>
                        <form onSubmit={handleLancarNota} className="dash-form">
                            <div className="field-group">
                                <label>ID da Avaliação</label>
                                <input type="number" className="input-field" placeholder="Ex: 1"
                                       value={avaliacaoId} onChange={e => setAvaliacaoId(e.target.value)} required />
                            </div>
                            <div className="field-group">
                                <label>Nota (0 – 10)</label>
                                <input type="number" min="0" max="10" step="0.1" className="input-field"
                                       placeholder="Ex: 8.5" value={valorNota} onChange={e => setValorNota(e.target.value)} required />
                            </div>
                            {feedback && <p className={`feedback ${feedback.tipo}`}>{feedback.msg}</p>}
                            <button type="submit" className="btn-primary" disabled={salvando}>
                                {salvando ? 'Salvando...' : 'Lançar Nota'}
                            </button>
                        </form>
                    </div>

                    {/* Histórico de notas do aluno nessa turma */}
                    <div className="dash-card">
                        <h3 className="card-title"><span className="card-icon">📊</span> Notas Lançadas</h3>
                        {notas.length === 0
                            ? <p className="hint-text">Nenhuma nota lançada ainda para este aluno nesta turma.</p>
                            : (
                                <div className="table-wrapper">
                                    <table className="data-table">
                                        <thead><tr><th>Avaliação</th><th>Nota</th></tr></thead>
                                        <tbody>
                                        {notas.map(n => (
                                            <tr key={n.id}>
                                                <td>{n.avaliacao?.descricao ?? `Avaliação ${n.avaliacao?.id}`}</td>
                                                <td><strong>{n.valor}</strong></td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        }
                    </div>
                </div>
            )}

            {!turmaSel && (
                <div className="dash-empty">
                    <span>🎓</span>
                    <p>Selecione uma turma para ver os alunos e lançar notas.</p>
                </div>
            )}
        </div>
    );
}
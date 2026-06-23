import { useState, useEffect, useCallback, useRef } from 'react';
import type { Aluno, Turma, Matricula } from '../types';
import { getAlunos, getTurmas, getMatriculas, realizarMatricula, cancelarMatricula } from '../services/api';
import { extractErrorMessage } from '../utils/errorHandler';

export default function MatriculasPage() {
    const [matriculas, setMatriculas] = useState<Matricula[]>([]);
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [alunoSel, setAlunoSel] = useState('');
    const [turmaSel, setTurmaSel] = useState('');
    const [salvando, setSalvando] = useState(false);

    const [erroModal, setErroModal] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [busca, setBusca] = useState('');

    const [recarregar, setRecarregar] = useState(0);
    const triggerRecarregar = useCallback(() => setRecarregar(n => n + 1), []);

    const montadoRef = useRef(true);
    useEffect(() => {
        montadoRef.current = true;
        return () => { montadoRef.current = false; };
    }, []);

    useEffect(() => {
        const buscarDados = async () => {
            setLoading(true);
            try {
                const [resM, resA, resT] = await Promise.all([
                    getMatriculas(),
                    getAlunos(),
                    getTurmas(),
                ]);
                if (!montadoRef.current) return;
                setMatriculas(resM.data);
                setAlunos(resA.data);
                setTurmas(resT.data);
            } catch {
                // silencioso
            } finally {
                if (montadoRef.current) setLoading(false);
            }
        };
        void buscarDados();
    }, [recarregar]);

    const carregar = triggerRecarregar;

    const abrirForm = () => {
        setAlunoSel('');
        setTurmaSel('');
        setErroModal('');
        setSucesso('');
        setShowForm(true);
    };

    const handleMatricular = (e: React.FormEvent) => {
        e.preventDefault();

        const submeter = async () => {
            setSalvando(true);
            setErroModal('');
            setSucesso('');
            try {
                await realizarMatricula({ alunoMatricula: alunoSel, turmaId: Number(turmaSel) });
                setSucesso('Matrícula realizada com sucesso!');
                setShowForm(false);
                carregar();
            } catch (err) {
                setErroModal(extractErrorMessage(err));
            } finally {
                setSalvando(false);
            }
        };

        void submeter();
    };

    const handleCancelar = (id: number, nomeAluno: string) => {
        if (!confirm(`Cancelar matrícula de "${nomeAluno}"?`)) return;

        const cancelar = async () => {
            try {
                await cancelarMatricula(id);
                setSucesso('Matrícula cancelada.');
                carregar();
            } catch (err) {
                setSucesso('');
                setErroModal(extractErrorMessage(err));
            }
        };

        void cancelar();
    };

    const matriculasFiltradas = matriculas.filter(m =>
        m.aluno?.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        m.aluno?.matricula?.includes(busca) ||
        m.turma?.codigoTurma?.toLowerCase().includes(busca.toLowerCase()) ||
        m.turma?.disciplina?.nome?.toLowerCase().includes(busca.toLowerCase())
    );

    const turmaDetalhes = turmas.find(t => t.id === Number(turmaSel));

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Matrículas</h1>
                    <p className="page-sub">{matriculas.length} matrícula(s) ativa(s)</p>
                </div>
                <button className="btn-primary" onClick={abrirForm}>
                    + Nova Matrícula
                </button>
            </div>

            {sucesso && <div className="alert alert-ok">{sucesso}</div>}

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Realizar Matrícula</h2>
                            <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
                        </div>

                        <form onSubmit={handleMatricular} className="modal-form">
                            <div className="field-group">
                                <label>Aluno *</label>
                                <select
                                    className="select-field"
                                    value={alunoSel}
                                    onChange={e => setAlunoSel(e.target.value)}
                                    required
                                >
                                    <option value="">— Selecione o aluno —</option>
                                    {alunos.map(a => (
                                        <option key={a.matricula} value={a.matricula}>
                                            {a.nome} ({a.matricula})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="field-group">
                                <label>Turma *</label>
                                <select
                                    className="select-field"
                                    value={turmaSel}
                                    onChange={e => setTurmaSel(e.target.value)}
                                    required
                                >
                                    <option value="">— Selecione a turma —</option>
                                    {turmas.map(t => (
                                        <option key={t.id} value={t.id}>
                                            {t.disciplina?.nome} — {t.codigoTurma} ({t.semestreLetivo})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {turmaDetalhes && (
                                <div className="turma-info-box">
                                    <span>📍 {turmaDetalhes.sala ?? 'Sem sala'}</span>
                                    <span>🕐 {turmaDetalhes.horario ?? 'Sem horário'}</span>
                                    <span>👥 Capacidade: {turmaDetalhes.capacidadeMaxima} vagas</span>
                                    <span>🖥 {turmaDetalhes.modalidade ?? 'Presencial'}</span>
                                </div>
                            )}

                            {erroModal && (
                                <div className="alert alert-erro alert-destaque">
                                    <span className="alert-icon">⚠️</span>
                                    <div>
                                        <strong>Matrícula não realizada</strong>
                                        <p>{erroModal}</p>
                                    </div>
                                </div>
                            )}

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                                <button type="submit" className="btn-primary" disabled={salvando}>
                                    {salvando ? 'Matriculando...' : 'Confirmar Matrícula'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="search-bar">
                <input
                    className="input-field"
                    placeholder="Buscar por aluno, matrícula, turma ou disciplina..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="table-loading">Carregando...</div>
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Aluno</th>
                            <th>Matrícula</th>
                            <th>Disciplina</th>
                            <th>Turma</th>
                            <th>Semestre</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {matriculasFiltradas.length === 0 ? (
                            <tr><td colSpan={7} className="table-empty">Nenhuma matrícula encontrada.</td></tr>
                        ) : (
                            matriculasFiltradas.map(m => (
                                <tr key={m.id}>
                                    <td className="td-nome">{m.aluno?.nome}</td>
                                    <td><code>{m.aluno?.matricula}</code></td>
                                    <td>{m.turma?.disciplina?.nome}</td>
                                    <td><code>{m.turma?.codigoTurma}</code></td>
                                    <td>{m.turma?.semestreLetivo}</td>
                                    <td>
                      <span className={`badge badge-${m.statusMatricula?.toLowerCase()}`}>
                        {m.statusMatricula}
                      </span>
                                    </td>
                                    <td>
                                        <button className="btn-danger-sm" onClick={() => handleCancelar(m.id, m.aluno?.nome)}>
                                            Cancelar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
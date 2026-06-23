import { useState, useEffect, useCallback } from 'react';
import type { Aluno } from '../types';
import { getAlunos, criarAluno, deletarAluno } from '../services/api';
import { extractErrorMessage } from '../utils/errorHandler';

const STATUS_OPTIONS = ['ATIVO', 'TRANCADO', 'FORMADO'];

const EMPTY_FORM = {
    matricula: '',
    nome: '',
    cpf: '',
    email: '',
    curso: '',
    telefone: '',
    status: 'ATIVO',
};

export default function AlunosPage() {
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [busca, setBusca] = useState('');

    const carregar = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await getAlunos();
            setAlunos(data);
        } catch {
            setErro('Não foi possível carregar os alunos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void carregar(); }, [carregar]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submeter = async () => {
            setSalvando(true);
            setErro('');
            setSucesso('');
            try {
                await criarAluno(form);
                setSucesso('Aluno cadastrado com sucesso!');
                setForm(EMPTY_FORM);
                setShowForm(false);
                void carregar();
            } catch (err) {
                setErro(extractErrorMessage(err));
            } finally {
                setSalvando(false);
            }
        };

        void submeter();
    };

    const handleDeletar = async (matricula: string, nome: string) => {
        if (!confirm(`Remover o aluno "${nome}"?`)) return;
        try {
            await deletarAluno(matricula);
            setSucesso('Aluno removido.');
            void carregar();
        } catch (err) {
            setErro(extractErrorMessage(err));
        }
    };

    const alunosFiltrados = alunos.filter(a =>
        a.nome.toLowerCase().includes(busca.toLowerCase()) ||
        a.matricula.includes(busca) ||
        a.curso?.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Alunos</h1>
                    <p className="page-sub">{alunos.length} aluno(s) cadastrado(s)</p>
                </div>
                <button className="btn-primary" onClick={() => { setShowForm(true); setErro(''); setSucesso(''); }}>
                    + Novo Aluno
                </button>
            </div>

            {sucesso && <div className="alert alert-ok">{sucesso}</div>}
            {erro    && <div className="alert alert-erro">{erro}</div>}

            {/* MODAL CADASTRO */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Cadastrar Aluno</h2>
                            <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
                        </div>
                        <form onSubmit={(e) => { void handleSubmit(e); }} className="modal-form">
                            <div className="form-grid">
                                <div className="field-group">
                                    <label>Matrícula *</label>
                                    <input name="matricula" className="input-field" value={form.matricula} onChange={handleChange} placeholder="Ex: 2023001234" required />
                                </div>
                                <div className="field-group">
                                    <label>Nome completo *</label>
                                    <input name="nome" className="input-field" value={form.nome} onChange={handleChange} placeholder="Nome do aluno" required />
                                </div>
                                <div className="field-group">
                                    <label>CPF *</label>
                                    <input name="cpf" className="input-field" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00" required />
                                </div>
                                <div className="field-group">
                                    <label>E-mail *</label>
                                    <input name="email" type="email" className="input-field" value={form.email} onChange={handleChange} placeholder="aluno@ufc.br" required />
                                </div>
                                <div className="field-group">
                                    <label>Curso *</label>
                                    <input name="curso" className="input-field" value={form.curso} onChange={handleChange} placeholder="Ex: Engenharia de Software" required />
                                </div>
                                <div className="field-group">
                                    <label>Telefone</label>
                                    <input name="telefone" className="input-field" value={form.telefone} onChange={handleChange} placeholder="(85) 99999-9999" />
                                </div>
                                <div className="field-group">
                                    <label>Status *</label>
                                    <select name="status" className="select-field" value={form.status} onChange={handleChange} required>
                                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            {erro && <div className="alert alert-erro">{erro}</div>}

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                                <button type="submit" className="btn-primary" disabled={salvando}>
                                    {salvando ? 'Salvando...' : 'Cadastrar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* BUSCA */}
            <div className="search-bar">
                <input
                    className="input-field"
                    placeholder="Buscar por nome, matrícula ou curso..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                />
            </div>

            {/* TABELA */}
            {loading ? (
                <div className="table-loading">Carregando...</div>
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Matrícula</th>
                            <th>Nome</th>
                            <th>Curso</th>
                            <th>E-mail</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {alunosFiltrados.length === 0 ? (
                            <tr><td colSpan={6} className="table-empty">Nenhum aluno encontrado.</td></tr>
                        ) : (
                            alunosFiltrados.map(a => (
                                <tr key={a.matricula}>
                                    <td><code>{a.matricula}</code></td>
                                    <td className="td-nome">{a.nome}</td>
                                    <td>{a.curso}</td>
                                    <td>{a.email}</td>
                                    <td><span className={`badge badge-${a.status?.toLowerCase()}`}>{a.status}</span></td>
                                    <td>
                                        <button className="btn-danger-sm" onClick={() => { void handleDeletar(a.matricula, a.nome); }}>
                                            Remover
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
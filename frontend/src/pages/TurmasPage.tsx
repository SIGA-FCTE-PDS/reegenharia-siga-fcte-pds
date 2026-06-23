import { useState, useEffect, useCallback } from 'react';
import type { Turma } from '../types';
import { getTurmas, criarTurma, deletarTurma } from '../services/api';
import { extractErrorMessage } from '../utils/errorHandler';

// Ajustado para bater exatamente com os campos do TurmaRequestDTO no Java
const EMPTY_FORM = {
    codigoTurma: '',
    semestreLetivo: '',
    sala: '',
    horario: '',
    capacidadeMaxima: 40,
    modalidade: 'Presencial',
    codigoDisciplina: '', // Corrigido de disciplinaCodigo
    idProfessor: 0,       // Corrigido de professorId
};

export default function TurmasPage() {
    const [turmas, setTurmas] = useState<Turma[]>([]);
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
            const { data } = await getTurmas();
            setTurmas(data);
        } catch {
            setErro('Não foi possível carregar as turmas.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const init = async () => { await carregar(); };
        void init();
    }, [carregar]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(f => ({
            ...f,
            [name]: name === 'capacidadeMaxima' || name === 'idProfessor' ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submeter = async () => {
            setSalvando(true);
            setErro('');
            setSucesso('');
            try {
                await criarTurma(form);
                setSucesso('Turma cadastrada com sucesso!');
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

    const handleDeletar = async (id: number, codigo: string) => {
        if (!confirm(`Remover a turma "${codigo}"?`)) return;
        try {
            await deletarTurma(id);
            setSucesso('Turma removida.');
            void carregar();
        } catch (err) {
            setErro(extractErrorMessage(err));
        }
    };

    const turmasFiltradas = turmas.filter(t =>
        t.codigoTurma.toLowerCase().includes(busca.toLowerCase()) ||
        t.semestreLetivo.includes(busca)
    );

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Turmas</h1>
                    <p className="page-sub">{turmas.length} turma(s) cadastrada(s)</p>
                </div>
                <button className="btn-primary" onClick={() => { setShowForm(true); }}>+ Nova Turma</button>
            </div>

            {sucesso && <div className="alert alert-ok">{sucesso}</div>}
            {erro && <div className="alert alert-erro">{erro}</div>}

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Cadastrar Turma</h2>
                            <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-grid">
                                <div className="field-group">
                                    <label>Código da Turma *</label>
                                    <input name="codigoTurma" className="input-field" value={form.codigoTurma} onChange={handleChange} required />
                                </div>
                                <div className="field-group">
                                    <label>Semestre Letivo *</label>
                                    <input name="semestreLetivo" className="input-field" value={form.semestreLetivo} onChange={handleChange} required />
                                </div>
                                <div className="field-group">
                                    <label>Código da Disciplina *</label>
                                    <input name="codigoDisciplina" className="input-field" value={form.codigoDisciplina} onChange={handleChange} required />
                                </div>
                                <div className="field-group">
                                    <label>ID do Professor *</label>
                                    <input name="idProfessor" type="number" className="input-field" value={form.idProfessor || ''} onChange={handleChange} required />
                                </div>
                                <div className="field-group">
                                    <label>Sala</label>
                                    <input name="sala" className="input-field" value={form.sala} onChange={handleChange} />
                                </div>
                                <div className="field-group">
                                    <label>Horário</label>
                                    <input name="horario" className="input-field" value={form.horario} onChange={handleChange} />
                                </div>
                                <div className="field-group">
                                    <label>Capacidade Máxima *</label>
                                    <input name="capacidadeMaxima" type="number" className="input-field" value={form.capacidadeMaxima} onChange={handleChange} required />
                                </div>
                                <div className="field-group">
                                    <label>Modalidade</label>
                                    <select name="modalidade" className="select-field" value={form.modalidade} onChange={handleChange}>
                                        <option value="Presencial">Presencial</option>
                                        <option value="EAD">EAD</option>
                                        <option value="Híbrido">Híbrido</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                                <button type="submit" className="btn-primary" disabled={salvando}>{salvando ? 'Salvando...' : 'Cadastrar'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="search-bar">
                <input className="input-field" placeholder="Buscar..." value={busca} onChange={e => setBusca(e.target.value)} />
            </div>

            {loading ? <div className="table-loading">Carregando...</div> : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr><th>Código</th><th>Semestre</th><th>Sala</th><th>Vagas</th><th>Ações</th></tr>
                        </thead>
                        <tbody>
                        {turmasFiltradas.map(t => (
                            <tr key={t.id}>
                                <td>{t.codigoTurma}</td>
                                <td>{t.semestreLetivo}</td>
                                <td>{t.sala}</td>
                                <td>{t.capacidadeMaxima}</td>
                                <td><button className="btn-danger-sm" onClick={() => void handleDeletar(t.id, t.codigoTurma)}>Remover</button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
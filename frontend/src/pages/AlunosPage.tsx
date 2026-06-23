import { useState, useEffect, useCallback } from 'react';
import type { Aluno } from '../types';
import { getAlunos, criarAluno, deletarAluno } from '../services/api';
import { extractErrorMessage } from '../utils/errorHandler';

const anoAtual = new Date().getFullYear();
const ANOS     = Array.from({ length: 10 }, (_, i) => anoAtual - i);

const gerarMatricula = (ano: string, sem: string) =>
    `${ano}${sem}${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;

const EMPTY = {
    nome: '', cpf: '', email: '', curso: '', telefone: '', endereco: '',
    status: 'ATIVO', tipoAluno: 'NORMAL', dataNascimento: '',
    anoIngresso: String(anoAtual), semestreIngresso: '1',
    instituicaoOrigem: '',
};

export default function AlunosPage() {
    const [alunos, setAlunos]     = useState<Aluno[]>([]);
    const [loading, setLoading]   = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm]         = useState(EMPTY);
    const [matriculaGerada, setMatriculaGerada] = useState(gerarMatricula(String(anoAtual), '1'));
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro]         = useState('');
    const [sucesso, setSucesso]   = useState('');
    const [busca, setBusca]       = useState('');

    const carregar = useCallback(async () => {
        setLoading(true);
        try { const { data } = await getAlunos(); setAlunos(data); }
        catch { setErro('Não foi possível carregar os alunos.'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        const fetchDados = async () => {
            await carregar();
        };
        fetchDados();
    }, [carregar]);

    useEffect(() => {
        const atualizarMatricula = async () => {
            setMatriculaGerada(gerarMatricula(form.anoIngresso, form.semestreIngresso));
        };
        atualizarMatricula();
    }, [form.anoIngresso, form.semestreIngresso]);

    const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const abrirForm = () => { setForm(EMPTY); setErro(''); setSucesso(''); setShowForm(true); };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const run = async () => {
            setSalvando(true); setErro('');
            try {
                // 1. Limpa o CPF (remove os pontos e o traço)
                const cpfLimpo = form.cpf.replace(/[^\d]/g, '');

                // 2. Garante que a data está no formato YYYY-MM-DD ou vazia
                // (Se o seu Java exigir DD/MM/YYYY, você terá de inverter aqui)
                let dataNascFormatada = undefined;
                if (form.dataNascimento) {
                    dataNascFormatada = form.dataNascimento;
                    // Exemplo de como formatar para DD/MM/YYYY se o Java exigir:
                    // const [ano, mes, dia] = form.dataNascimento.split('-');
                    // dataNascFormatada = `${dia}/${mes}/${ano}`;
                }

                // 3. Monta o payload formatado
                const payload: Record<string, unknown> = {
                    tipoAluno: form.tipoAluno.toUpperCase(),
                    nome: form.nome,
                    cpf: cpfLimpo,
                    curso: form.curso,
                    // Enviamos um código numérico para satisfazer o backend na geração da matrícula
                    codigoCurso: "03",
                    email: form.email,
                    dataNascimento: dataNascFormatada,
                    endereco: form.endereco,
                    telefone: form.telefone,

                    // O backend precisa destes dois campos numéricos/texto para gerar a matrícula
                    anoIngresso: Number(form.anoIngresso),
                    semestreIngresso: form.semestreIngresso
                };

                if (form.tipoAluno === 'ESPECIAL') {
                    payload.instituicaoOrigem = form.instituicaoOrigem;
                }

                if (form.tipoAluno === 'ESPECIAL') {
                    payload.instituicaoOrigem = form.instituicaoOrigem;
                }

                // Dispara a requisição
                await criarAluno(payload);
                setSucesso(`Aluno cadastrado! Matrícula: ${matriculaGerada}`);
                setShowForm(false);
                void carregar();
            } catch (err) {
                setErro(extractErrorMessage(err));
            } finally {
                setSalvando(false);
            }
        };
        void run();
    };

    const handleDeletar = (matricula: string, nome: string) => {
        if (!confirm(`Remover "${nome}"?`)) return;
        void (async () => {
            try { await deletarAluno(matricula); setSucesso('Aluno removido.'); void carregar(); }
            catch (err) { setErro(extractErrorMessage(err)); }
        })();
    };

    const filtrados = alunos.filter(a =>
        a.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        a.matricula?.includes(busca) ||
        a.curso?.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="page">
            <div className="page-header">
                <div><h1 className="page-title">Alunos</h1><p className="page-sub">{alunos.length} aluno(s)</p></div>
                <button className="btn-primary" onClick={abrirForm}>+ Novo Aluno</button>
            </div>

            {sucesso && <div className="alert alert-ok">{sucesso}</div>}
            {erro && !showForm && <div className="alert alert-erro">{erro}</div>}

            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Cadastrar Aluno</h2>
                            <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">

                            {/* Matrícula gerada */}
                            <div className="matricula-gerada-box">
                                <span className="matricula-gerada-label">Matrícula gerada automaticamente</span>
                                <span className="matricula-gerada-valor">{matriculaGerada}</span>
                            </div>

                            <div className="form-grid">
                                <div className="field-group">
                                    <label>Ano de Ingresso *</label>
                                    <select name="anoIngresso" className="select-field" value={form.anoIngresso} onChange={handle} required>
                                        {ANOS.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                                <div className="field-group">
                                    <label>Semestre de Ingresso *</label>
                                    <select name="semestreIngresso" className="select-field" value={form.semestreIngresso} onChange={handle} required>
                                        <option value="1">1º Semestre</option>
                                        <option value="2">2º Semestre</option>
                                    </select>
                                </div>
                                <div className="field-group">
                                    <label>Nome completo *</label>
                                    <input name="nome" className="input-field" value={form.nome} onChange={handle} placeholder="Nome do aluno" required />
                                </div>
                                <div className="field-group">
                                    <label>CPF *</label>
                                    <input name="cpf" className="input-field" value={form.cpf} onChange={handle} placeholder="000.000.000-00" required />
                                </div>
                                <div className="field-group">
                                    <label>Data de Nascimento</label>
                                    <input name="dataNascimento" type="date" className="input-field" value={form.dataNascimento} onChange={handle} />
                                </div>
                                <div className="field-group">
                                    <label>E-mail *</label>
                                    <input name="email" type="email" className="input-field" value={form.email} onChange={handle} placeholder="aluno@ufc.br" required />
                                </div>
                                <div className="field-group">
                                    <label>Curso *</label>
                                    <input name="curso" className="input-field" value={form.curso} onChange={handle} placeholder="Ex: Engenharia de Software" required />
                                </div>
                                <div className="field-group">
                                    <label>Telefone</label>
                                    <input name="telefone" className="input-field" value={form.telefone} onChange={handle} placeholder="(85) 99999-9999" />
                                </div>
                                <div className="field-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Endereço</label>
                                    <input name="endereco" className="input-field" value={form.endereco} onChange={handle} placeholder="Rua, número, bairro, cidade" />
                                </div>
                                <div className="field-group">
                                    <label>Tipo de Aluno *</label>
                                    <select name="tipoAluno" className="select-field" value={form.tipoAluno} onChange={handle} required>
                                        <option value="NORMAL">Normal</option>
                                        <option value="ESPECIAL">Especial (outra instituição)</option>
                                    </select>
                                </div>
                                {form.tipoAluno === 'ESPECIAL' && (
                                    <div className="field-group">
                                        <label>Instituição de Origem *</label>
                                        <input name="instituicaoOrigem" className="input-field" value={form.instituicaoOrigem} onChange={handle} placeholder="Ex: IFCE Quixadá" required />
                                    </div>
                                )}
                                <div className="field-group">
                                    <label>Status *</label>
                                    <select name="status" className="select-field" value={form.status} onChange={handle} required>
                                        <option value="ATIVO">Ativo</option>
                                        <option value="TRANCADO">Trancado</option>
                                        <option value="FORMADO">Formado</option>
                                    </select>
                                </div>
                            </div>

                            {erro && <div className="alert alert-erro">{erro}</div>}
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                                <button type="submit" className="btn-primary" disabled={salvando}>{salvando ? 'Salvando...' : 'Cadastrar'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="search-bar">
                <input className="input-field" placeholder="Buscar por nome, matrícula ou curso..." value={busca} onChange={e => setBusca(e.target.value)} />
            </div>

            {loading ? <div className="table-loading">Carregando...</div> : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead><tr><th>Matrícula</th><th>Nome</th><th>Curso</th><th>Tipo</th><th>Status</th><th>Ações</th></tr></thead>
                        <tbody>
                        {filtrados.length === 0
                            ? <tr><td colSpan={6} className="table-empty">Nenhum aluno encontrado.</td></tr>
                            : filtrados.map(a => (
                                <tr key={a.matricula}>
                                    <td><code>{a.matricula}</code></td>
                                    <td className="td-nome">{a.nome}</td>
                                    <td>{a.curso}</td>
                                    <td><span className="badge badge-ativo">{(a as unknown as Record<string,string>).tipoAluno ?? 'NORMAL'}</span></td>
                                    <td><span className={`badge badge-${a.status?.toLowerCase()}`}>{a.status}</span></td>
                                    <td><button className="btn-danger-sm" onClick={() => handleDeletar(a.matricula, a.nome)}>Remover</button></td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
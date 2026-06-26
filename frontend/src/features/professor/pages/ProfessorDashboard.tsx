import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';

interface Curso { codigo: string; nome: string; }
interface Turma { id: number; codigoTurma?: string; nome: string; }
interface Disciplina { id?: number; codigo?: string; nome: string; }
interface Aluno { matricula: string; nome: string; }
interface Avaliacao { id: number; descricao: string; turmaId?: number; }

export const ProfessorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [cursos, setCursos] = useState<Curso[]>([]);
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

    const [abaPrincipal, setAbaPrincipal] = useState<'LANCAMENTOS' | 'AVALIACOES'>('LANCAMENTOS');
    const [abaLancamento, setAbaLancamento] = useState<'NOTAS' | 'FALTAS'>('NOTAS');

    const [descAvaliacao, setDescAvaliacao] = useState('');
    const [turmaIdParaAvaliacao, setTurmaIdParaAvaliacao] = useState('');

    const [selectedCurso, setSelectedCurso] = useState('');
    const [selectedTurmaId, setSelectedTurmaId] = useState('');
    const [selectedDisciplina, setSelectedDisciplina] = useState('');
    const [selectedAluno, setSelectedAluno] = useState('');

    const [avaliacaoId, setAvaliacaoId] = useState('');
    const [valorNota, setValorNota] = useState<string>('');
    const [dataFalta, setDataFalta] = useState<string>(new Date().toISOString().split('T')[0]);
    const [quantidadeFaltas, setQuantidadeFaltas] = useState<string>('2');

    const carregarDadosIniciais = () => {
        api.get('/cursos').then(res => setCursos(res.data)).catch(() => {});
        api.get('/disciplinas').then(res => setDisciplinas(res.data)).catch(() => {});
        api.get('/alunos').then(res => setAlunos(res.data)).catch(() => {});
        api.get('/turmas').then(res => setTurmas(res.data)).catch(() => {});
        api.get('/avaliacoes').then(res => setAvaliacoes(res.data)).catch(() => {});
    };

    useEffect(() => {
        carregarDadosIniciais();
    }, []);

    const handleCadastrarAvaliacao = async (e: React.FormEvent) => {
        e.preventDefault();
        const turmaNum = Number(turmaIdParaAvaliacao);
        if (!turmaNum) return alert("Selecione uma turma para a avaliação.");

        try {
            await api.post('/avaliacoes', {
                descricao: descAvaliacao,
                turmaId: turmaNum
            });
            alert("Avaliação cadastrada com sucesso!");
            setDescAvaliacao('');
            setTurmaIdParaAvaliacao('');
            carregarDadosIniciais();
        } catch (error: any) {
            alert("Erro ao cadastrar avaliação. Verifique o console.");
        }
    };

    const handleLancamentoNota = async (e: React.FormEvent) => {
        e.preventDefault();
        const notaNum = parseFloat(valorNota);
        const avaliacaoNum = Number(avaliacaoId);

        if (isNaN(notaNum) || isNaN(avaliacaoNum)) return alert("Nota ou Avaliação inválida!");

        try {
            await api.post('/boletim/notas', {
                matriculaAluno: selectedAluno,
                avaliacaoId: avaliacaoNum,
                valor: notaNum
            });
            alert("Nota lançada com sucesso!");
            setValorNota('');
        } catch (error: any) {
            alert("Erro ao lançar nota.");
        }
    };

    const handleLancamentoFrequencia = async (e: React.FormEvent) => {
        e.preventDefault();
        const turmaNum = Number(selectedTurmaId);
        const faltasNum = Number(quantidadeFaltas);

        if (!turmaNum) return alert("ID da turma não encontrado.");

        try {
            await api.post('/frequencias', {
                matriculaAluno: selectedAluno,
                turmaId: turmaNum,
                data: dataFalta,
                quantidadeFaltas: faltasNum,
                presente: false
            });
            alert("Registro de faltas salvo com sucesso!");
        } catch (error: any) {
            alert("Erro ao registrar faltas.");
        }
    };

    const inputStyle = { padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%' };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
                <div><h2>Painel do Professor</h2><p style={{ color: '#666', margin: 0 }}>Professor(a): <strong>{user?.nome}</strong></p></div>
                <button onClick={() => { logout(); navigate('/'); }} style={{ padding: '0.5rem 1rem', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button onClick={() => setAbaPrincipal('LANCAMENTOS')} style={{ padding: '0.7rem 1.5rem', background: abaPrincipal === 'LANCAMENTOS' ? '#2196F3' : '#eee', color: abaPrincipal === 'LANCAMENTOS' ? '#fff' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Lançamentos</button>
                <button onClick={() => setAbaPrincipal('AVALIACOES')} style={{ padding: '0.7rem 1.5rem', background: abaPrincipal === 'AVALIACOES' ? '#2196F3' : '#eee', color: abaPrincipal === 'AVALIACOES' ? '#fff' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Gerir Avaliações</button>
            </div>

            {abaPrincipal === 'AVALIACOES' && (
                <div style={{ marginTop: '1.5rem', border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', background: '#fcfcfc' }}>
                    <h3>Criar Nova Avaliação</h3>
                    <form onSubmit={handleCadastrarAvaliacao} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label>Descrição da Avaliação</label>
                            <input type="text" value={descAvaliacao} onChange={e => setDescAvaliacao(e.target.value)} required style={inputStyle} />
                        </div>
                        <div>
                            <label>Turma</label>
                            <select value={turmaIdParaAvaliacao} onChange={e => setTurmaIdParaAvaliacao(e.target.value)} required style={inputStyle}>
                                <option value="">-- Selecione a Turma --</option>
                                {turmas.map(t => <option key={t.id} value={t.id}>{t.codigoTurma || t.nome}</option>)}
                            </select>
                        </div>
                        <button type="submit" style={{ padding: '0.75rem', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar Avaliação</button>
                    </form>

                    <h4 style={{ marginTop: '2rem' }}>Avaliações Cadastradas</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead style={{ background: '#eee' }}>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Descrição</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID da Turma</th>
                        </tr>
                        </thead>
                        <tbody>
                        {avaliacoes.map(a => (
                            <tr key={a.id}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{a.id}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{a.descricao}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{a.turmaId}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {abaPrincipal === 'LANCAMENTOS' && (
                <>
                    <div style={{ marginTop: '1.5rem', border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', background: '#f9f9f9' }}>
                        <h3>Filtro Acadêmico</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                            <div>
                                <label>1. Curso</label>
                                <select value={selectedCurso} onChange={(e) => { setSelectedCurso(e.target.value); setSelectedTurmaId(''); setSelectedDisciplina(''); setSelectedAluno(''); }} style={inputStyle}>
                                    <option value="">-- Selecione o Curso --</option>
                                    {cursos.map(c => <option key={c.codigo} value={c.codigo}>{c.nome}</option>)}
                                </select>
                            </div>
                            <div>
                                <label>2. Turma Designada</label>
                                <select value={selectedTurmaId} onChange={(e) => setSelectedTurmaId(e.target.value)} disabled={!selectedCurso} style={inputStyle}>
                                    <option value="">-- Selecione a Turma --</option>
                                    {turmas.map(t => <option key={t.id} value={t.id}>{t.codigoTurma || t.nome}</option>)}
                                </select>
                            </div>
                            <div>
                                <label>3. Disciplina</label>
                                <select value={selectedDisciplina} onChange={(e) => setSelectedDisciplina(e.target.value)} disabled={!selectedTurmaId} style={inputStyle}>
                                    <option value="">-- Selecione a Disciplina --</option>
                                    {disciplinas.map(d => <option key={d.id} value={d.codigo || d.id}>{d.nome}</option>)}
                                </select>
                            </div>
                            <div>
                                <label>4. Aluno</label>
                                <select value={selectedAluno} onChange={(e) => setSelectedAluno(e.target.value)} disabled={!selectedDisciplina} style={inputStyle}>
                                    <option value="">-- Selecione o Aluno --</option>
                                    {alunos.map(a => <option key={a.matricula} value={a.matricula}>{a.nome}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {!selectedAluno ? (
                        <div style={{ marginTop: '1.5rem', padding: '2rem', textAlign: 'center', background: '#e3f2fd', borderRadius: '8px', border: '1px dashed #2196F3' }}>
                            <h3 style={{ color: '#1976d2', margin: 0 }}>Selecione o Aluno acima para liberar o formulário.</h3>
                        </div>
                    ) : (
                        <div style={{ border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', marginTop: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                <button onClick={() => setAbaLancamento('NOTAS')} style={{ padding: '0.5rem 1rem', background: abaLancamento === 'NOTAS' ? '#2196F3' : '#eee', color: abaLancamento === 'NOTAS' ? '#fff' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Lançar Notas</button>
                                <button onClick={() => setAbaLancamento('FALTAS')} style={{ padding: '0.5rem 1rem', background: abaLancamento === 'FALTAS' ? '#FF9800' : '#eee', color: abaLancamento === 'FALTAS' ? '#fff' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Lançar Frequência</button>
                            </div>

                            {abaLancamento === 'NOTAS' && (
                                <form onSubmit={handleLancamentoNota}>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <label>Avaliação</label>
                                            <select value={avaliacaoId} onChange={(e) => setAvaliacaoId(e.target.value)} style={inputStyle} required>
                                                <option value="">-- Selecione a Avaliação --</option>
                                                {avaliacoes
                                                    .filter(a => String(a.turmaId) === String(selectedTurmaId))
                                                    .map(a => <option key={a.id} value={a.id}>{a.descricao} (ID: {a.id})</option>)
                                                }
                                            </select>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label>Nota (0.0 a 10.0)</label>
                                            <input type="number" step="0.1" min="0" max="10" value={valorNota} onChange={(e) => setValorNota(e.target.value)} required style={inputStyle} />
                                        </div>
                                    </div>
                                    <button type="submit" style={{ padding: '0.75rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>Salvar Nota</button>
                                </form>
                            )}

                            {abaLancamento === 'FALTAS' && (
                                <form onSubmit={handleLancamentoFrequencia}>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <label>Data</label>
                                            <input type="date" value={dataFalta} onChange={(e) => setDataFalta(e.target.value)} required style={inputStyle} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label>Qtd de Faltas</label>
                                            <input type="number" min="1" value={quantidadeFaltas} onChange={(e) => setQuantidadeFaltas(e.target.value)} required style={inputStyle} />
                                        </div>
                                    </div>
                                    <button type="submit" style={{ padding: '0.75rem', background: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>Salvar Frequência</button>
                                </form>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
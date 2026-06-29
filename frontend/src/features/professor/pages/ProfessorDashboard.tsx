import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';

interface Curso { codigo: string; nome: string; }
// 💡 Adicionado professor para garantir a leitura correta do DTO
interface Turma { id: number; codigoTurma?: string; nome?: string; disciplinaCodigo?: string; disciplina?: any; professorId?: number; professor?: any; }
interface Disciplina { id?: number; codigo?: string; nome: string; codigoCurso?: string; nomeCurso?: string; curso?: any; }
interface Avaliacao { id: number; descricao: string; turmaId?: number; peso: number; }
interface Matricula { id: number; matriculaAluno: string; nomeAluno: string; }

export const ProfessorDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [cursos, setCursos] = useState<Curso[]>([]);
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [alunosMatriculadosDaTurma, setAlunosMatriculadosDaTurma] = useState<Matricula[]>([]);
    const [avaliacoesTodas, setAvaliacoesTodas] = useState<Avaliacao[]>([]);
    const [avaliacoesDaTurmaSelecionada, setAvaliacoesDaTurmaSelecionada] = useState<Avaliacao[]>([]);

    const [abaPrincipal, setAbaPrincipal] = useState<'LANCAMENTOS' | 'AVALIACOES'>('LANCAMENTOS');
    const [abaLancamento, setAbaLancamento] = useState<'NOTAS' | 'FALTAS'>('NOTAS');

    const [descAvaliacao, setDescAvaliacao] = useState('');
    const [turmaIdParaAvaliacao, setTurmaIdParaAvaliacao] = useState('');
    const [pesoAvaliacaoCriar, setPesoAvaliacaoCriar] = useState('1');

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
        api.get('/turmas').then(res => setTurmas(res.data)).catch(() => {});
        api.get('/avaliacoes').then(res => setAvaliacoesTodas(res.data)).catch(() => {});
    };

    useEffect(() => { carregarDadosIniciais(); }, []);

    // 💡 A MÁGICA DA AUTORIZAÇÃO AQUI:
    // Filtramos as turmas para manter APENAS as que pertencem ao professor logado.
    const turmasDoProfessor = turmas.filter(t =>
        String(t.professorId) === String(user?.idOuMatricula) ||
        String(t.professor?.id) === String(user?.idOuMatricula)
    );

    useEffect(() => {
        if (selectedTurmaId) {
            const turma = turmas.find(t => String(t.id) === selectedTurmaId);
            if (turma) {
                const codigoDisc = turma.disciplina?.codigo || turma.disciplinaCodigo || turma.disciplina?.id;
                const disciplinaEncontrada = disciplinas.find(d => String(d.codigo) === String(codigoDisc) || String(d.id) === String(codigoDisc));

                if (disciplinaEncontrada) {
                    setSelectedDisciplina(disciplinaEncontrada.codigo || String(disciplinaEncontrada.id));
                    const refCurso = disciplinaEncontrada.codigoCurso || disciplinaEncontrada.nomeCurso || disciplinaEncontrada.curso?.codigo || disciplinaEncontrada.curso?.nome;
                    const cursoEncontrado = cursos.find(c => String(c.codigo) === String(refCurso) || String(c.nome) === String(refCurso));

                    if (cursoEncontrado) setSelectedCurso(cursoEncontrado.codigo);
                    else setSelectedCurso('');
                } else {
                    setSelectedDisciplina(''); setSelectedCurso('');
                }
            }

            api.get(`/matriculas/turma/${selectedTurmaId}`)
                .then(res => setAlunosMatriculadosDaTurma(res.data))
                .catch(() => setAlunosMatriculadosDaTurma([]));

            api.get(`/avaliacoes/turma/${selectedTurmaId}`)
                .then(res => { setAvaliacoesDaTurmaSelecionada(res.data); setAvaliacaoId(''); })
                .catch(() => setAvaliacoesDaTurmaSelecionada([]));
        } else {
            setSelectedDisciplina(''); setSelectedCurso(''); setSelectedAluno('');
            setAlunosMatriculadosDaTurma([]); setAvaliacoesDaTurmaSelecionada([]); setAvaliacaoId('');
        }
    }, [selectedTurmaId, turmas, disciplinas, cursos]);

    const handleCadastrarAvaliacao = async (e: React.FormEvent) => { e.preventDefault(); const turmaNum = Number(turmaIdParaAvaliacao); if (!turmaNum) return alert("Selecione uma turma para a avaliação."); try { await api.post('/avaliacoes', { descricao: descAvaliacao, turmaId: turmaNum, peso: Number(pesoAvaliacaoCriar) }); alert("Avaliação cadastrada com sucesso!"); setDescAvaliacao(''); setPesoAvaliacaoCriar('1'); setTurmaIdParaAvaliacao(''); carregarDadosIniciais(); } catch (error: any) { alert("Erro ao cadastrar avaliação."); } };
    const handleLancamentoNota = async (e: React.FormEvent) => { e.preventDefault(); const notaNum = parseFloat(valorNota); const avaliacaoNum = Number(avaliacaoId); if (isNaN(notaNum) || isNaN(avaliacaoNum)) return alert("Nota ou Avaliação inválida!"); try { await api.post('/boletim/notas', { matriculaAluno: selectedAluno, avaliacaoId: avaliacaoNum, valor: notaNum }); alert("Nota lançada com sucesso!"); setValorNota(''); } catch (error: any) { alert("Erro ao lançar nota."); } };
    const handleLancamentoFrequencia = async (e: React.FormEvent) => { e.preventDefault(); const turmaNum = Number(selectedTurmaId); const faltasNum = Number(quantidadeFaltas); if (!turmaNum) return alert("ID da turma não encontrado."); try { await api.post('/frequencias', { matriculaAluno: selectedAluno, turmaId: turmaNum, data: dataFalta, quantidadeFaltas: faltasNum, presente: false }); alert("Registro de faltas salvo com sucesso!"); } catch (error: any) { alert("Erro ao registrar faltas."); } };

    const inputStyle = { padding: '0.8rem', border: '1px solid #D1D5DB', borderRadius: '4px', width: '100%', fontSize: '1rem', backgroundColor: '#FAFAFA', boxSizing: 'border-box' as const };
    const cardStyle = { background: '#FFFFFF', borderRadius: '8px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '1.5rem' };
    const btnStyle = { padding: '0.8rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'opacity 0.2s' };

    return (
        <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <nav style={{ backgroundColor: '#004B87', padding: '1rem 2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h2 style={{ margin: 0, borderRight: '1px solid rgba(255,255,255,0.3)', paddingRight: '1rem' }}>SIGA</h2>
                    <span style={{ fontSize: '1.1rem' }}>Portal do Docente</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Prof. {user?.nome}</span>
                    <button onClick={() => { logout(); navigate('/'); }} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
                </div>
            </nav>

            <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button onClick={() => setAbaPrincipal('LANCAMENTOS')} style={{ ...btnStyle, flex: 1, background: abaPrincipal === 'LANCAMENTOS' ? '#004B87' : '#E0E0E0', color: abaPrincipal === 'LANCAMENTOS' ? '#fff' : '#333' }}>
                        📖 Diário de Classe (Lançamentos)
                    </button>
                    <button onClick={() => setAbaPrincipal('AVALIACOES')} style={{ ...btnStyle, flex: 1, background: abaPrincipal === 'AVALIACOES' ? '#004B87' : '#E0E0E0', color: abaPrincipal === 'AVALIACOES' ? '#fff' : '#333' }}>
                        ⚙️ Estruturar Avaliações
                    </button>
                </div>

                {abaPrincipal === 'AVALIACOES' && (
                    <div style={{ ...cardStyle, borderTop: '4px solid #004B87' }}>
                        <h3 style={{ marginTop: 0, color: '#333' }}>Criar Nova Avaliação</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Defina a estrutura de notas de uma turma antes de realizar os lançamentos.</p>
                        <form onSubmit={handleCadastrarAvaliacao} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#555' }}>Descrição da Avaliação</label>
                                <input type="text" placeholder="Ex: Prova 1, Seminário, P2" value={descAvaliacao} onChange={e => setDescAvaliacao(e.target.value)} required style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{ flex: 2 }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#555' }}>Turma Alvo</label>
                                    {/* 💡 Dropdown blindado: Exibe apenas as turmas DESTE professor */}
                                    <select value={turmaIdParaAvaliacao} onChange={e => setTurmaIdParaAvaliacao(e.target.value)} required style={inputStyle}>
                                        <option value="">-- Selecione a Turma --</option>
                                        {turmasDoProfessor.map(t => <option key={t.id} value={t.id}>{t.codigoTurma || t.nome}</option>)}
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#555' }}>Peso na Média</label>
                                    <input type="number" min="1" placeholder="Ex: 1, 2, 3" value={pesoAvaliacaoCriar} onChange={e => setPesoAvaliacaoCriar(e.target.value)} required style={inputStyle} />
                                </div>
                            </div>
                            <button type="submit" style={{ ...btnStyle, background: '#4CAF50', color: 'white', marginTop: '0.5rem' }}>Salvar Avaliação na Turma</button>
                        </form>
                    </div>
                )}

                {abaPrincipal === 'LANCAMENTOS' && (
                    <>
                        <div style={{ ...cardStyle, borderLeft: '4px solid #004B87', padding: '1.5rem 2rem' }}>
                            <h3 style={{ marginTop: 0, color: '#333' }}>Filtro de Turma</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Selecione a Turma que você deseja gerenciar. O sistema buscará os alunos oficialmente matriculados.</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#004B87' }}>1. Turma Designada</label>
                                    {/* 💡 Dropdown blindado: Exibe apenas as turmas DESTE professor */}
                                    <select value={selectedTurmaId} onChange={(e) => setSelectedTurmaId(e.target.value)} style={{ ...inputStyle, border: '1px solid #004B87' }}>
                                        <option value="">-- Selecione a Turma --</option>
                                        {turmasDoProfessor.map(t => <option key={t.id} value={t.id}>{t.codigoTurma || t.nome}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#888' }}>2. Disciplina (Automático)</label>
                                    <select value={selectedDisciplina} disabled style={{ ...inputStyle, background: '#EAEAEA', color: '#666' }}>
                                        <option value="">-- --</option>
                                        {disciplinas.map(d => <option key={d.id} value={d.codigo || d.id}>{d.nome}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#888' }}>3. Curso (Automático)</label>
                                    <select value={selectedCurso} disabled style={{ ...inputStyle, background: '#EAEAEA', color: '#666' }}>
                                        <option value="">-- --</option>
                                        {cursos.map(c => <option key={c.codigo} value={c.codigo}>{c.nome}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#004B87' }}>4. Aluno da Turma</label>
                                    <select value={selectedAluno} onChange={(e) => setSelectedAluno(e.target.value)} disabled={!selectedTurmaId} style={{ ...inputStyle, border: selectedTurmaId ? '1px solid #004B87' : '1px solid #ccc' }}>
                                        <option value="">-- Selecione o Aluno --</option>
                                        {alunosMatriculadosDaTurma.map(m => <option key={m.matriculaAluno} value={m.matriculaAluno}>{m.nomeAluno}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {!selectedAluno ? (
                            <div style={{ background: '#E3F2FD', padding: '2rem', textAlign: 'center', borderRadius: '8px', border: '1px dashed #2196F3', color: '#1976D2' }}>
                                <h3 style={{ margin: 0 }}>Selecione um aluno no filtro acima para liberar o diário.</h3>
                            </div>
                        ) : (
                            <div style={cardStyle}>
                                <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #EEE', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                                    <button onClick={() => setAbaLancamento('NOTAS')} style={{ ...btnStyle, flex: 1, background: abaLancamento === 'NOTAS' ? '#2196F3' : '#F0F0F0', color: abaLancamento === 'NOTAS' ? '#fff' : '#555' }}>Lançar Notas</button>
                                    <button onClick={() => setAbaLancamento('FALTAS')} style={{ ...btnStyle, flex: 1, background: abaLancamento === 'FALTAS' ? '#FF9800' : '#F0F0F0', color: abaLancamento === 'FALTAS' ? '#fff' : '#555' }}>Lançar Frequência</button>
                                </div>

                                {abaLancamento === 'NOTAS' && (
                                    <form onSubmit={handleLancamentoNota}>
                                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                            <div style={{ flex: 2 }}>
                                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#555' }}>Avaliação</label>
                                                <select value={avaliacaoId} onChange={(e) => setAvaliacaoId(e.target.value)} style={inputStyle} required>
                                                    <option value="">-- Selecione a Avaliação --</option>
                                                    {avaliacoesDaTurmaSelecionada.map(a => <option key={a.id} value={a.id}>{a.descricao} (Peso: {a.peso})</option>)}
                                                </select>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#555' }}>Nota Obtida</label>
                                                <input type="number" step="0.1" min="0" max="10" placeholder="0.0 a 10.0" value={valorNota} onChange={(e) => setValorNota(e.target.value)} required style={inputStyle} />
                                            </div>
                                        </div>
                                        <button type="submit" style={{ ...btnStyle, background: '#4CAF50', color: 'white', width: '100%' }}>Registrar Nota no Boletim</button>
                                    </form>
                                )}

                                {abaLancamento === 'FALTAS' && (
                                    <form onSubmit={handleLancamentoFrequencia}>
                                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#555' }}>Data da Aula</label>
                                                <input type="date" value={dataFalta} onChange={(e) => setDataFalta(e.target.value)} required style={inputStyle} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#555' }}>Quantidade de Faltas</label>
                                                <input type="number" min="1" value={quantidadeFaltas} onChange={(e) => setQuantidadeFaltas(e.target.value)} required style={inputStyle} />
                                            </div>
                                        </div>
                                        <button type="submit" style={{ ...btnStyle, background: '#FF9800', color: 'white', width: '100%' }}>Registrar Ausência</button>
                                    </form>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
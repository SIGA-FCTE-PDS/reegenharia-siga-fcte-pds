import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';

interface Turma { id: number; codigoTurma?: string; nome?: string; disciplinaCodigo?: string; disciplina?: any; semestreLetivo?: string; }
interface Disciplina { id: number; codigo: string; nome: string; codigoCurso?: string; nomeCurso?: string; curso?: any; }
interface Nota { id: number; valor: number; descricaoAvaliacao?: string; pesoAvaliacao?: number; avaliacao?: { id: number; descricao: string; peso: number; }; }
interface Notificacao { id: number; mensagem: string; lida: boolean; dataCriacao: string; }
interface Aluno { matricula: string; nome: string; email: string; cursoCodigo?: string; curso?: any; }
interface Curso { codigo: string; nome: string; }
interface Matricula { id: number; turmaId: number; codigoTurma?: string; statusMatricula: string; }

export const AlunoDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [matriculaReal, setMatriculaReal] = useState('');
    const [cursoRealNome, setCursoRealNome] = useState('');
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [notas, setNotas] = useState<Nota[]>([]);
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [minhasMatriculas, setMinhasMatriculas] = useState<Matricula[]>([]);
    const [selectedTurmaId, setSelectedTurmaId] = useState('');
    const [showNotificacoes, setShowNotificacoes] = useState(false);

    useEffect(() => {
        api.get('/cursos').then(res => setCursos(res.data)).catch(() => {});
        api.get('/disciplinas').then(res => setDisciplinas(res.data)).catch(() => {});

        api.get('/alunos').then(res => {
            const alunos: Aluno[] = res.data;
            const alunoLogado = alunos.find(a => a.matricula === user?.idOuMatricula || a.email === user?.email || a.nome === user?.nome);
            if (alunoLogado) {
                setMatriculaReal(alunoLogado.matricula);
                setCursoRealNome(alunoLogado.curso?.nome || alunoLogado.curso || '');
            } else if (user?.idOuMatricula) {
                setMatriculaReal(user.idOuMatricula);
            }
        }).catch(() => {});
    }, [user]);

    useEffect(() => {
        api.get('/turmas').then(res => setTurmas(res.data)).catch(() => {});

        if (matriculaReal) {
            api.get(`/notificacoes/aluno/${matriculaReal}`).then(res => setNotificacoes(res.data)).catch(() => {});

            api.get(`/matriculas/aluno/${matriculaReal}`)
                .then(res => setMinhasMatriculas(res.data))
                .catch(() => setMinhasMatriculas([]));
        }
    }, [matriculaReal]);

    useEffect(() => {
        if (selectedTurmaId && matriculaReal) {
            api.get(`/boletim/notas`, { params: { matriculaAluno: matriculaReal, turmaId: selectedTurmaId } })
                .then(res => setNotas(res.data))
                .catch(() => setNotas([]));
        } else {
            setNotas([]);
        }
    }, [selectedTurmaId, matriculaReal]);

    const obterNomeDisciplina = (turma: Turma) => {
        const codigoDisc = turma.disciplina?.codigo || turma.disciplinaCodigo || turma.disciplina?.id;
        if (!codigoDisc) return 'Disciplina Indefinida';
        const disc = disciplinas.find(d => String(d.codigo) === String(codigoDisc) || String(d.id) === String(codigoDisc));
        return disc ? disc.nome : codigoDisc;
    };

    // 💡 FILTRO BLINDADO E HIPER-TOLERANTE: Evita falhas de tipos entre o BD e o JavaScript
    const turmasFiltradas = turmas.filter(t => {
        return minhasMatriculas.some(m => {
            // Verifica o ID ou o código da turma
            const matchId = String(m.turmaId) === String(t.id);
            const matchCodigo = m.codigoTurma && t.codigoTurma && String(m.codigoTurma) === String(t.codigoTurma);

            // Verifica se está ativa (limpando espaços e forçando maiúsculas)
            const isActive = m.statusMatricula ? String(m.statusMatricula).trim().toUpperCase() === 'ATIVA' : false;

            return (matchId || matchCodigo) && isActive;
        });
    });

    const marcarNotificacoesComoLidas = () => setShowNotificacoes(!showNotificacoes);
    const countNaoLidas = notificacoes.filter(n => !n.lida).length;

    const getPeso = (n: Nota) => n.pesoAvaliacao || n.avaliacao?.peso || 1;
    const getDesc = (n: Nota) => n.descricaoAvaliacao || n.avaliacao?.descricao || `Avaliação #${n.id}`;

    const somaPesos = notas.reduce((acc, curr) => acc + getPeso(curr), 0);
    const somaNotasPonderadas = notas.reduce((acc, curr) => acc + (curr.valor * getPeso(curr)), 0);
    const mediaParcial = somaPesos > 0 ? (somaNotasPonderadas / somaPesos) : null;
    const statusDisciplina = mediaParcial !== null ? (mediaParcial >= 7 ? 'Aprovado' : (mediaParcial >= 4 ? 'Em Recuperação' : 'Reprovado')) : 'Pendente';

    return (
        <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <nav style={{ backgroundColor: '#004B87', padding: '1rem 2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h2 style={{ margin: 0, borderRight: '1px solid rgba(255,255,255,0.3)', paddingRight: '1rem' }}>SIGA</h2>
                    <span style={{ fontSize: '1.1rem' }}>Portal do Aluno</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={marcarNotificacoesComoLidas}>
                        <span style={{ fontSize: '1.5rem' }}>🔔</span>
                        {countNaoLidas > 0 && (
                            <span style={{ position: 'absolute', top: '-5px', right: '-8px', background: '#F44336', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.75rem', fontWeight: 'bold' }}>{countNaoLidas}</span>
                        )}
                        {showNotificacoes && (
                            <div style={{ position: 'absolute', top: '35px', right: '0', width: '300px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', zIndex: 10, color: '#333' }}>
                                <div style={{ padding: '1rem', borderBottom: '1px solid #eee', fontWeight: 'bold', background: '#FAFAFA', borderRadius: '8px 8px 0 0' }}>Notificações Acadêmicas</div>
                                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                    {notificacoes.length === 0 ? <p style={{ padding: '1rem', color: '#666', textAlign: 'center', margin: 0 }}>Nenhuma notificação.</p> : notificacoes.map(n => (
                                        <div key={n.id} style={{ padding: '1rem', borderBottom: '1px solid #eee', background: n.lida ? '#fff' : '#E3F2FD' }}>
                                            <p style={{ margin: 0, fontSize: '0.9rem' }}>{n.mensagem}</p>
                                            <span style={{ fontSize: '0.75rem', color: '#888' }}>{n.dataCriacao || 'Recente'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={() => { logout(); navigate('/'); }} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', color: 'white', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s' }}>Sair</button>
                </div>
            </nav>

            <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
                <div style={{ background: '#FFFFFF', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div><span style={{ display: 'block', color: '#666', fontSize: '0.85rem', textTransform: 'uppercase' }}>Discente</span><strong style={{ fontSize: '1.1rem', color: '#333' }}>{user?.nome}</strong></div>
                    <div><span style={{ display: 'block', color: '#666', fontSize: '0.85rem', textTransform: 'uppercase' }}>Matrícula</span><strong style={{ fontSize: '1.1rem', color: '#333' }}>{matriculaReal || 'Carregando...'}</strong></div>
                    {cursoRealNome && <div><span style={{ display: 'block', color: '#666', fontSize: '0.85rem', textTransform: 'uppercase' }}>Vínculo Curricular</span><strong style={{ fontSize: '1.1rem', color: '#333' }}>{cursoRealNome}</strong></div>}
                </div>

                <div style={{ background: '#FFFFFF', borderLeft: '4px solid #004B87', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Consultar Diário de Classe</h3>

                    {turmasFiltradas.length === 0 ? (
                        <p style={{ color: '#F44336', fontWeight: 'bold' }}>Você não possui matrículas ativas em turmas no momento.</p>
                    ) : (
                        <select value={selectedTurmaId} onChange={e => setSelectedTurmaId(e.target.value)} style={{ padding: '0.8rem', border: '1px solid #D1D5DB', borderRadius: '4px', width: '100%', maxWidth: '500px', fontSize: '1rem', backgroundColor: '#FAFAFA' }}>
                            <option value="">-- Selecione o Componente Curricular --</option>
                            {turmasFiltradas.map(t => (
                                <option key={t.id} value={t.id}>{obterNomeDisciplina(t)} - Turma {t.codigoTurma || t.nome}</option>
                            ))}
                        </select>
                    )}
                </div>

                {selectedTurmaId && (
                    <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>

                        <div style={{ background: '#FFFFFF', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <div style={{ background: '#004B87', color: 'white', padding: '1rem 1.5rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Resultado Oficial: {obterNomeDisciplina(turmas.find(t => String(t.id) === selectedTurmaId) as Turma)}</h3>
                            </div>
                            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ display: 'block', color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Média Ponderada</span>
                                    <strong style={{ fontSize: '3rem', color: mediaParcial && mediaParcial >= 7 ? '#4CAF50' : '#F44336' }}>
                                        {mediaParcial !== null ? mediaParcial.toFixed(1) : '-'}
                                    </strong>
                                </div>
                                <div style={{ width: '1px', background: '#EEE', height: '60px' }}></div>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ display: 'block', color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Situação Atual</span>
                                    <strong style={{ fontSize: '1.8rem', color: statusDisciplina === 'Aprovado' ? '#4CAF50' : (statusDisciplina === 'Pendente' ? '#9E9E9E' : '#F44336') }}>
                                        {statusDisciplina}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: '#FFFFFF', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid #EEE' }}>
                                <h4 style={{ margin: 0, color: '#333', fontSize: '1.1rem' }}>Detalhamento das Avaliações</h4>
                            </div>
                            {notas.length === 0 ? (
                                <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>Nenhum registro de nota encontrado para este diário.</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                    <tr style={{ background: '#FAFAFA' }}>
                                        <th style={{ borderBottom: '1px solid #DDD', padding: '1rem 1.5rem', textAlign: 'left', color: '#555' }}>Avaliação</th>
                                        <th style={{ borderBottom: '1px solid #DDD', padding: '1rem 1.5rem', textAlign: 'center', color: '#555' }}>Peso na Média</th>
                                        <th style={{ borderBottom: '1px solid #DDD', padding: '1rem 1.5rem', textAlign: 'center', color: '#555' }}>Nota Obtida</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {notas.map((n, i) => (
                                        <tr key={n.id || i} style={{ borderBottom: '1px solid #F0F0F0' }}>
                                            <td style={{ padding: '1rem 1.5rem', color: '#333' }}>{getDesc(n)}</td>
                                            <td style={{ padding: '1rem 1.5rem', textAlign: 'center', color: '#888' }}>x{getPeso(n)}</td>
                                            <td style={{ padding: '1rem 1.5rem', textAlign: 'center', fontWeight: 'bold', color: '#333', fontSize: '1.1rem' }}>{n.valor.toFixed(1)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
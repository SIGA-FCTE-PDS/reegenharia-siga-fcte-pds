import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';

interface Turma { id: number; codigoTurma?: string; nome: string; disciplinaCodigo?: string; }
interface Disciplina { id: number; codigo: string; nome: string; }
interface Nota { id: number; valor: number; descricaoAvaliacao?: string; }
interface Notificacao { id: number; mensagem: string; lida: boolean; dataCriacao: string; }
interface Aluno { matricula: string; nome: string; email: string; cursoCodigo?: string; curso?: string; }
interface Curso { codigo: string; nome: string; }

export const AlunoDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [matriculaReal, setMatriculaReal] = useState('');
    const [cursoReal, setCursoReal] = useState('');
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [notas, setNotas] = useState<Nota[]>([]);
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [selectedTurmaId, setSelectedTurmaId] = useState('');
    const [showNotificacoes, setShowNotificacoes] = useState(false);

    useEffect(() => {
        api.get('/cursos').then(res => setCursos(res.data)).catch(() => {});
        api.get('/disciplinas').then(res => setDisciplinas(res.data)).catch(() => {});

        api.get('/alunos').then(res => {
            const alunos: Aluno[] = res.data;
            const alunoLogado = alunos.find(a => a.email === user?.email || a.nome === user?.nome);
            if (alunoLogado) {
                setMatriculaReal(alunoLogado.matricula);
                setCursoReal(alunoLogado.curso || alunoLogado.cursoCodigo || '');
            } else if (user?.matricula || user?.username) {
                setMatriculaReal(user.matricula || user.username);
            }
        }).catch(() => {});
    }, [user]);

    useEffect(() => {
        api.get('/turmas').then(res => {
            setTurmas(res.data);
        }).catch(() => {});

        if (matriculaReal) {
            api.get(`/notificacoes/aluno/${matriculaReal}`).then(res => {
                setNotificacoes(res.data);
            }).catch(() => {});
        }
    }, [matriculaReal]);

    useEffect(() => {
        if (selectedTurmaId && matriculaReal) {
            api.get(`/boletim/notas`, {
                params: { matriculaAluno: matriculaReal, turmaId: selectedTurmaId }
            }).then(res => setNotas(res.data)).catch(() => setNotas([]));
        } else {
            setNotas([]);
        }
    }, [selectedTurmaId, matriculaReal]);

    const marcarNotificacoesComoLidas = () => {
        setShowNotificacoes(!showNotificacoes);
    };

    const obterNomeDisciplina = (codigo?: string) => {
        if (!codigo) return 'Disciplina';
        const disc = disciplinas.find(d => d.codigo === codigo || String(d.id) === codigo);
        return disc ? disc.nome : codigo;
    };

    const obterNomeCurso = (codigoCurso: string) => {
        const cursoEncontrado = cursos.find(c => c.codigo === codigoCurso);
        return cursoEncontrado ? cursoEncontrado.nome : codigoCurso;
    };

    const countNaoLidas = notificacoes.filter(n => !n.lida).length;
    const selectStyle = { padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', maxWidth: '400px' };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '1rem', position: 'relative' }}>
                <div>
                    <h2>Painel do Aluno</h2>
                    <p style={{ color: '#666', margin: 0, display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span>Aluno: <strong>{user?.nome}</strong></span>
                        <span>Matrícula: <strong>{matriculaReal || 'Carregando...'}</strong></span>
                        {cursoReal && <span>Curso: <strong>{obterNomeCurso(cursoReal)}</strong></span>}
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={marcarNotificacoesComoLidas}>
                        <span style={{ fontSize: '1.5rem' }}>🔔</span>
                        {countNaoLidas > 0 && (
                            <span style={{ position: 'absolute', top: '-5px', right: '-10px', background: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                {countNaoLidas}
                            </span>
                        )}
                        {showNotificacoes && (
                            <div style={{ position: 'absolute', top: '35px', right: '0', width: '350px', background: 'white', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 10 }}>
                                <div style={{ padding: '1rem', borderBottom: '1px solid #eee', fontWeight: 'bold', background: '#f9f9f9', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>Notificações do Sistema</div>
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {notificacoes.length === 0 ? (
                                        <p style={{ padding: '1rem', color: '#666', margin: 0, textAlign: 'center' }}>Nenhuma notificação.</p>
                                    ) : (
                                        notificacoes.map(n => (
                                            <div key={n.id} style={{ padding: '1rem', borderBottom: '1px solid #eee', background: n.lida ? '#fff' : '#fff3e0' }}>
                                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#333' }}>{n.mensagem}</p>
                                                <span style={{ fontSize: '0.75rem', color: '#999' }}>{n.dataCriacao || 'Recente'}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={() => { logout(); navigate('/'); }} style={{ padding: '0.5rem 1rem', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
                </div>
            </div>

            <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', background: '#f9f9f9' }}>
                <h3>Boletim Acadêmico</h3>
                <p style={{ color: '#555', marginBottom: '1rem' }}>Selecione a turma e a disciplina para consultar o seu rendimento.</p>

                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Disciplina / Turma</label>
                <select value={selectedTurmaId} onChange={e => setSelectedTurmaId(e.target.value)} style={selectStyle}>
                    <option value="">-- Selecione uma opção --</option>
                    {turmas.map(t => (
                        <option key={t.id} value={t.id}>
                            {obterNomeDisciplina(t.disciplinaCodigo)} - Turma {t.codigoTurma || t.nome}
                        </option>
                    ))}
                </select>
            </div>

            {selectedTurmaId && (
                <div style={{ marginTop: '2rem', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ background: '#2196F3', color: 'white', padding: '1rem' }}>
                        <h3 style={{ margin: 0 }}>Resultados das Avaliações</h3>
                    </div>
                    <div style={{ padding: '1.5rem', background: '#fff' }}>
                        {notas.length === 0 ? (
                            <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>Nenhuma nota registrada para esta disciplina ainda.</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#f5f5f5' }}>
                                <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Avaliação</th>
                                    <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Nota Obtida</th>
                                    <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {notas.map((n, i) => (
                                    <tr key={n.id || i}>
                                        <td style={{ border: '1px solid #ddd', padding: '12px' }}>{n.descricaoAvaliacao || `Avaliação #${n.id}`}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center', fontWeight: 'bold', color: n.valor >= 7 ? '#4CAF50' : '#F44336' }}>
                                            {n.valor.toFixed(1)}
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                                            {n.valor >= 7 ? 'Aprovado' : (n.valor >= 4 ? 'Em Recuperação' : 'Reprovado')}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
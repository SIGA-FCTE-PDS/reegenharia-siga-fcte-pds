import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import type { User } from '../../../contexts/AuthContext';
import { api } from '../../../services/api';

export const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [emailProfessor, setEmailProfessor] = useState('');
    const [matriculaAluno, setMatriculaAluno] = useState('');

    const handleLoginSecretaria = () => {
        const user: User = { idOuMatricula: 'admin', nome: 'Secretaria', role: 'SECRETARIA' };
        login(user);
        navigate('/secretaria');
    };

    const handleLoginProfessor = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.get(`/professores/email/${emailProfessor}`);
            const professor = response.data;
            const user: User = { idOuMatricula: professor.id.toString(), nome: professor.nome, role: 'PROFESSOR' };
            login(user);
            navigate('/professor');
        } catch (error) {
            alert('Professor não encontrado no banco de dados!');
        }
    };

    const handleLoginAluno = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!matriculaAluno) return alert('Digite a matrícula');
        try {
            const response = await api.get(`/alunos/${matriculaAluno}`);
            const aluno = response.data;
            const user: User = { idOuMatricula: aluno.matricula, nome: aluno.nome, role: 'ALUNO' };
            login(user);
            navigate('/aluno');
        } catch (error) {
            alert('❌ Matrícula não encontrada no sistema!');
        }
    };

    const cardStyle = {
        background: '#FFFFFF',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        borderTop: '4px solid #004B87',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'space-between'
    };

    const inputStyle = {
        padding: '0.8rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        width: '100%',
        marginBottom: '1rem',
        boxSizing: 'border-box' as const,
        fontSize: '1rem'
    };

    const btnStyle = {
        padding: '0.8rem 1rem',
        background: '#004B87',
        color: '#FFF',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
        width: '100%',
        transition: 'background 0.3s'
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F8', display: 'flex', flexDirection: 'column' }}>
            {/* Header Institucional */}
            <header style={{ backgroundColor: '#004B87', padding: '2rem', color: 'white', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h1 style={{ margin: 0, fontSize: '2.5rem', letterSpacing: '1px' }}>SIGA - FCTE</h1>
                <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '1.1rem' }}>Sistema Integrado de Gestão Acadêmica</p>
            </header>

            {/* Área Principal */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem' }}>
                <h2 style={{ color: '#333', marginBottom: '2rem', fontWeight: 600 }}>Selecione seu portal de acesso</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1000px' }}>

                    {/* Card Secretaria */}
                    <div style={cardStyle}>
                        <div>
                            <h3 style={{ color: '#004B87', marginTop: 0 }}>Portal da Secretaria</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>Acesso exclusivo para administradores do sistema e gestão acadêmica.</p>
                        </div>
                        <button onClick={handleLoginSecretaria} style={{ ...btnStyle, background: '#4CAF50' }}>Acessar Painel Admin</button>
                    </div>

                    {/* Card Professor */}
                    <div style={cardStyle}>
                        <div>
                            <h3 style={{ color: '#004B87', marginTop: 0 }}>Portal do Professor</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Lançamento de notas, frequências e criação de avaliações.</p>
                        </div>
                        <form onSubmit={handleLoginProfessor}>
                            <input type="email" placeholder="E-mail (ex: prof@ufc.br)" value={emailProfessor} onChange={(e) => setEmailProfessor(e.target.value)} style={inputStyle} required />
                            <button type="submit" style={btnStyle}>Entrar como Professor</button>
                        </form>
                    </div>

                    {/* Card Aluno */}
                    <div style={cardStyle}>
                        <div>
                            <h3 style={{ color: '#004B87', marginTop: 0 }}>Portal do Aluno</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Consulta de boletins, histórico acadêmico.</p>
                        </div>
                        <form onSubmit={handleLoginAluno}>
                            <input type="text" placeholder="Número de Matrícula" value={matriculaAluno} onChange={(e) => setMatriculaAluno(e.target.value)} style={inputStyle} required />
                            <button type="submit" style={btnStyle}>Entrar como Aluno</button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import type { User } from '../../../contexts/AuthContext';
import { api } from '../../../services/api';

export const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    // Estados dos formulários
    const [emailProfessor, setEmailProfessor] = useState('');
    const [matriculaAluno, setMatriculaAluno] = useState('');

    const handleLoginSecretaria = () => {
        const user: User = { idOuMatricula: 'admin', nome: 'Secretaria', role: 'SECRETARIA' };
        login(user);
        navigate('/secretaria');
    };

    // 2. Login do Professor
    const handleLoginProfessor = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.get(`/professores/email/${emailProfessor}`);
            const professor = response.data;

            const user: User = {
                idOuMatricula: professor.id.toString(),
                nome: professor.nome,
                role: 'PROFESSOR'
            };

            login(user);
            navigate('/professor');
        } catch (error) {
            alert('Professor não encontrado no banco de dados!');
        }
    };

    // 3. Login do Aluno
    const handleLoginAluno = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!matriculaAluno) return alert('Digite a matrícula');

        try {
            // Chama o backend para verificar se o aluno realmente existe
            const response = await api.get(`/alunos/${matriculaAluno}`);
            const aluno = response.data;

            const user: User = {
                idOuMatricula: aluno.matricula,
                nome: aluno.nome, // Pega o nome verdadeiro que veio do banco!
                role: 'ALUNO'
            };

            login(user);
            navigate('/aluno');
        } catch (error) {
            alert('❌ Matrícula não encontrada no sistema!');
        }
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center' }}>SIGA - FCTE</h1>
            <p style={{ textAlign: 'center', color: '#666' }}>Selecione seu perfil para entrar</p>

            {/* secretaria */}
            <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
                <h3>Entrar como Secretaria</h3>
                <button onClick={handleLoginSecretaria} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                    Acessar Painel Admin
                </button>
            </div>

            {/* Professor */}
            <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
                <h3>Entrar como Professor</h3>
                <form onSubmit={handleLoginProfessor}>
                    <input
                        type="email"
                        placeholder="E-mail (ex: yoda@ufc.br)"
                        value={emailProfessor}
                        onChange={(e) => setEmailProfessor(e.target.value)}
                        style={{ padding: '0.5rem', marginRight: '0.5rem', width: '250px' }}
                    />
                    <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Entrar</button>
                </form>
            </div>

            {/* Aluno */}
            <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
                <h3>Entrar como Aluno</h3>
                <form onSubmit={handleLoginAluno}>
                    <input
                        type="text"
                        placeholder="Matrícula"
                        value={matriculaAluno}
                        onChange={(e) => setMatriculaAluno(e.target.value)}
                        style={{ padding: '0.5rem', marginRight: '0.5rem', width: '250px' }}
                    />
                    <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Entrar</button>
                </form>
            </div>
        </div>
    );
};
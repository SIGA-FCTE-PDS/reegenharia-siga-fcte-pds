import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginProfessor, loginAluno } from '../services/api';

export default function Login() {
    const { login } = useAuth();
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEmail = (val: string) => val.includes('@');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isEmail(identifier)) {
                const { data } = await loginProfessor(identifier);
                login({ role: 'professor', professor: data });
            } else {
                const { data } = await loginAluno(identifier);
                login({ role: 'aluno', aluno: data });
            }
        } catch {
            setError('Usuário não encontrado. Verifique o e-mail ou matrícula.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <div className="logo-icon">S</div>
                    <span className="logo-text">SIGA</span>
                </div>

                <h1 className="login-title">Bem-vindo ao sistema</h1>
                <p className="login-sub">
                    Professores entram com <strong>e-mail</strong>. Alunos entram com <strong>matrícula</strong>.
                </p>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="field-group">
                        <label htmlFor="identifier">E-mail ou Matrícula</label>
                        <input
                            id="identifier"
                            type="text"
                            placeholder="ex: prof@ufc.br ou 2023001234"
                            value={identifier}
                            onChange={e => setIdentifier(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Verificando...' : 'Entrar'}
                    </button>
                </form>

                <p className="login-footer">UFC — Sistema Integrado de Gestão Acadêmica</p>
            </div>
            {/* REMOVER ANTES DA APRESENTAÇÃO */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button
                    type="button"
                    className="btn-primary"
                    onClick={() => login({ role: 'professor', professor: { id: 1, nome: 'Prof. Teste', email: 'prof@ufc.br', turmas: [] } })}
                >
                    Entrar como Professor
                </button>
                <button
                    type="button"
                    className="btn-primary"
                    style={{ background: '#1A7A4A' }}
                    onClick={() => login({ role: 'aluno', aluno: { matricula: '2023001234', nome: 'Aluno Teste', email: 'aluno@ufc.br', curso: 'Engenharia', status: 'ATIVO', matriculas: [] } })}
                >
                    Entrar como Aluno
                </button>
            </div>
        </div>

    );
}
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginProfessor, loginAluno } from '../services/api';

export default function Login() {
    const { login } = useAuth();
    const [role, setRole]           = useState<'aluno' | 'professor'>('aluno');
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const run = async () => {
            setError(''); setLoading(true);
            try {
                if (role === 'professor') {
                    const { data } = await loginProfessor(Number(identifier));
                    login({ role: 'professor', professor: data });
                } else {
                    const { data } = await loginAluno(identifier);
                    login({ role: 'aluno', aluno: data });
                }
            } catch {
                setError(role === 'professor'
                    ? 'Professor não encontrado. Verifique o ID.'
                    : 'Aluno não encontrado. Verifique a matrícula.');
            } finally { setLoading(false); }
        };
        void run();
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <div className="logo-icon">S</div>
                    <span className="logo-text">SIGA</span>
                </div>

                <h1 className="login-title">Bem-vindo ao sistema</h1>
                <p className="login-sub">Sistema Integrado de Gestão Acadêmica — UFC FCTE</p>

                <div className="role-selector">
                    <button type="button" className={`role-btn ${role === 'aluno' ? 'active' : ''}`}
                            onClick={() => { setRole('aluno'); setIdentifier(''); setError(''); }}>
                        👤 Sou Aluno
                    </button>
                    <button type="button" className={`role-btn ${role === 'professor' ? 'active' : ''}`}
                            onClick={() => { setRole('professor'); setIdentifier(''); setError(''); }}>
                        🎓 Sou Professor
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="field-group">
                        <label>{role === 'aluno' ? 'Matrícula' : 'ID do Professor'}</label>
                        <input
                            type={role === 'professor' ? 'number' : 'text'}
                            className="input-field"
                            placeholder={role === 'aluno' ? 'Ex: 2023001234' : 'Ex: 1'}
                            value={identifier}
                            onChange={e => setIdentifier(e.target.value)}
                            required autoFocus
                        />
                    </div>
                    {error && <p className="login-error">{error}</p>}
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Verificando...' : 'Entrar'}
                    </button>
                </form>

                {/* Botões de teste — remover antes da apresentação */}
                <div className="login-test-btns">
                    <span className="login-test-label">Acesso rápido (teste)</span>
                    <div style={{ display: 'flex', gap: '.5rem' }}>
                        <button type="button" className="btn-test"
                                onClick={() => login({ role: 'professor', professor: { id: 1, nome: 'Prof. Teste', email: 'prof@ufc.br' } })}>
                            Prof. Teste
                        </button>
                        <button type="button" className="btn-test btn-test-aluno"
                                onClick={() => login({ role: 'aluno', aluno: { matricula: '2023001234', nome: 'Aluno Teste', email: 'aluno@ufc.br', curso: 'Eng. Software', status: 'ATIVO', cpf: '', matriculas: [] } })}>
                            Aluno Teste
                        </button>
                    </div>
                </div>

                <p className="login-footer">UFC — Quixadá · FCTE</p>
            </div>
        </div>
    );
}
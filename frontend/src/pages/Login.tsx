import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginProfessor, loginAluno } from '../services/api';

type Role = 'aluno' | 'professor' | 'admin';

export default function Login() {
    const { login } = useAuth();
    const [role, setRole]           = useState<Role>('aluno');
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const run = async () => {
            setError(''); setLoading(true);
            try {
                if (role === 'admin') {
                    // Admin é local — sem endpoint, acesso direto ao painel
                    if (identifier === 'admin') {
                        login({ role: 'admin' });
                    } else {
                        setError('Código de administrador inválido.');
                    }
                    return;
                }
                if (role === 'professor') {
                    const { data } = await loginProfessor(Number(identifier));
                    login({ role: 'professor', professor: data });
                } else {
                    const { data } = await loginAluno(identifier);
                    login({ role: 'aluno', aluno: data });
                }
            } catch {
                setError(
                    role === 'professor' ? 'Professor não encontrado. Verifique o ID.' :
                        role === 'aluno'     ? 'Aluno não encontrado. Verifique a matrícula.' :
                            'Código inválido.'
                );
            } finally { setLoading(false); }
        };
        void run();
    };

    const roles: { key: Role; label: string; icon: string; hint: string }[] = [
        { key: 'aluno',     label: 'Aluno',           icon: '👤', hint: 'Entre com sua matrícula' },
        { key: 'professor', label: 'Professor',        icon: '🎓', hint: 'Entre com seu ID' },
        { key: 'admin',     label: 'Administrador',    icon: '⚙️', hint: 'Entre com o código admin' },
    ];

    const current = roles.find(r => r.key === role)!;

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <div className="logo-icon">S</div>
                    <span className="logo-text">SIGA</span>
                </div>
                <h1 className="login-title">Bem-vindo ao sistema</h1>
                <p className="login-sub">UFC FCTE — Sistema Integrado de Gestão Acadêmica</p>

                {/* Seletor de perfil */}
                <div className="role-selector">
                    {roles.map(r => (
                        <button key={r.key} type="button"
                                className={`role-btn ${role === r.key ? 'active' : ''}`}
                                onClick={() => { setRole(r.key); setIdentifier(''); setError(''); }}>
                            {r.icon} {r.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="field-group">
                        <label>{current.hint}</label>
                        <input
                            className="input-field"
                            type={role === 'professor' ? 'number' : 'text'}
                            placeholder={
                                role === 'aluno'     ? 'Ex: 2023001234' :
                                    role === 'professor' ? 'Ex: 1' : 'admin'
                            }
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

                <p className="login-footer">UFC · Quixadá · FCTE</p>
            </div>
        </div>
    );
}
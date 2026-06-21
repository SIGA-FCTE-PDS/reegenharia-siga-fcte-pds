import { useAuth } from '../context/AuthContext';

type Page = 'dashboard' | 'alunos' | 'turmas' | 'matriculas';

interface Props {
    current: Page;
    onChange: (p: Page) => void;
}

export default function Navbar({ current, onChange }: Props) {
    const { user, logout } = useAuth();
    const isProfessor = user?.role === 'professor';

    const links: { id: Page; label: string; icon: string }[] = [
        { id: 'dashboard', label: isProfessor ? 'Boletim' : 'Início', icon: '🏠' },
        { id: 'alunos',    label: 'Alunos',    icon: '👤' },
        { id: 'turmas',    label: 'Turmas',    icon: '📚' },
        { id: 'matriculas',label: 'Matrículas',icon: '📋' },
    ];

    const nomeUsuario = isProfessor
        ? user?.professor?.nome
        : user?.aluno?.nome;

    return (
        <aside className="navbar">
            <div className="navbar-logo">
                <div className="logo-icon">S</div>
                <span className="logo-text">SIGA</span>
            </div>

            <nav className="navbar-links">
                {links.map(l => (
                    <button
                        key={l.id}
                        className={`nav-link ${current === l.id ? 'active' : ''}`}
                        onClick={() => onChange(l.id)}
                    >
                        <span className="nav-icon">{l.icon}</span>
                        <span>{l.label}</span>
                    </button>
                ))}
            </nav>

            <div className="navbar-footer">
                <div className="nav-user">
                    <span className="nav-user-role">{isProfessor ? 'Professor' : 'Aluno'}</span>
                    <span className="nav-user-name">{nomeUsuario}</span>
                </div>
                <button className="btn-logout-nav" onClick={logout}>Sair</button>
            </div>
        </aside>
    );
}
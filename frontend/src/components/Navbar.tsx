import { useAuth } from '../context/AuthContext';
// Importamos o AppPage unificado que criamos no App.tsx
import type { AppPage } from '../App';

interface Props {
    current: AppPage;
    onChange: (p: AppPage) => void;
}

export default function Navbar({ current, onChange }: Props) {
    const { user, logout } = useAuth();
    const isProfessor = user?.role === 'professor';
    const isAdmin = user?.role === 'admin'; // Adicionado para facilitar a lógica

    // Adicionamos 'turmas' de volta ao array de opções
    const todosOsLinks: { id: AppPage; label: string; icon: string }[] = [
        { id: 'dashboard',  label: isProfessor ? 'Boletim' : 'Início', icon: '🏠' },
        { id: 'alunos',     label: 'Alunos',     icon: '👤' },
        { id: 'turmas',     label: 'Turmas',     icon: '📚' },
        { id: 'matriculas', label: 'Matrículas', icon: '📋' },
    ];

    // Lógica de visibilidade:
    // ADMIN vê tudo. PROFESSOR e ALUNO veem apenas o que lhes cabe.
    const linksPermitidos = isAdmin
        ? todosOsLinks
        : todosOsLinks.filter(l => l.id === 'dashboard');

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
                {linksPermitidos.map(l => (
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
                    <span className="nav-user-role">{user?.role}</span>
                    <span className="nav-user-name">{nomeUsuario}</span>
                </div>
                <button className="btn-logout-nav" onClick={logout}>Sair</button>
            </div>
        </aside>
    );
}
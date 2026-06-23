import { useAuth } from '../context/AuthContext';
import NotificacaoSino from '../components/NotificacaoSino';

export default function AlunoDashboard() {
    const { user, logout } = useAuth();
    const aluno = user!.aluno!;

    return (
        <div className="dashboard-page">
            <header className="dash-header">
                <div className="dash-header-left">
                    <div className="logo-icon-sm">S</div>
                    <div>
                        <span className="dash-role">Aluno</span>
                        <h2 className="dash-name">{aluno.nome}</h2>
                    </div>
                </div>
                <div className="dash-header-right">
                    <NotificacaoSino matricula={aluno.matricula} />
                    <button className="btn-logout" onClick={logout}>Sair</button>
                </div>
            </header>

            <main className="dash-main">
                <div className="aluno-info-card">
                    <h3 className="section-title">Seus dados</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Matrícula</span>
                            <span className="info-value">{aluno.matricula}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Curso</span>
                            <span className="info-value">{aluno.curso || '—'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">E-mail</span>
                            <span className="info-value">{aluno.email || '—'}</span>
                        </div>
                    </div>
                </div>

                <div className="aluno-notif-hint">
                    <span className="hint-icon">🔔</span>
                    <p>
                        Clique no <strong>ícone de sino</strong> no topo para ver seus alertas de frequência.
                        O sistema avisa automaticamente quando você atinge o <strong>limite crítico de faltas</strong>.
                    </p>
                </div>
            </main>
        </div>
    );
}
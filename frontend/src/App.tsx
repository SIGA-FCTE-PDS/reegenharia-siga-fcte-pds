import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ProfessorDashboard from './pages/ProfessorDashboard';
import AlunoDashboard from './pages/AlunoDashboard';
import AlunosPage from './pages/AlunosPage';
import TurmasPage from './pages/TurmasPage';
import MatriculasPage from './pages/MatriculasPage';
import Navbar from './components/Navbar';
import './App.css';

type Page = 'dashboard' | 'alunos' | 'turmas' | 'matriculas';

function AppRouter() {
    const { user } = useAuth();
    const [page, setPage] = useState<Page>('dashboard');

    if (!user) return <Login />;

    const renderPage = () => {
        // Trava de segurança: Aluno SÓ pode ver o próprio dashboard.
        if (user.role === 'aluno') {
            return <AlunoDashboard />;
        }

        // Se for professor, ele tem acesso livre para navegar nas telas:
        switch (page) {
            case 'alunos':     return <AlunosPage />;
            case 'turmas':     return <TurmasPage />;
            case 'matriculas': return <MatriculasPage />;
            default:           return <ProfessorDashboard />;
        }
    };

    return (
        <div className="app-layout">
            <Navbar current={page} onChange={setPage} />
            <main className="app-content">
                {renderPage()}
            </main>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
}
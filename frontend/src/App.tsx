import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login           from './pages/Login';
import ProfessorDashboard from './pages/ProfessorDashboard';
import AlunoDashboard  from './pages/AlunoDashboard';
import AdminDashboard  from './pages/AdminDashboard';
import Navbar          from './components/Navbar';
import './App.css';

type Page = 'dashboard' | 'alunos' | 'turmas' | 'matriculas';

function AppRouter() {
    const { user } = useAuth();
    const [page, setPage] = useState<Page>('dashboard');

    if (!user) return <Login />;

    // PROFESSOR — só vê o painel de notas/frequência, sem acesso ao CRUD
    if (user.role === 'professor') {
        return (
            <div className="app-layout">
                <Navbar current={page} onChange={setPage} />
                <main className="app-content"><ProfessorDashboard /></main>
            </div>
        );
    }

    // ALUNO — só vê o painel com suas turmas, notas, frequência e notificações
    if (user.role === 'aluno') {
        return (
            <div className="app-layout">
                <Navbar current={page} onChange={setPage} />
                <main className="app-content"><AlunoDashboard /></main>
            </div>
        );
    }

    // ADMIN — acesso ao CRUD completo: alunos, turmas e matrículas
    return (
        <div className="app-layout">
            <Navbar current={page} onChange={setPage} />
            <main className="app-content"><AdminDashboard /></main>
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
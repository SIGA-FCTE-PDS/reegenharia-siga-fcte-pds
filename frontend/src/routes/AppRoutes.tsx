import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoginPage } from '../features/auth/pages/LoginPage'; // <-- Importamos a tela nova aqui!
import { SecretariaDashboard } from '../features/secretaria/pages/SecretariaDashboard';
import { AlunoDashboard } from '../features/aluno/pages/AlunoDashboard';
import { ProfessorDashboard } from '../features/professor/pages/ProfessorDashboard';

// Componente de blindagem
const PrivateRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
    }

    return children;
};

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* A rota principal aponta para a página oficial */}
                <Route path="/" element={<LoginPage />} />

                <Route path="/secretaria" element={
                    <PrivateRoute allowedRoles={['SECRETARIA']}>
                        <SecretariaDashboard />
                    </PrivateRoute>
                } />

                <Route path="/professor" element={
                    <PrivateRoute allowedRoles={['PROFESSOR']}>
                        <ProfessorDashboard />
                    </PrivateRoute>
                } />

                <Route path="/aluno" element={
                    <PrivateRoute allowedRoles={['ALUNO']}>
                        <AlunoDashboard />
                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
};
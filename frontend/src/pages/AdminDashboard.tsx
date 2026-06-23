import { useState } from 'react';
import AlunosPage    from './AlunosPage';
import TurmasPage    from './TurmasPage';
import MatriculasPage from './MatriculasPage';

type Aba = 'alunos' | 'turmas' | 'matriculas';

export default function AdminDashboard() {
    const [aba, setAba] = useState<Aba>('alunos');

    const abas: { key: Aba; label: string; icon: string }[] = [
        { key: 'alunos',     label: 'Cadastrar Alunos',    icon: '👤' },
        { key: 'turmas',     label: 'Cadastrar Turmas',    icon: '📚' },
        { key: 'matriculas', label: 'Matricular Alunos',   icon: '📋' },
    ];

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Painel Administrativo</h1>
                    <p className="page-sub">Gerencie alunos, turmas e matrículas</p>
                </div>
            </div>

            <div className="abas">
                {abas.map(a => (
                    <button key={a.key} className={`aba-btn ${aba === a.key ? 'active' : ''}`} onClick={() => setAba(a.key)}>
                        {a.icon} {a.label}
                    </button>
                ))}
            </div>

            {aba === 'alunos'     && <AlunosPage />}
            {aba === 'turmas'     && <TurmasPage />}
            {aba === 'matriculas' && <MatriculasPage />}
        </div>
    );
}
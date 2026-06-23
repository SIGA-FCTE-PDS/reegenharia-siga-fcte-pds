import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    getTurmas, getMatriculasPorTurma,
    lancarNota, getNotas,
    registrarFrequencia, getFrequencias,
} from '../services/api';
import type { Turma, NotaResponse, FrequenciaResponse } from '../types';
import { extractErrorMessage } from '../utils/errorHandler';

interface AlunoTurma { id: number; aluno: { matricula: string; nome: string }; }
type Aba = 'notas' | 'frequencia';

export default function ProfessorDashboard() {
    const { user } = useAuth();
    const professor = user!.professor!;
    const montado = useRef(true);

    useEffect(() => {
        montado.current = true;
        return () => { montado.current = false; };
    }, []);

    const [turmas, setTurmas]             = useState<Turma[]>([]);
    const [turmaSel, setTurmaSel]         = useState('');
    const [alunos, setAlunos]             = useState<AlunoTurma[]>([]);
    const [alunoSel, setAlunoSel]         = useState('');
    const [aba, setAba]                   = useState<Aba>('notas');
    const [notas, setNotas]               = useState<NotaResponse[]>([]);
    const [frequencias, setFrequencias]   = useState<FrequenciaResponse[]>([]);

    const [avaliacaoId, setAvaliacaoId]   = useState('');
    const [valorNota, setValorNota]       = useState('');
    const [fbNota, setFbNota]             = useState<{ tipo: 'ok' | 'erro'; msg: string } | null>(null);
    const [salvandoNota, setSalvandoNota] = useState(false);

    const [dataAula, setDataAula]         = useState(new Date().toISOString().slice(0, 10));
    const [presente, setPresente]         = useState(true);
    const [fbFreq, setFbFreq]             = useState<{ tipo: 'ok' | 'erro'; msg: string } | null>(null);
    const [salvandoFreq, setSalvandoFreq] = useState(false);

    // ── Carrega turmas do professor ────────────────────────────────────────
    // Sem useCallback async: todo setState fica dentro do IIFE, após o await
    useEffect(() => {
        void (async () => {
            try {
                const { data } = await getTurmas();
                if (montado.current)
                    setTurmas((data as Turma[]).filter(t => t.professor?.id === professor.id));
            } catch { /* silencioso */ }
        })();
    }, [professor.id]);

    // ── Ao trocar turma: busca alunos e limpa seleções ────────────────────
    useEffect(() => {
        if (!turmaSel) return;
        void (async () => {
            try {
                const { data } = await getMatriculasPorTurma(Number(turmaSel));
                if (montado.current) {
                    setAlunos(data);
                    setAlunoSel('');
                    setNotas([]);
                    setFrequencias([]);
                    setFbNota(null);
                    setFbFreq(null);
                }
            } catch {
                if (montado.current) setAlunos([]);
            }
        })();
    }, [turmaSel]);

    // ── Ao trocar aluno: busca notas e frequências ────────────────────────
    useEffect(() => {
        if (!alunoSel || !turmaSel) return;
        void (async () => {
            const [notasRes, freqRes] = await Promise.allSettled([
                getNotas(alunoSel, Number(turmaSel)),
                getFrequencias(alunoSel, Number(turmaSel)),
            ]);
            if (!montado.current) return;
            setNotas(notasRes.status === 'fulfilled' ? notasRes.value.data : []);
            setFrequencias(freqRes.status === 'fulfilled' ? freqRes.value.data : []);
        })();
    }, [alunoSel, turmaSel]);

    // ── Handlers de formulário ─────────────────────────────────────────────
    const handleLancarNota = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        void (async () => {
            setSalvandoNota(true);
            setFbNota(null);
            try {
                await lancarNota({
                    alunoMatricula: alunoSel,
                    avaliacaoId: Number(avaliacaoId),
                    valor: Number(valorNota),
                });
                if (!montado.current) return;
                setFbNota({ tipo: 'ok', msg: `Nota ${valorNota} lançada!` });
                setAvaliacaoId('');
                setValorNota('');
                const { data } = await getNotas(alunoSel, Number(turmaSel));
                if (montado.current) setNotas(data);
            } catch (err) {
                if (montado.current) setFbNota({ tipo: 'erro', msg: extractErrorMessage(err) });
            } finally {
                if (montado.current) setSalvandoNota(false);
            }
        })();
    };

    const handleRegistrarFrequencia = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        void (async () => {
            setSalvandoFreq(true);
            setFbFreq(null);
            try {
                await registrarFrequencia({
                    alunoMatricula: alunoSel,
                    turmaId: Number(turmaSel),
                    data: dataAula,
                    presente,
                });
                if (!montado.current) return;
                setFbFreq({ tipo: 'ok', msg: presente ? 'Presença registrada!' : 'Falta registrada!' });
                const { data } = await getFrequencias(alunoSel, Number(turmaSel));
                if (montado.current) setFrequencias(data);
            } catch (err) {
                if (montado.current) setFbFreq({ tipo: 'erro', msg: extractErrorMessage(err) });
            } finally {
                if (montado.current) setSalvandoFreq(false);
            }
        })();
    };

    const faltas    = frequencias.filter(f => !f.presente).length;
    const presencas = frequencias.filter(f =>  f.presente).length;
    const media     = notas.length
        ? (notas.reduce((s, n) => s + n.valor, 0) / notas.length).toFixed(1)
        : null;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Painel do Professor</h1>
                    <p className="page-sub">Olá, {professor.nome}</p>
                </div>
            </div>

            {/* PASSO 1 — Turma */}
            <div className="dash-card">
                <h3 className="card-title">
                    <span className="card-icon">📚</span> 1. Selecione sua Turma
                </h3>
                {turmas.length === 0
                    ? <p className="hint-text">Nenhuma turma associada ao seu cadastro ainda.</p>
                    : (
                        <select
                            className="select-field"
                            value={turmaSel}
                            onChange={e => setTurmaSel(e.target.value)}
                        >
                            <option value="">— Escolha uma turma —</option>
                            {turmas.map(t => (
                                <option key={t.id} value={t.id}>
                                    {t.disciplina?.nome} · {t.codigoTurma} · {t.semestreLetivo}
                                    {t.horario ? ` · ${t.horario}` : ''}
                                </option>
                            ))}
                        </select>
                    )
                }
            </div>

            {/* PASSO 2 — Aluno */}
            {turmaSel && (
                <div className="dash-card">
                    <h3 className="card-title">
                        <span className="card-icon">👤</span> 2. Selecione o Aluno
                    </h3>
                    <p className="hint-text">{alunos.length} aluno(s) matriculado(s)</p>
                    <select
                        className="select-field"
                        value={alunoSel}
                        onChange={e => setAlunoSel(e.target.value)}
                    >
                        <option value="">— Escolha o aluno —</option>
                        {alunos.map(m => (
                            <option key={m.id} value={m.aluno.matricula}>
                                {m.aluno.nome} · {m.aluno.matricula}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* PASSO 3 — Ações */}
            {alunoSel && (
                <>
                    <div className="resumo-bar">
                        <span>📊 Notas: <strong>{notas.length}</strong></span>
                        {media && (
                            <span className={`nota-valor ${Number(media) >= 5 ? 'aprovado' : 'reprovado'}`}>
                                Média: {media}
                            </span>
                        )}
                        <span>✅ Presenças: <strong>{presencas}</strong></span>
                        <span style={{ color: faltas > 0 ? 'var(--danger)' : 'inherit' }}>
                            ❌ Faltas: <strong>{faltas}</strong>
                        </span>
                    </div>

                    <div className="abas">
                        <button
                            className={`aba-btn ${aba === 'notas' ? 'active' : ''}`}
                            onClick={() => setAba('notas')}
                        >
                            📝 Notas
                        </button>
                        <button
                            className={`aba-btn ${aba === 'frequencia' ? 'active' : ''}`}
                            onClick={() => setAba('frequencia')}
                        >
                            📅 Frequência
                        </button>
                    </div>

                    <div className="dash-cards">
                        {/* Formulário */}
                        <div className="dash-card">
                            {aba === 'notas' ? (
                                <>
                                    <h3 className="card-title">
                                        <span className="card-icon">📝</span> Lançar Nota
                                    </h3>
                                    <form onSubmit={handleLancarNota} className="dash-form">
                                        <div className="field-group">
                                            <label>ID da Avaliação</label>
                                            <input
                                                type="number"
                                                className="input-field"
                                                placeholder="Ex: 1"
                                                value={avaliacaoId}
                                                onChange={e => setAvaliacaoId(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="field-group">
                                            <label>Nota (0 – 10)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="10"
                                                step="0.1"
                                                className="input-field"
                                                placeholder="Ex: 8.5"
                                                value={valorNota}
                                                onChange={e => setValorNota(e.target.value)}
                                                required
                                            />
                                        </div>
                                        {fbNota && (
                                            <p className={`feedback ${fbNota.tipo}`}>{fbNota.msg}</p>
                                        )}
                                        <button
                                            type="submit"
                                            className="btn-primary"
                                            disabled={salvandoNota}
                                        >
                                            {salvandoNota ? 'Salvando...' : 'Lançar Nota'}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <h3 className="card-title">
                                        <span className="card-icon">📅</span> Registrar Frequência
                                    </h3>
                                    <form onSubmit={handleRegistrarFrequencia} className="dash-form">
                                        <div className="field-group">
                                            <label>Data da Aula</label>
                                            <input
                                                type="date"
                                                className="input-field"
                                                value={dataAula}
                                                onChange={e => setDataAula(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="field-group-inline">
                                            <label className="toggle-label">
                                                <input
                                                    type="checkbox"
                                                    checked={presente}
                                                    onChange={e => setPresente(e.target.checked)}
                                                />
                                                <span className="toggle-track">
                                                    <span className="toggle-thumb" />
                                                </span>
                                                <span>{presente ? '✅ Presente' : '❌ Falta'}</span>
                                            </label>
                                        </div>
                                        {fbFreq && (
                                            <p className={`feedback ${fbFreq.tipo}`}>{fbFreq.msg}</p>
                                        )}
                                        <button
                                            type="submit"
                                            className="btn-primary"
                                            disabled={salvandoFreq}
                                        >
                                            {salvandoFreq ? 'Salvando...' : 'Registrar'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>

                        {/* Tabelas */}
                        <div className="dash-card">
                            {aba === 'notas' ? (
                                <>
                                    <h3 className="card-title">
                                        <span className="card-icon">📊</span> Notas Lançadas
                                    </h3>
                                    {notas.length === 0
                                        ? <p className="hint-text">Nenhuma nota lançada ainda.</p>
                                        : (
                                            <div className="table-wrapper">
                                                <table className="data-table">
                                                    <thead>
                                                    <tr><th>Avaliação</th><th>Nota</th></tr>
                                                    </thead>
                                                    <tbody>
                                                    {notas.map(n => (
                                                        <tr key={n.id}>
                                                            <td>{n.avaliacao?.descricao ?? `Avaliação ${n.avaliacao?.id}`}</td>
                                                            <td>
                                                                    <span className={`nota-valor ${n.valor >= 5 ? 'aprovado' : 'reprovado'}`}>
                                                                        <strong>{n.valor}</strong>
                                                                    </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )
                                    }
                                </>
                            ) : (
                                <>
                                    <h3 className="card-title">
                                        <span className="card-icon">📋</span> Histórico de Frequência
                                    </h3>
                                    {frequencias.length === 0
                                        ? <p className="hint-text">Nenhuma frequência registrada ainda.</p>
                                        : (
                                            <div className="table-wrapper">
                                                <table className="data-table">
                                                    <thead>
                                                    <tr><th>Data</th><th>Situação</th></tr>
                                                    </thead>
                                                    <tbody>
                                                    {frequencias.map(f => (
                                                        <tr key={f.id}>
                                                            <td>{new Date(f.data).toLocaleDateString('pt-BR')}</td>
                                                            <td>
                                                                {f.presente
                                                                    ? <span className="badge badge-ativo">Presente</span>
                                                                    : <span className="badge badge-cancelada">Falta</span>
                                                                }
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )
                                    }
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}

            {!turmaSel && (
                <div className="dash-empty">
                    <span>🎓</span>
                    <p>Selecione uma turma para começar.</p>
                </div>
            )}
        </div>
    );
}
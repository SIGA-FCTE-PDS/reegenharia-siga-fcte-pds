import { useState, useEffect, useRef, useCallback } from 'react';
import type { Notificacao } from '../types';
import { getNotificacoesAluno } from '../services/api';

interface Props {
    matricula: string;
}

export default function NotificacaoSino({ matricula }: Props) {
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotificacoes = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await getNotificacoesAluno(matricula);
            setNotificacoes(data);
        } catch {
            // silencioso se não tiver notificações ainda
        } finally {
            setLoading(false);
        }
    }, [matricula]);

    useEffect(() => {
        void fetchNotificacoes();
        const interval = setInterval(() => { void fetchNotificacoes(); }, 30000);
        return () => clearInterval(interval);
    }, [fetchNotificacoes]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <div className="sino-wrapper" ref={dropdownRef}>
            <button
                className="sino-btn"
                onClick={() => setOpen(prev => !prev)}
                aria-label={`Notificações (${notificacoes.length})`}
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {notificacoes.length > 0 && (
                    <span className="sino-badge">{notificacoes.length}</span>
                )}
            </button>

            {open && (
                <div className="sino-dropdown">
                    <div className="sino-header">
                        <span>Notificações</span>
                        <button className="sino-refresh" onClick={() => { void fetchNotificacoes(); }} title="Atualizar">
                            ↻
                        </button>
                    </div>

                    {loading && <p className="sino-empty">Carregando...</p>}

                    {!loading && notificacoes.length === 0 && (
                        <p className="sino-empty">Nenhuma notificação.</p>
                    )}

                    {!loading && notificacoes.map(n => (
                        <div key={n.id} className="sino-item">
                            <div className="sino-item-icon">⚠️</div>
                            <div className="sino-item-body">
                                <p className="sino-item-msg">{n.mensagem}</p>
                                <span className="sino-item-turma">
                  {n.turma?.disciplina?.nome ?? n.turma?.codigoTurma}
                </span>
                                <span className="sino-item-date">{formatDate(n.dataCriacao)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
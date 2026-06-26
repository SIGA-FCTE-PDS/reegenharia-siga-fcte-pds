import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Curso { codigo: string; nome: string; }
interface Professor { id?: number; matricula?: string; nome: string; email: string; }
interface Disciplina { id?: number; codigo?: string; nome: string; cargaHoraria: number; }
interface Turma { id: number; nome: string; semestre: string; }

export const SecretariaDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [abaAtiva, setAbaAtiva] = useState<'ALUNOS' | 'PROFESSORES' | 'CURSOS' | 'DISCIPLINAS' | 'TURMAS'>('ALUNOS');

    const [cursos, setCursos] = useState<Curso[]>([]);
    const [professores, setProfessores] = useState<Professor[]>([]);
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [turmas, setTurmas] = useState<Turma[]>([]);

    const [nome, setNome] = useState(''); const [cpf, setCpf] = useState('');
    const [anoIngresso, setAnoIngresso] = useState<string>('2026'); const [semestreIngresso, setSemestreIngresso] = useState('1');
    const [cursoCodigo, setCursoCodigo] = useState(''); const [tipo, setTipo] = useState('NORMAL');
    const [email, setEmail] = useState(''); const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState(''); const [dataNascimento, setDataNascimento] = useState('');
    const [instituicaoOrigem, setInstituicaoOrigem] = useState('');

    const [nomeProf, setNomeProf] = useState(''); const [emailProf, setEmailProf] = useState('');
    const [nomeCurso, setNomeCurso] = useState(''); const [codigoNovoCurso, setCodigoNovoCurso] = useState('');
    const [idDisciplina, setIdDisciplina] = useState(''); const [nomeDisciplina, setNomeDisciplina] = useState(''); const [cargaHoraria, setCargaHoraria] = useState('60');

    const [nomeTurma, setNomeTurma] = useState(''); const [anoTurma, setAnoTurma] = useState('2026');
    const [semestreTurmaNum, setSemestreTurmaNum] = useState('1');
    const [disciplinaIdTurma, setDisciplinaIdTurma] = useState(''); const [professorIdTurma, setProfessorIdTurma] = useState('');
    const [salaTurma, setSalaTurma] = useState('');
    const [horarioTurma, setHorarioTurma] = useState('');
    const [capacidadeTurma, setCapacidadeTurma] = useState('40');
    const [modalidadeTurma, setModalidadeTurma] = useState('Presencial');

    const fetchData = () => {
        api.get('/cursos').then(res => { setCursos(res.data); if (res.data.length > 0) setCursoCodigo(res.data[0].codigo); }).catch(console.error);
        api.get('/professores').then(res => setProfessores(res.data)).catch(console.error);
        api.get('/disciplinas').then(res => setDisciplinas(res.data)).catch(console.error);
        api.get('/turmas').then(res => setTurmas(res.data)).catch(console.error);
    };

    useEffect(() => { fetchData(); }, [abaAtiva]);

    const getDiscId = (d: Disciplina) => d.codigo || d.id || '';
    const getProfId = (p: Professor) => p.id || p.matricula || '';

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        setCpf(value.replace(/(\d{3})(\d{1,2})$/, '$1-$2'));
    };

    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        value = value.replace(/^(\d{2})(\d)/g, '($1)$2');
        setTelefone(value.replace(/(\d)(\d{4})$/, '$1-$2'));
    };

    const extrairMensagemErro = (error: any) => error.response?.data?.mensagem || error.response?.data?.message || JSON.stringify(error.response?.data) || 'Erro interno.';

    const handleCadastrarAluno = async (e: React.FormEvent) => {
        e.preventDefault();
        const anoFinal = parseInt(anoIngresso);
        if (isNaN(anoFinal) || anoFinal < 2020 || anoFinal > 2030) return alert('⚠️ Ano de ingresso inválido!');
        try {
            const cursoSelecionado = cursos.find(c => c.codigo === cursoCodigo);
            await api.post('/alunos', { nome, cpf: cpf.replace(/\D/g, ''), anoIngresso: anoFinal, semestreIngresso, codigoCurso: cursoCodigo, curso: cursoSelecionado?.nome, tipoAluno: tipo, email, telefone, endereco, dataNascimento, instituicaoOrigem: tipo === 'ESPECIAL' ? instituicaoOrigem : null });
            alert(`🎉 Aluno cadastrado com sucesso!`);
            setNome(''); setCpf(''); setEmail(''); setTelefone(''); setEndereco(''); setDataNascimento('');
        } catch (error: any) { alert(`Erro ao cadastrar aluno:\n${extrairMensagemErro(error)}`); }
    };

    const handleCadastrarProfessor = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/professores', { nome: nomeProf, email: emailProf });
            alert('👨‍🏫 Professor cadastrado!');
            setNomeProf(''); setEmailProf(''); fetchData();
        } catch (error: any) { alert(`Erro ao cadastrar professor:\n${extrairMensagemErro(error)}`); }
    };

    const handleCadastrarCurso = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/cursos', { codigo: codigoNovoCurso, nome: nomeCurso });
            alert('📘 Curso cadastrado!');
            setCodigoNovoCurso(''); setNomeCurso(''); fetchData();
        } catch (error: any) { alert(`Erro ao cadastrar curso:\n${extrairMensagemErro(error)}`); }
    };

    const handleCadastrarDisciplina = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/disciplinas', { codigo: idDisciplina, nome: nomeDisciplina, cargaHoraria: parseInt(cargaHoraria) });
            alert('📙 Disciplina cadastrada com sucesso!');
            setIdDisciplina(''); setNomeDisciplina(''); setCargaHoraria('60'); fetchData();
        } catch (error: any) { alert(`Erro ao cadastrar disciplina:\n${extrairMensagemErro(error)}`); }
    };

    const handleCadastrarTurma = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!professorIdTurma || !disciplinaIdTurma) return alert('⚠️ Selecione a Disciplina e o Professor!');
        try {
            const semestreFormatado = `${anoTurma}.${semestreTurmaNum}`;
            const payload = {
                codigoTurma: nomeTurma,
                semestreLetivo: semestreFormatado,
                sala: salaTurma,
                horario: horarioTurma,
                capacidadeMaxima: parseInt(capacidadeTurma),
                modalidade: modalidadeTurma,
                disciplinaCodigo: String(disciplinaIdTurma),
                professorId: Number(professorIdTurma)
            };
            await api.post('/turmas', payload);
            alert('🏫 Turma criada e Professor alocado com sucesso!');
            setNomeTurma(''); setSalaTurma(''); setHorarioTurma(''); fetchData();
        } catch (error: any) { alert(`Erro ao criar turma:\n${extrairMensagemErro(error)}`); }
    };

    const tabStyle = (aba: string) => ({ padding: '0.75rem 1rem', cursor: 'pointer', border: 'none', borderRadius: '4px', fontWeight: 'bold', flex: 1, background: abaAtiva === aba ? '#2196F3' : '#e0e0e0', color: abaAtiva === aba ? '#fff' : '#333' });
    const inputStyle = { padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', flex: 1 };
    const btnStyle = { padding: '0.75rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
    const tableStyle = { width: '100%', borderCollapse: 'collapse' as const, marginTop: '1rem' };
    const thTdStyle = { border: '1px solid #ddd', padding: '8px', textAlign: 'left' as const };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Painel Administrativo da Secretaria</h2>
                <button onClick={() => { logout(); navigate('/'); }} style={{ ...btnStyle, background: '#ff4d4d' }}>Sair</button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => setAbaAtiva('CURSOS')} style={tabStyle('CURSOS')}>1. Cursos</button>
                <button onClick={() => setAbaAtiva('DISCIPLINAS')} style={tabStyle('DISCIPLINAS')}>2. Disciplinas</button>
                <button onClick={() => setAbaAtiva('PROFESSORES')} style={tabStyle('PROFESSORES')}>3. Professores</button>
                <button onClick={() => setAbaAtiva('TURMAS')} style={tabStyle('TURMAS')}>4. Turmas</button>
                <button onClick={() => setAbaAtiva('ALUNOS')} style={{ ...tabStyle('ALUNOS'), background: abaAtiva === 'ALUNOS' ? '#4CAF50' : '#e0e0e0' }}>5. Matricular Aluno</button>
            </div>

            <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px', background: '#fcfcfc' }}>
                {/* Abas Anteriores Mantidas Iguais... */}
                {abaAtiva === 'CURSOS' && (
                    <div>
                        <h3>📘 Cadastrar Novo Curso</h3>
                        <form onSubmit={handleCadastrarCurso} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <input type="text" placeholder="Código (Ex: 03)" value={codigoNovoCurso} onChange={e => setCodigoNovoCurso(e.target.value.replace(/\D/g, '').slice(0, 3))} required style={{ ...inputStyle, flex: '0.3' }} />
                            <input type="text" placeholder="Nome do Curso" value={nomeCurso} onChange={e => setNomeCurso(e.target.value)} required style={inputStyle} />
                            <button type="submit" style={btnStyle}>Salvar Curso</button>
                        </form>
                        <hr />
                        <h4>Cursos Registrados</h4>
                        <table style={tableStyle}><thead style={{ background: '#eee' }}><tr><th style={thTdStyle}>Código</th><th style={thTdStyle}>Nome do Curso</th></tr></thead><tbody>{cursos.map(c => <tr key={c.codigo}><td style={thTdStyle}>{c.codigo}</td><td style={thTdStyle}>{c.nome}</td></tr>)}</tbody></table>
                    </div>
                )}

                {abaAtiva === 'DISCIPLINAS' && (
                    <div>
                        <h3>📙 Cadastrar Nova Disciplina</h3>
                        <form onSubmit={handleCadastrarDisciplina} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <input type="text" placeholder="Código (Ex: MAT101)" value={idDisciplina} onChange={e => setIdDisciplina(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))} required style={{ ...inputStyle, flex: '0.3' }} />
                            <input type="text" placeholder="Nome da Disciplina" value={nomeDisciplina} onChange={e => setNomeDisciplina(e.target.value)} required style={inputStyle} />
                            <input type="number" placeholder="Carga Horária" value={cargaHoraria} onChange={e => setCargaHoraria(e.target.value)} required style={{ ...inputStyle, flex: '0.3' }} />
                            <button type="submit" style={btnStyle}>Salvar Disciplina</button>
                        </form>
                        <hr />
                        <h4>Disciplinas Registradas</h4>
                        <table style={tableStyle}><thead style={{ background: '#eee' }}><tr><th style={thTdStyle}>Código</th><th style={thTdStyle}>Nome</th><th style={thTdStyle}>CH</th></tr></thead><tbody>{disciplinas.map((d, i) => <tr key={i}><td style={thTdStyle}>#{getDiscId(d)}</td><td style={thTdStyle}>{d.nome}</td><td style={thTdStyle}>{d.cargaHoraria}h</td></tr>)}</tbody></table>
                    </div>
                )}

                {abaAtiva === 'PROFESSORES' && (
                    <div>
                        <h3>👨‍🏫 Cadastrar Novo Professor</h3>
                        <form onSubmit={handleCadastrarProfessor} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <input type="text" placeholder="Nome Completo" value={nomeProf} onChange={e => setNomeProf(e.target.value)} required style={inputStyle} />
                            <input type="email" placeholder="E-mail" value={emailProf} onChange={e => setEmailProf(e.target.value)} required style={inputStyle} />
                            <button type="submit" style={btnStyle}>Salvar Professor</button>
                        </form>
                        <hr />
                        <h4>Professores Ativos</h4>
                        <table style={tableStyle}><thead style={{ background: '#eee' }}><tr><th style={thTdStyle}>ID</th><th style={thTdStyle}>Nome</th><th style={thTdStyle}>E-mail</th></tr></thead><tbody>{professores.map((p, i) => <tr key={i}><td style={thTdStyle}>#{getProfId(p)}</td><td style={thTdStyle}><strong>{p.nome}</strong></td><td style={thTdStyle}>{p.email}</td></tr>)}</tbody></table>
                    </div>
                )}

                {abaAtiva === 'TURMAS' && (
                    <div>
                        <h3>🏫 Abrir Turma & Alocar Professor</h3>
                        <form onSubmit={handleCadastrarTurma} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <label>Código da Turma</label>
                                    <input type="text" placeholder="Ex: T01" value={nomeTurma} onChange={e => setNomeTurma(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5))} required style={inputStyle} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <label>Ano da Turma</label>
                                    <input type="number" min="2020" max="2030" value={anoTurma} onChange={e => setAnoTurma(e.target.value)} required style={inputStyle} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <label>Semestre</label>
                                    <select value={semestreTurmaNum} onChange={e => setSemestreTurmaNum(e.target.value)} required style={inputStyle}>
                                        <option value="1">1º Sem.</option>
                                        <option value="2">2º Sem.</option>
                                    </select>
                                </div>
                            </div>

                            {/* NOVOS CAMPOS: Sala, Horário, Capacidade, Modalidade */}
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <label>Sala</label>
                                    <input type="text" placeholder="Ex: Sala 101" value={salaTurma} onChange={e => setSalaTurma(e.target.value)} required style={inputStyle} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <label>Horário</label>
                                    <input type="text" placeholder="Ex: Seg e Qua 14h-16h" value={horarioTurma} onChange={e => setHorarioTurma(e.target.value)} required style={inputStyle} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <label>Capacidade Mín/Máx</label>
                                    <input type="number" min="1" value={capacidadeTurma} onChange={e => setCapacidadeTurma(e.target.value)} required style={inputStyle} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <label>Modalidade</label>
                                    <select value={modalidadeTurma} onChange={e => setModalidadeTurma(e.target.value)} required style={inputStyle}>
                                        <option value="Presencial">Presencial</option>
                                        <option value="EAD">EAD</option>
                                        <option value="Hibrido">Híbrido</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <label>Disciplina</label>
                                    <select value={disciplinaIdTurma} onChange={e => setDisciplinaIdTurma(e.target.value)} required style={inputStyle}>
                                        <option value="">-- Selecione a Disciplina --</option>
                                        {disciplinas.map((d, i) => <option key={i} value={getDiscId(d)}>{d.nome}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <label>Professor</label>
                                    <select value={professorIdTurma} onChange={e => setProfessorIdTurma(e.target.value)} required style={inputStyle}>
                                        <option value="">-- Aloque um Professor --</option>
                                        {professores.map((p, i) => <option key={i} value={getProfId(p)}>{p.nome}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button type="submit" style={btnStyle}>Criar Turma</button>
                        </form>
                        <hr />
                        <h4>Turmas Abertas</h4>
                        <table style={tableStyle}><thead style={{ background: '#eee' }}><tr><th style={thTdStyle}>Código</th><th style={thTdStyle}>Semestre</th></tr></thead><tbody>{turmas.map(t => <tr key={t.id || t.nome}><td style={thTdStyle}>{t.nome || t.codigoTurma}</td><td style={thTdStyle}>{t.semestre}</td></tr>)}</tbody></table>
                    </div>
                )}

                {abaAtiva === 'ALUNOS' && (
                    <div>
                        <h3>📝 Matricular Novo Aluno</h3>
                        <form onSubmit={handleCadastrarAluno} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input type="text" placeholder="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} required style={{ ...inputStyle, flex: 2 }} />
                                <input type="text" placeholder="CPF" value={cpf} onChange={handleCpfChange} required style={{ ...inputStyle, flex: 1 }} />
                                <input type="date" max="9999-12-31" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
                                <input type="text" placeholder="Telefone" value={telefone} onChange={handleTelefoneChange} style={inputStyle} />
                            </div>
                            <input type="text" placeholder="Endereço Completo" value={endereco} onChange={(e) => setEndereco(e.target.value)} style={inputStyle} />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '25%' }}>
                                    <label>Ano de Ingresso</label>
                                    <input type="number" min="2020" max="2030" value={anoIngresso} onChange={(e) => setAnoIngresso(e.target.value)} required style={inputStyle} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '25%' }}>
                                    <label>Semestre</label>
                                    <select value={semestreIngresso} onChange={(e) => setSemestreIngresso(e.target.value)} style={inputStyle}>
                                        <option value="1">1º Sem.</option>
                                        <option value="2">2º Sem.</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                                    <label>Curso</label>
                                    <select value={cursoCodigo} onChange={(e) => setCursoCodigo(e.target.value)} style={inputStyle} required>
                                        <option value="">-- Selecione o Curso --</option>
                                        {cursos.map(c => <option key={c.codigo} value={c.codigo}>{c.codigo} - {c.nome}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', width: tipo === 'ESPECIAL' ? '50%' : '100%' }}>
                                    <label>Vínculo</label>
                                    <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={inputStyle}>
                                        <option value="NORMAL">Normal</option>
                                        <option value="ESPECIAL">Especial</option>
                                    </select>
                                </div>
                                {tipo === 'ESPECIAL' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                                        <label>Instituição de Origem</label>
                                        <input type="text" value={instituicaoOrigem} onChange={(e) => setInstituicaoOrigem(e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, ''))} required placeholder="Ex: IFCE" style={inputStyle} />
                                    </div>
                                )}
                            </div>
                            <button type="submit" style={{ ...btnStyle, marginTop: '1rem' }}>Gerar Matrícula e Cadastrar</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};
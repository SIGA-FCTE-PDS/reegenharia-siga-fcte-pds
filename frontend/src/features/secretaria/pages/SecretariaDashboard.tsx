import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Curso { codigo: string; nome: string; }
interface Professor { id?: number; matricula?: string; nome: string; email: string; }
interface Disciplina { id?: number; codigo?: string; nome: string; cargaHoraria: number; }
// 💡 Correção: Adicionado o semestreLetivo na interface
interface Turma { id: number; nome: string; semestre?: string; semestreLetivo?: string; codigoTurma?: string; }
interface Aluno { matricula: string; nome: string; }

export const SecretariaDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [abaAtiva, setAbaAtiva] = useState<'CURSOS' | 'DISCIPLINAS' | 'PROFESSORES' | 'TURMAS' | 'ALUNOS' | 'INSCRICAO'>('CURSOS');

    const [cursos, setCursos] = useState<Curso[]>([]);
    const [professores, setProfessores] = useState<Professor[]>([]);
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [alunos, setAlunos] = useState<Aluno[]>([]);

    const [nome, setNome] = useState(''); const [cpf, setCpf] = useState('');
    const [anoIngresso, setAnoIngresso] = useState<string>('2026'); const [semestreIngresso, setSemestreIngresso] = useState('1');
    const [cursoCodigo, setCursoCodigo] = useState(''); const [tipo, setTipo] = useState('NORMAL');
    const [email, setEmail] = useState(''); const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState(''); const [dataNascimento, setDataNascimento] = useState('');
    const [instituicaoOrigem, setInstituicaoOrigem] = useState('');

    const [nomeProf, setNomeProf] = useState(''); const [emailProf, setEmailProf] = useState('');
    const [nomeCurso, setNomeCurso] = useState(''); const [codigoNovoCurso, setCodigoNovoCurso] = useState('');

    const [idDisciplina, setIdDisciplina] = useState('');
    const [nomeDisciplina, setNomeDisciplina] = useState('');
    const [cargaHoraria, setCargaHoraria] = useState('60');
    const [cursoCodigoDisciplina, setCursoCodigoDisciplina] = useState('');
    const [tipoDisciplina, setTipoDisciplina] = useState('OBRIGATORIA');

    const [nomeTurma, setNomeTurma] = useState(''); const [anoTurma, setAnoTurma] = useState('2026');
    const [semestreTurmaNum, setSemestreTurmaNum] = useState('1');
    const [disciplinaIdTurma, setDisciplinaIdTurma] = useState(''); const [professorIdTurma, setProfessorIdTurma] = useState('');
    const [salaTurma, setSalaTurma] = useState('');
    const [horarioTurma, setHorarioTurma] = useState('');
    const [capacidadeTurma, setCapacidadeTurma] = useState('40');
    const [modalidadeTurma, setModalidadeTurma] = useState('Presencial');

    const [alunoInscricaoId, setAlunoInscricaoId] = useState('');
    const [turmaInscricaoId, setTurmaInscricaoId] = useState('');

    const fetchData = () => {
        api.get('/cursos').then(res => { setCursos(res.data); if (res.data.length > 0) setCursoCodigo(res.data[0].codigo); }).catch(console.error);
        api.get('/professores').then(res => setProfessores(res.data)).catch(console.error);
        api.get('/disciplinas').then(res => setDisciplinas(res.data)).catch(console.error);
        api.get('/turmas').then(res => setTurmas(res.data)).catch(console.error);
        api.get('/alunos').then(res => setAlunos(res.data)).catch(console.error);
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
        e.preventDefault(); const anoFinal = parseInt(anoIngresso); if (isNaN(anoFinal) || anoFinal < 2020 || anoFinal > 2030) return alert('⚠️ Ano de ingresso inválido!');
        try { const cursoSelecionado = cursos.find(c => c.codigo === cursoCodigo); await api.post('/alunos', { nome, cpf: cpf.replace(/\D/g, ''), anoIngresso: anoFinal, semestreIngresso, codigoCurso: cursoCodigo, curso: cursoSelecionado?.nome, tipoAluno: tipo, email, telefone, endereco, dataNascimento, instituicaoOrigem: tipo === 'ESPECIAL' ? instituicaoOrigem : null }); alert(`🎉 Aluno cadastrado com sucesso! Lembre-se de inscrevê-lo nas turmas.`); setNome(''); setCpf(''); setEmail(''); setTelefone(''); setEndereco(''); setDataNascimento(''); fetchData(); } catch (error: any) { alert(`Erro ao cadastrar aluno:\n${extrairMensagemErro(error)}`); }
    };
    const handleCadastrarProfessor = async (e: React.FormEvent) => { e.preventDefault(); try { await api.post('/professores', { nome: nomeProf, email: emailProf }); alert('👨‍🏫 Professor cadastrado!'); setNomeProf(''); setEmailProf(''); fetchData(); } catch (error: any) { alert(`Erro ao cadastrar professor:\n${extrairMensagemErro(error)}`); } };
    const handleCadastrarCurso = async (e: React.FormEvent) => { e.preventDefault(); try { await api.post('/cursos', { codigo: codigoNovoCurso, nome: nomeCurso }); alert('📘 Curso cadastrado!'); setCodigoNovoCurso(''); setNomeCurso(''); fetchData(); } catch (error: any) { alert(`Erro ao cadastrar curso:\n${extrairMensagemErro(error)}`); } };
    const handleCadastrarDisciplina = async (e: React.FormEvent) => { e.preventDefault(); if (!cursoCodigoDisciplina) return alert('⚠️ Selecione o curso ao qual a disciplina pertence!'); try { await api.post('/disciplinas', { codigo: idDisciplina, nome: nomeDisciplina, cargaHoraria: parseInt(cargaHoraria), codigoCurso: cursoCodigoDisciplina, tipo: tipoDisciplina }); alert('📙 Disciplina cadastrada com sucesso!'); setIdDisciplina(''); setNomeDisciplina(''); setCargaHoraria('60'); setCursoCodigoDisciplina(''); setTipoDisciplina('OBRIGATORIA'); fetchData(); } catch (error: any) { alert(`Erro ao cadastrar disciplina:\n${extrairMensagemErro(error)}`); } };
    const handleCadastrarTurma = async (e: React.FormEvent) => { e.preventDefault(); if (!professorIdTurma || !disciplinaIdTurma) return alert('⚠️ Selecione a Disciplina e o Professor!'); try { const semestreFormatado = `${anoTurma}.${semestreTurmaNum}`; const payload = { codigoTurma: nomeTurma, semestreLetivo: semestreFormatado, sala: salaTurma, horario: horarioTurma, capacidadeMaxima: parseInt(capacidadeTurma), modalidade: modalidadeTurma, disciplinaCodigo: String(disciplinaIdTurma), professorId: Number(professorIdTurma) }; await api.post('/turmas', payload); alert('🏫 Turma criada e Professor alocado com sucesso!'); setNomeTurma(''); setSalaTurma(''); setHorarioTurma(''); fetchData(); } catch (error: any) { alert(`Erro ao criar turma:\n${extrairMensagemErro(error)}`); } };
    const handleInscreverEmTurma = async (e: React.FormEvent) => { e.preventDefault(); if (!alunoInscricaoId || !turmaInscricaoId) return alert('⚠️ Selecione Aluno e Turma.'); try { await api.post('/matriculas', { matriculaAluno: alunoInscricaoId, turmaId: Number(turmaInscricaoId) }); alert('✅ Aluno matriculado com sucesso na turma!'); setAlunoInscricaoId(''); setTurmaInscricaoId(''); } catch (error: any) { alert(`Erro ao matricular:\n${extrairMensagemErro(error)}`); } };

    const inputStyle = { padding: '0.8rem', border: '1px solid #D1D5DB', borderRadius: '4px', flex: 1, width: '100%', fontSize: '1rem', backgroundColor: '#FAFAFA', boxSizing: 'border-box' as const };
    const cardStyle = { background: '#FFFFFF', borderRadius: '8px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
    const btnStyle = { padding: '0.8rem 1.5rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'opacity 0.2s' };
    const tableStyle = { width: '100%', borderCollapse: 'collapse' as const, marginTop: '1rem', backgroundColor: '#FFF' };
    const thTdStyle = { borderBottom: '1px solid #E0E0E0', padding: '12px 8px', textAlign: 'left' as const, color: '#333' };

    const tabStyle = (aba: string) => ({
        padding: '0.75rem 1rem', cursor: 'pointer', border: 'none', borderRadius: '20px', fontWeight: 'bold',
        background: abaAtiva === aba ? '#004B87' : 'transparent', color: abaAtiva === aba ? '#fff' : '#555',
        transition: 'all 0.2s'
    });

    return (
        <div style={{ backgroundColor: '#F4F6F8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <nav style={{ backgroundColor: '#004B87', padding: '1rem 2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h2 style={{ margin: 0, borderRight: '1px solid rgba(255,255,255,0.3)', paddingRight: '1rem' }}>SIGA</h2>
                    <span style={{ fontSize: '1.1rem' }}>Painel Administrativo</span>
                </div>
                <button onClick={() => { logout(); navigate('/'); }} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.5)', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
            </nav>

            <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', background: '#FFF', padding: '0.5rem', borderRadius: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <button onClick={() => setAbaAtiva('CURSOS')} style={tabStyle('CURSOS')}>1. Cursos</button>
                    <button onClick={() => setAbaAtiva('DISCIPLINAS')} style={tabStyle('DISCIPLINAS')}>2. Disciplinas</button>
                    <button onClick={() => setAbaAtiva('PROFESSORES')} style={tabStyle('PROFESSORES')}>3. Docentes</button>
                    <button onClick={() => setAbaAtiva('TURMAS')} style={tabStyle('TURMAS')}>4. Turmas</button>
                    <button onClick={() => setAbaAtiva('ALUNOS')} style={tabStyle('ALUNOS')}>5. Alunos</button>
                    <button onClick={() => setAbaAtiva('INSCRICAO')} style={{ ...tabStyle('INSCRICAO'), background: abaAtiva === 'INSCRICAO' ? '#4CAF50' : (abaAtiva === 'INSCRICAO' ? '#004B87' : 'transparent'), color: abaAtiva === 'INSCRICAO' ? 'white' : '#555' }}>6. Efetivar Matrículas</button>
                </div>

                <div style={cardStyle}>
                    {abaAtiva === 'CURSOS' && (
                        <div>
                            <h3 style={{ marginTop: 0, color: '#004B87' }}>📘 Cadastrar Novo Curso</h3>
                            <form onSubmit={handleCadastrarCurso} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                                <input type="text" placeholder="Código (Ex: 03)" value={codigoNovoCurso} onChange={e => setCodigoNovoCurso(e.target.value.replace(/\D/g, '').slice(0, 3))} required style={{ ...inputStyle, flex: '0.3' }} />
                                <input type="text" placeholder="Nome do Curso (Ex: Engenharia de Software)" value={nomeCurso} onChange={e => setNomeCurso(e.target.value)} required style={inputStyle} />
                                <button type="submit" style={btnStyle}>Salvar Curso</button>
                            </form>
                            <h4 style={{ color: '#555', borderBottom: '2px solid #EEE', paddingBottom: '0.5rem' }}>Cursos Registrados na Instituição</h4>
                            <table style={tableStyle}><thead><tr><th style={thTdStyle}>Código</th><th style={thTdStyle}>Nome do Curso</th></tr></thead><tbody>{cursos.map(c => <tr key={c.codigo}><td style={{...thTdStyle, fontWeight: 'bold'}}>{c.codigo}</td><td style={thTdStyle}>{c.nome}</td></tr>)}</tbody></table>
                        </div>
                    )}

                    {abaAtiva === 'DISCIPLINAS' && (
                        <div>
                            <h3 style={{ marginTop: 0, color: '#004B87' }}>📙 Cadastrar Componente Curricular (Disciplina)</h3>
                            <form onSubmit={handleCadastrarDisciplina} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ flex: 0.3 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Código</label><input type="text" placeholder="MAT101" value={idDisciplina} onChange={e => setIdDisciplina(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))} required style={inputStyle} /></div>
                                    <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Nome da Disciplina</label><input type="text" placeholder="Ex: Matemática Aplicada" value={nomeDisciplina} onChange={e => setNomeDisciplina(e.target.value)} required style={inputStyle} /></div>
                                    <div style={{ flex: 0.3 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>CH (h)</label><input type="number" placeholder="60" value={cargaHoraria} onChange={e => setCargaHoraria(e.target.value)} required style={inputStyle} /></div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Vincular ao Curso</label>
                                        <select value={cursoCodigoDisciplina} onChange={(e) => setCursoCodigoDisciplina(e.target.value)} style={inputStyle} required>
                                            <option value="">-- Selecione o Curso --</option>
                                            {cursos.map(c => <option key={c.codigo} value={c.codigo}>{c.codigo} - {c.nome}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Tipo de Obrigação</label>
                                        <select value={tipoDisciplina} onChange={(e) => setTipoDisciplina(e.target.value)} style={inputStyle} required>
                                            <option value="OBRIGATORIA">Obrigatória</option>
                                            <option value="OPTATIVA">Optativa</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" style={{ ...btnStyle, alignSelf: 'flex-start' }}>Adicionar ao Catálogo</button>
                            </form>
                            <h4 style={{ color: '#555', borderBottom: '2px solid #EEE', paddingBottom: '0.5rem' }}>Disciplinas Registradas</h4>
                            <table style={tableStyle}><thead><tr><th style={thTdStyle}>Código</th><th style={thTdStyle}>Nome</th><th style={thTdStyle}>Carga Horária</th></tr></thead><tbody>{disciplinas.map((d, i) => <tr key={i}><td style={{...thTdStyle, fontWeight: 'bold'}}>#{getDiscId(d)}</td><td style={thTdStyle}>{d.nome}</td><td style={thTdStyle}>{d.cargaHoraria}h</td></tr>)}</tbody></table>
                        </div>
                    )}

                    {abaAtiva === 'PROFESSORES' && (
                        <div>
                            <h3 style={{ marginTop: 0, color: '#004B87' }}>👨‍🏫 Cadastrar Corpo Docente</h3>
                            <form onSubmit={handleCadastrarProfessor} style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
                                <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Nome Completo</label><input type="text" value={nomeProf} onChange={e => setNomeProf(e.target.value)} required style={inputStyle} /></div>
                                <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>E-mail Institucional</label><input type="email" placeholder="prof@ufc.br" value={emailProf} onChange={e => setEmailProf(e.target.value)} required style={inputStyle} /></div>
                                <button type="submit" style={btnStyle}>Salvar Docente</button>
                            </form>
                            <h4 style={{ color: '#555', borderBottom: '2px solid #EEE', paddingBottom: '0.5rem' }}>Professores Ativos</h4>
                            <table style={tableStyle}><thead><tr><th style={thTdStyle}>Matrícula/ID</th><th style={thTdStyle}>Nome</th><th style={thTdStyle}>E-mail</th></tr></thead><tbody>{professores.map((p, i) => <tr key={i}><td style={thTdStyle}>#{getProfId(p)}</td><td style={{...thTdStyle, fontWeight: 'bold'}}>{p.nome}</td><td style={thTdStyle}>{p.email}</td></tr>)}</tbody></table>
                        </div>
                    )}

                    {abaAtiva === 'TURMAS' && (
                        <div>
                            <h3 style={{ marginTop: 0, color: '#004B87' }}>🏫 Abertura de Turma e Alocação</h3>
                            <form onSubmit={handleCadastrarTurma} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Identificador da Turma</label><input type="text" placeholder="Ex: T01" value={nomeTurma} onChange={e => setNomeTurma(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5))} required style={inputStyle} /></div>
                                    <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Ano Letivo</label><input type="number" min="2020" max="2030" value={anoTurma} onChange={e => setAnoTurma(e.target.value)} required style={inputStyle} /></div>
                                    <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Semestre</label><select value={semestreTurmaNum} onChange={e => setSemestreTurmaNum(e.target.value)} required style={inputStyle}><option value="1">1º Semestre</option><option value="2">2º Semestre</option></select></div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Sala Base</label><input type="text" placeholder="Ex: Sala 101" value={salaTurma} onChange={e => setSalaTurma(e.target.value)} required style={inputStyle} /></div>
                                    <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Horários</label><input type="text" placeholder="Ex: Seg/Qua 14h" value={horarioTurma} onChange={e => setHorarioTurma(e.target.value)} required style={inputStyle} /></div>
                                    <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Capacidade (Vagas)</label><input type="number" min="1" value={capacidadeTurma} onChange={e => setCapacidadeTurma(e.target.value)} required style={inputStyle} /></div>
                                    <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Modalidade</label><select value={modalidadeTurma} onChange={e => setModalidadeTurma(e.target.value)} required style={inputStyle}><option value="Presencial">Presencial</option><option value="EAD">Ensino a Distância</option><option value="Hibrido">Híbrido</option></select></div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Componente (Disciplina)</label><select value={disciplinaIdTurma} onChange={e => setDisciplinaIdTurma(e.target.value)} required style={inputStyle}><option value="">-- Selecione a Disciplina --</option>{disciplinas.map((d, i) => <option key={i} value={getDiscId(d)}>{d.nome}</option>)}</select></div>
                                    <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Docente Responsável</label><select value={professorIdTurma} onChange={e => setProfessorIdTurma(e.target.value)} required style={inputStyle}><option value="">-- Aloque um Professor --</option>{professores.map((p, i) => <option key={i} value={getProfId(p)}>{p.nome}</option>)}</select></div>
                                </div>
                                <button type="submit" style={{ ...btnStyle, alignSelf: 'flex-start' }}>Gerar Diário da Turma</button>
                            </form>
                            <h4 style={{ color: '#555', borderBottom: '2px solid #EEE', paddingBottom: '0.5rem' }}>Turmas Ativas no Sistema</h4>
                            <table style={tableStyle}>
                                <thead>
                                <tr><th style={thTdStyle}>Identificador</th><th style={thTdStyle}>Período</th></tr>
                                </thead>
                                <tbody>
                                {turmas.map(t => (
                                    <tr key={t.id || t.nome}>
                                        {/* 💡 Lendo o semestreLetivo para evitar colunas em branco */}
                                        <td style={{...thTdStyle, fontWeight: 'bold'}}>{t.nome || t.codigoTurma}</td>
                                        <td style={thTdStyle}>{t.semestreLetivo || t.semestre || '-'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {abaAtiva === 'ALUNOS' && (
                        <div>
                            <h3 style={{ marginTop: 0, color: '#004B87' }}>📝 Cadastrar Novo Discente</h3>
                            <form onSubmit={handleCadastrarAluno} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ flex: 2 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Nome Completo</label><input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required style={inputStyle} /></div>
                                    <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>CPF</label><input type="text" value={cpf} onChange={handleCpfChange} required style={inputStyle} /></div>
                                    <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Data de Nascimento</label><input type="date" max="9999-12-31" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} style={inputStyle} /></div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>E-mail</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} /></div>
                                    <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Telefone</label><input type="text" value={telefone} onChange={handleTelefoneChange} style={inputStyle} /></div>
                                </div>
                                <div><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Endereço Completo</label><input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} style={inputStyle} /></div>

                                <div style={{ background: '#FAFAFA', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E0E0E0' }}>
                                    <h4 style={{ margin: '0 0 1rem 0', color: '#004B87' }}>Dados Acadêmicos Iniciais</h4>
                                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                                        <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Ano de Ingresso</label><input type="number" min="2020" max="2030" value={anoIngresso} onChange={(e) => setAnoIngresso(e.target.value)} required style={{...inputStyle, background: '#FFF'}} /></div>
                                        <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Semestre</label><select value={semestreIngresso} onChange={(e) => setSemestreIngresso(e.target.value)} style={{...inputStyle, background: '#FFF'}}><option value="1">1º Sem.</option><option value="2">2º Sem.</option></select></div>
                                        <div style={{ flex: 2 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Curso Base</label><select value={cursoCodigo} onChange={(e) => setCursoCodigo(e.target.value)} style={{...inputStyle, background: '#FFF'}} required><option value="">-- Selecione o Curso --</option>{cursos.map(c => <option key={c.codigo} value={c.codigo}>{c.codigo} - {c.nome}</option>)}</select></div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
                                        <div style={{ flex: tipo === 'ESPECIAL' ? 1 : 2 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Status de Vínculo</label><select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{...inputStyle, background: '#FFF'}}><option value="NORMAL">Regular (Normal)</option><option value="ESPECIAL">Especial (Transferência/Intercâmbio)</option></select></div>
                                        {tipo === 'ESPECIAL' && (<div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Instituição de Origem</label><input type="text" value={instituicaoOrigem} onChange={(e) => setInstituicaoOrigem(e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, ''))} required placeholder="Ex: IFCE" style={{...inputStyle, background: '#FFF'}} /></div>)}
                                    </div>
                                </div>
                                <button type="submit" style={{ ...btnStyle, alignSelf: 'flex-start', padding: '1rem 2rem' }}>Salvar Ficha do Aluno</button>
                            </form>
                        </div>
                    )}

                    {abaAtiva === 'INSCRICAO' && (
                        <div>
                            <h3 style={{ marginTop: 0, color: '#4CAF50' }}>✅ Efetivação de Matrícula (Inscrição em Turma)</h3>
                            <p style={{ color: '#666', marginBottom: '2rem' }}>Utilize este painel para inserir oficialmente o aluno no diário de classe de uma turma aberta.</p>
                            <form onSubmit={handleInscreverEmTurma} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Discente (Aluno)</label>
                                    <select value={alunoInscricaoId} onChange={e => setAlunoInscricaoId(e.target.value)} required style={{...inputStyle, border: '1px solid #4CAF50'}}>
                                        <option value="">-- Buscar Aluno Ativo --</option>
                                        {alunos.map(a => <option key={a.matricula} value={a.matricula}>{a.nome} (Matrícula: {a.matricula})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Turma de Destino</label>
                                    <select value={turmaInscricaoId} onChange={e => setTurmaInscricaoId(e.target.value)} required style={{...inputStyle, border: '1px solid #4CAF50'}}>
                                        <option value="">-- Buscar Turma com Vagas --</option>
                                        {turmas.map(t => <option key={t.id} value={t.id}>{t.codigoTurma || t.nome}</option>)}
                                    </select>
                                </div>
                                <button type="submit" style={{ ...btnStyle, background: '#4CAF50', alignSelf: 'flex-start' }}>Efetivar Matrícula no Sistema</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
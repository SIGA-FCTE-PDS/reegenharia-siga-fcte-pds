package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dao.AlunoDAO;
import br.ufc.fcte.siga.dao.DisciplinaDAO;
import br.ufc.fcte.siga.dao.MatriculaDAO;
import br.ufc.fcte.siga.dao.ProfessorDAO;
import br.ufc.fcte.siga.dao.TurmaDAO;
import br.ufc.fcte.siga.dto.MatriculaRequestDTO;
import br.ufc.fcte.siga.dto.MatriculaResponseDTO;
import br.ufc.fcte.siga.dto.TurmaRequestDTO;
import br.ufc.fcte.siga.dto.TurmaResponseDTO;
import br.ufc.fcte.siga.exception.*;
import br.ufc.fcte.siga.mapper.TurmaMapper;
import br.ufc.fcte.siga.model.Aluno;
import br.ufc.fcte.siga.model.Disciplina;
import br.ufc.fcte.siga.model.Matricula;
import br.ufc.fcte.siga.model.Professor;
import br.ufc.fcte.siga.model.Turma;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TurmaServiceImpl implements TurmaService {

    private static final String STATUS_ATIVA = "ATIVA";

    private final TurmaDAO turmaDAO;
    private final AlunoDAO alunoDAO;
    private final MatriculaDAO matriculaDAO;
    private final DisciplinaDAO disciplinaDAO;
    private final ProfessorDAO professorDAO;

    @Autowired
    public TurmaServiceImpl(TurmaDAO turmaDAO, AlunoDAO alunoDAO, MatriculaDAO matriculaDAO, DisciplinaDAO disciplinaDAO, ProfessorDAO professorDAO) {
        this.turmaDAO = turmaDAO;
        this.alunoDAO = alunoDAO;
        this.matriculaDAO = matriculaDAO;
        this.disciplinaDAO = disciplinaDAO;
        this.professorDAO = professorDAO;
    }
    @Override
    public TurmaResponseDTO criar(TurmaRequestDTO dto) {
        Disciplina disciplina = disciplinaDAO.findById(dto.getDisciplinaCodigo())
                .orElseThrow(() -> new DisciplinaNaoEncontradaException("Disciplina não encontrada: " + dto.getDisciplinaCodigo()));

        Professor professor = professorDAO.findById(dto.getProfessorId())
                .orElseThrow(() -> new ProfessorNaoEncontradoException("Professor não encontrado: " + dto.getProfessorId()));

        Turma turma = new Turma();
        turma.setCodigoTurma(dto.getCodigoTurma());
        turma.setSemestreLetivo(dto.getSemestreLetivo());
        turma.setSala(dto.getSala());
        turma.setHorario(dto.getHorario());
        turma.setCapacidadeMaxima(dto.getCapacidadeMaxima());
        turma.setModalidade(dto.getModalidade());
        turma.setDisciplina(disciplina);
        turma.setProfessor(professor);

        Turma turmaSalva = turmaDAO.save(turma);
        return TurmaMapper.toResponseDTO(turmaSalva, 0); // Vagas ocupadas inicialmente é 0
    }

    @Override
    public List<TurmaResponseDTO> listarTodas() {
        return turmaDAO.findAll().stream()
                .map(t -> {
                    int vagasOcupadas = (int) matriculaDAO.countByTurmaIdAndStatusMatricula(t.getId(), STATUS_ATIVA);
                    return TurmaMapper.toResponseDTO(t, vagasOcupadas);
                })
                .collect(Collectors.toList());
    }

    @Override
    public TurmaResponseDTO buscarPorId(Long id) {
        Turma turma = turmaDAO.findById(id)
                .orElseThrow(() -> new TurmaNaoEncontradaException("Turma não encontrada com ID: " + id));
        int vagasOcupadas = (int) matriculaDAO.countByTurmaIdAndStatusMatricula(turma.getId(), STATUS_ATIVA);
        return TurmaMapper.toResponseDTO(turma, vagasOcupadas);
    }
    @Override
    @Transactional
    public MatriculaResponseDTO matricularAluno(MatriculaRequestDTO dto) {
        Aluno aluno = alunoDAO.findById(dto.getMatriculaAluno())
                .orElseThrow(() -> new AlunoNaoEncontradoException("Aluno não encontrado com matrícula: " + dto.getMatriculaAluno()));

        Turma turma = turmaDAO.findById(dto.getTurmaId())
                .orElseThrow(() -> new TurmaNaoEncontradaException("Turma não encontrada com id: " + dto.getTurmaId()));

        if (matriculaDAO.existsByAlunoMatriculaAndTurmaId(aluno.getMatricula(), turma.getId())) {
            throw new MatriculaDuplicadaException("Aluno já está matriculado nesta turma.");
        }

        long vagasOcupadas = matriculaDAO.countByTurmaIdAndStatusMatricula(turma.getId(), STATUS_ATIVA);
        if (vagasOcupadas >= turma.getCapacidadeMaxima()) {
            throw new TurmaLotadaException("A turma " + turma.getCodigoTurma() + " está lotada (" + turma.getCapacidadeMaxima() + " vagas).");
        }

        Matricula matricula = new Matricula();
        matricula.setAluno(aluno);
        matricula.setTurma(turma);
        matricula.setStatusMatricula(STATUS_ATIVA);

        Matricula salva = matriculaDAO.save(matricula);
        return toMatriculaResponseDTO(salva);
    }

    @Override
    public List<MatriculaResponseDTO> listarMatriculasPorTurma(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new TurmaNaoEncontradaException("Turma não encontrada com id: " + turmaId));

        return turma.getMatriculas()
                .stream()
                .map(this::toMatriculaResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MatriculaResponseDTO atualizarStatusMatricula(Long matriculaId, String status) {
        Matricula matricula = matriculaDAO.findById(matriculaId)
                .orElseThrow(() -> new MatriculaNaoEncontradaException("Matrícula não encontrada com id: " + matriculaId));

        matricula.setStatusMatricula(status);
        Matricula salva = matriculaDAO.save(matricula);
        return toMatriculaResponseDTO(salva);
    }

    private MatriculaResponseDTO toMatriculaResponseDTO(Matricula matricula) {
        return new MatriculaResponseDTO(
                matricula.getId(),
                matricula.getStatusMatricula(),
                matricula.getAluno().getMatricula(),
                matricula.getAluno().getNome(),
                matricula.getTurma().getId(),
                matricula.getTurma().getCodigoTurma()
        );
    }
}
package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dao.AlunoDAO;
import br.ufc.fcte.siga.dao.MatriculaDAO;
import br.ufc.fcte.siga.dao.TurmaDAO;
import br.ufc.fcte.siga.dto.MatriculaRequestDTO;
import br.ufc.fcte.siga.dto.MatriculaResponseDTO;
import br.ufc.fcte.siga.exception.AlunoNaoEncontradoException;
import br.ufc.fcte.siga.exception.MatriculaDuplicadaException;
import br.ufc.fcte.siga.exception.TurmaLotadaException;
import br.ufc.fcte.siga.exception.TurmaNaoEncontradaException;
import br.ufc.fcte.siga.model.Aluno;
import br.ufc.fcte.siga.model.Matricula;
import br.ufc.fcte.siga.model.Turma;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TurmaServiceImpl implements TurmaService {

    // Status usado quando a matrícula está ocupando vaga normalmente (RN08, ver Matricula.java)
    private static final String STATUS_ATIVA = "ATIVA";

    private final TurmaDAO turmaDAO;
    private final AlunoDAO alunoDAO;
    private final MatriculaDAO matriculaDAO;

    @Autowired
    public TurmaServiceImpl(TurmaDAO turmaDAO, AlunoDAO alunoDAO, MatriculaDAO matriculaDAO) {
        this.turmaDAO = turmaDAO;
        this.alunoDAO = alunoDAO;
        this.matriculaDAO = matriculaDAO;
    }

    /**
     * Matricula um aluno em uma turma (SF-56).
     *
     * RN01: a matrícula só é permitida se a turma ainda tiver vagas disponíveis,
     * ou seja, se a quantidade de matrículas ATIVAS na turma for menor que a capacidadeMaxima.
     *
     * @Transactional garante que a contagem de vagas e o save acontecem de forma atômica,
     * evitando que duas requisições simultâneas "furem" o limite de vagas.
     */
    @Override
    @Transactional
    public MatriculaResponseDTO matricularAluno(MatriculaRequestDTO dto) {
        Aluno aluno = alunoDAO.findById(dto.getMatriculaAluno())
                .orElseThrow(() -> new AlunoNaoEncontradoException(
                        "Aluno não encontrado com matrícula: " + dto.getMatriculaAluno()));

        Turma turma = turmaDAO.findById(dto.getTurmaId())
                .orElseThrow(() -> new TurmaNaoEncontradaException(
                        "Turma não encontrada com id: " + dto.getTurmaId()));

        // Evita duplicidade: aluno já matriculado nesta turma
        if (matriculaDAO.existsByAlunoMatriculaAndTurmaId(aluno.getMatricula(), turma.getId())) {
            throw new MatriculaDuplicadaException(
                    "Aluno já está matriculado nesta turma.");
        }

        // RN01: valida limite de vagas antes de salvar
        long vagasOcupadas = matriculaDAO.countByTurmaIdAndStatusMatricula(turma.getId(), STATUS_ATIVA);
        if (vagasOcupadas >= turma.getCapacidadeMaxima()) {
            throw new TurmaLotadaException(
                    "A turma " + turma.getCodigoTurma() + " está lotada (" + turma.getCapacidadeMaxima() + " vagas).");
        }

        Matricula matricula = new Matricula();
        matricula.setAluno(aluno);
        matricula.setTurma(turma);
        matricula.setStatusMatricula(STATUS_ATIVA);

        Matricula salva = matriculaDAO.save(matricula);
        return toResponseDTO(salva);
    }

    @Override
    public List<MatriculaResponseDTO> listarMatriculasPorTurma(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new TurmaNaoEncontradaException("Turma não encontrada com id: " + turmaId));

        return turma.getMatriculas()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    private MatriculaResponseDTO toResponseDTO(Matricula matricula) {
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

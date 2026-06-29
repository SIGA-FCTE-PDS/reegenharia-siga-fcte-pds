package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dao.AlunoDAO;
import br.ufc.fcte.siga.dao.MatriculaDAO;
import br.ufc.fcte.siga.dao.TurmaDAO;
import br.ufc.fcte.siga.dto.MatriculaRequestDTO;
import br.ufc.fcte.siga.dto.MatriculaResponseDTO;
import br.ufc.fcte.siga.model.Aluno;
import br.ufc.fcte.siga.model.Matricula;
import br.ufc.fcte.siga.model.Turma;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatriculaServiceImpl implements MatriculaService {

    private final MatriculaDAO matriculaDAO;
    private final AlunoDAO alunoDAO;
    private final TurmaDAO turmaDAO;

    @Autowired
    public MatriculaServiceImpl(MatriculaDAO matriculaDAO, AlunoDAO alunoDAO, TurmaDAO turmaDAO) {
        this.matriculaDAO = matriculaDAO;
        this.alunoDAO = alunoDAO;
        this.turmaDAO = turmaDAO;
    }

    @Override
    public MatriculaResponseDTO matricularAluno(MatriculaRequestDTO dto) {
        Aluno aluno = alunoDAO.findById(dto.getMatriculaAluno())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado."));

        Turma turma = turmaDAO.findById(dto.getTurmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada."));

        if (matriculaDAO.existsByAlunoMatriculaAndTurmaId(aluno.getMatricula(), turma.getId())) {
            throw new RuntimeException("Este aluno já está matriculado nesta turma.");
        }

        long vagasOcupadas = matriculaDAO.countByTurmaIdAndStatusMatricula(turma.getId(), "ATIVA");
        if (vagasOcupadas >= turma.getCapacidadeMaxima()) {
            throw new RuntimeException("Turma lotada! Capacidade máxima (" + turma.getCapacidadeMaxima() + ") atingida.");
        }

        Matricula matricula = new Matricula();
        matricula.setAluno(aluno);
        matricula.setTurma(turma);
        matricula.setStatusMatricula("ATIVA");

        Matricula salva = matriculaDAO.save(matricula);

        return new MatriculaResponseDTO(
                salva.getId(), salva.getStatusMatricula(),
                salva.getAluno().getMatricula(), salva.getAluno().getNome(),
                salva.getTurma().getId(), salva.getTurma().getCodigoTurma()
        );
    }

    @Override
    public List<MatriculaResponseDTO> listarAlunosDaTurma(Long turmaId) {
        return matriculaDAO.findByTurmaIdAndStatusMatricula(turmaId, "ATIVA")
                .stream().map(m -> new MatriculaResponseDTO(
                        m.getId(), m.getStatusMatricula(),
                        m.getAluno().getMatricula(), m.getAluno().getNome(),
                        m.getTurma().getId(), m.getTurma().getCodigoTurma()
                )).collect(Collectors.toList());
    }

    @Override
    public List<MatriculaResponseDTO> listarTurmasDoAluno(String matriculaAluno) {
        return matriculaDAO.findByAlunoMatricula(matriculaAluno)
                .stream().map(m -> new MatriculaResponseDTO(
                        m.getId(), m.getStatusMatricula(),
                        m.getAluno().getMatricula(), m.getAluno().getNome(),
                        m.getTurma().getId(), m.getTurma().getCodigoTurma()
                )).collect(Collectors.toList());
    }
}
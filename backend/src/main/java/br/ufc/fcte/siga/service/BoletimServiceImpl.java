package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dao.AlunoDAO;
import br.ufc.fcte.siga.dao.AvaliacaoDAO;
import br.ufc.fcte.siga.dao.NotaDAO;
import br.ufc.fcte.siga.dto.NotaRequestDTO;
import br.ufc.fcte.siga.dto.NotaResponseDTO;
import br.ufc.fcte.siga.exception.AlunoNaoEncontradoException;
import br.ufc.fcte.siga.exception.AvaliacaoNaoEncontradaException;
import br.ufc.fcte.siga.model.Aluno;
import br.ufc.fcte.siga.model.Avaliacao;
import br.ufc.fcte.siga.model.Nota;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BoletimServiceImpl implements BoletimService {

    private final NotaDAO notaDAO;
    private final AlunoDAO alunoDAO;
    private final AvaliacaoDAO avaliacaoDAO;

    @Autowired
    public BoletimServiceImpl(NotaDAO notaDAO, AlunoDAO alunoDAO, AvaliacaoDAO avaliacaoDAO) {
        this.notaDAO = notaDAO;
        this.alunoDAO = alunoDAO;
        this.avaliacaoDAO = avaliacaoDAO;
    }

    @Override
    public NotaResponseDTO lancarNota(NotaRequestDTO dto) {
        Aluno aluno = alunoDAO.findById(dto.getMatriculaAluno())
                .orElseThrow(() -> new AlunoNaoEncontradoException(
                        "Aluno não encontrado com matrícula: " + dto.getMatriculaAluno()));

        Avaliacao avaliacao = avaliacaoDAO.findById(dto.getAvaliacaoId())
                .orElseThrow(() -> new AvaliacaoNaoEncontradaException(
                        "Avaliação não encontrada com id: " + dto.getAvaliacaoId()));

        Nota nota = new Nota();
        nota.setAluno(aluno);
        nota.setAvaliacao(avaliacao);
        nota.setValor(dto.getValor());

        Nota salva = notaDAO.save(nota);
        return toResponseDTO(salva);
    }

    @Override
    public List<NotaResponseDTO> listarNotasPorAlunoETurma(String matriculaAluno, Long turmaId) {
        return notaDAO.findByAlunoMatriculaAndAvaliacaoTurmaId(matriculaAluno, turmaId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    private NotaResponseDTO toResponseDTO(Nota nota) {
        return new NotaResponseDTO(
                nota.getId(),
                nota.getValor(),
                nota.getAluno().getMatricula(),
                nota.getAvaliacao().getId(),
                nota.getAvaliacao().getDescricao()
        );
    }
}

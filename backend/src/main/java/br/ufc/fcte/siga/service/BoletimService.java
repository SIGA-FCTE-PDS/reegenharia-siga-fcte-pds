package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dto.NotaRequestDTO;
import br.ufc.fcte.siga.dto.NotaResponseDTO;

import java.util.List;

public interface BoletimService {

    /**
     * Lança a nota de um aluno em uma avaliação específica (SF-58).
     */
    NotaResponseDTO lancarNota(NotaRequestDTO dto);

    List<NotaResponseDTO> listarNotasPorAlunoETurma(String matriculaAluno, Long turmaId);
}

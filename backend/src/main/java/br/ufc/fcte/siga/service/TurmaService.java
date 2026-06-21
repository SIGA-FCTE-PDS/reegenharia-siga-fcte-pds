package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dto.MatriculaRequestDTO;
import br.ufc.fcte.siga.dto.MatriculaResponseDTO;

import java.util.List;

public interface TurmaService {

    /**
     * Matricula um aluno em uma turma, validando limite de vagas (SF-56).
     */
    MatriculaResponseDTO matricularAluno(MatriculaRequestDTO dto);

    List<MatriculaResponseDTO> listarMatriculasPorTurma(Long turmaId);
}
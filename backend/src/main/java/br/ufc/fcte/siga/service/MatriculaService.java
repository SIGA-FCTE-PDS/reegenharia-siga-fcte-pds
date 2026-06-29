package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dto.MatriculaRequestDTO;
import br.ufc.fcte.siga.dto.MatriculaResponseDTO;
import java.util.List;

public interface MatriculaService {
    MatriculaResponseDTO matricularAluno(MatriculaRequestDTO dto);
    List<MatriculaResponseDTO> listarAlunosDaTurma(Long turmaId);
    List<MatriculaResponseDTO> listarTurmasDoAluno(String matriculaAluno);
}
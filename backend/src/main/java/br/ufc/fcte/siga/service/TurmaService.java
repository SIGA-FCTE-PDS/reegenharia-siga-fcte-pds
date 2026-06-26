package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dto.MatriculaRequestDTO;
import br.ufc.fcte.siga.dto.MatriculaResponseDTO;
import br.ufc.fcte.siga.dto.TurmaRequestDTO;
import br.ufc.fcte.siga.dto.TurmaResponseDTO;

import java.util.List;

public interface TurmaService {

    TurmaResponseDTO criar(TurmaRequestDTO dto);

    List<TurmaResponseDTO> listarTodas();

    TurmaResponseDTO buscarPorId(Long id);

    MatriculaResponseDTO atualizarStatusMatricula(Long matriculaId, String status);

    MatriculaResponseDTO matricularAluno(MatriculaRequestDTO dto);

    List<MatriculaResponseDTO> listarMatriculasPorTurma(Long turmaId);
}

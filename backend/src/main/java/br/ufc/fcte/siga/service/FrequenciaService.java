package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dto.FrequenciaRequestDTO;
import br.ufc.fcte.siga.dto.FrequenciaResponseDTO;

import java.util.List;

public interface FrequenciaService {
    FrequenciaResponseDTO registrar(FrequenciaRequestDTO dto);

    List<FrequenciaResponseDTO> listarPorAlunoETurma(String matriculaAluno, Long turmaId);
}
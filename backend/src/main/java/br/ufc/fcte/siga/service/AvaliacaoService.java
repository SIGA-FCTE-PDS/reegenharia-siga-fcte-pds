package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dto.AvaliacaoRequestDTO;
import br.ufc.fcte.siga.dto.AvaliacaoResponseDTO;

import java.util.List;

public interface AvaliacaoService {

    AvaliacaoResponseDTO criar(AvaliacaoRequestDTO dto);

    List<AvaliacaoResponseDTO> listarPorTurma(Long turmaId);
}
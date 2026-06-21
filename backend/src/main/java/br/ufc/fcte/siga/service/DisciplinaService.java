package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dto.DisciplinaRequestDTO;
import br.ufc.fcte.siga.dto.DisciplinaResponseDTO;

import java.util.List;

public interface DisciplinaService {

    DisciplinaResponseDTO criar(DisciplinaRequestDTO dto);

    DisciplinaResponseDTO buscarPorCodigo(String codigo);

    List<DisciplinaResponseDTO> listarTodos();

    DisciplinaResponseDTO atualizar(String codigo, DisciplinaRequestDTO dto);

    void deletar(String codigo);
}
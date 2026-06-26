package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dto.CursoRequestDTO;
import br.ufc.fcte.siga.dto.CursoResponseDTO;

import java.util.List;

public interface CursoService {

    CursoResponseDTO criar(CursoRequestDTO dto);

    CursoResponseDTO buscarPorCodigo(String codigo);

    List<CursoResponseDTO> listarTodos();

    void deletar(String codigo);

}
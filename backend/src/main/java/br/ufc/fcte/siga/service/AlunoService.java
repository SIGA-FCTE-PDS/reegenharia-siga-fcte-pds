package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dto.AlunoRequestDTO;
import br.ufc.fcte.siga.dto.AlunoResponseDTO;

import java.util.List;

public interface AlunoService {

    AlunoResponseDTO criar(AlunoRequestDTO dto);

    AlunoResponseDTO buscarPorMatricula(String matricula);

    List<AlunoResponseDTO> listarTodos();

    AlunoResponseDTO atualizar(String matricula, AlunoRequestDTO dto);

    void deletar(String matricula);
}

package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dto.ProfessorRequestDTO;
import br.ufc.fcte.siga.dto.ProfessorResponseDTO;
import java.util.List;

public interface ProfessorService {
    ProfessorResponseDTO criar(ProfessorRequestDTO dto);
    ProfessorResponseDTO atualizar(Long id, ProfessorRequestDTO dto);
    void deletar(Long id);
    ProfessorResponseDTO buscarPorId(Long id);
    List<ProfessorResponseDTO> listarTodos();
    ProfessorResponseDTO buscarPorEmail(String email);
}


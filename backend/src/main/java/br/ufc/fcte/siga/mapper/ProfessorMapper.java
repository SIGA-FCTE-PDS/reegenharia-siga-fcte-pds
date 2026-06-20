package br.ufc.fcte.siga.mapper;

import br.ufc.fcte.siga.dto.ProfessorRequestDTO;
import br.ufc.fcte.siga.dto.ProfessorResponseDTO;
import br.ufc.fcte.siga.model.Professor;

public class ProfessorMapper {

    private ProfessorMapper() {
    }

    public static ProfessorResponseDTO toResponseDTO(Professor professor) {
        if (professor == null) {
            return null;
        }
        return new ProfessorResponseDTO(professor.getId(), professor.getNome(), professor.getEmail());
    }

    public static Professor toEntity(ProfessorRequestDTO dto) {
        Professor professor = new Professor();
        professor.setNome(dto.getNome());
        professor.setEmail(dto.getEmail());
        return professor;
    }

    public static void updateEntityFromDTO(Professor professor, ProfessorRequestDTO dto) {
        professor.setNome(dto.getNome());
        professor.setEmail(dto.getEmail());
    }
}

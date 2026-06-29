package br.ufc.fcte.siga.mapper;

import br.ufc.fcte.siga.dto.DisciplinaRequestDTO;
import br.ufc.fcte.siga.dto.DisciplinaResponseDTO;
import br.ufc.fcte.siga.model.Disciplina;

public class DisciplinaMapper {

    private DisciplinaMapper() {
    }

    public static DisciplinaResponseDTO toResponseDTO(Disciplina disciplina) {
        if (disciplina == null) {
            return null;
        }

        DisciplinaResponseDTO dto = new DisciplinaResponseDTO();
        dto.setCodigo(disciplina.getCodigo());
        dto.setNome(disciplina.getNome());
        dto.setCargaHoraria(disciplina.getCargaHoraria());
        dto.setTipo(disciplina.getTipo());
        dto.setPreRequisitos(disciplina.getPreRequisitos());

        if (disciplina.getCurso() != null) {
            dto.setCodigoCurso(disciplina.getCurso().getCodigo());
            dto.setNomeCurso(disciplina.getCurso().getNome());
        }

        return dto;
    }

    public static Disciplina toEntity(DisciplinaRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        Disciplina disciplina = new Disciplina();
        disciplina.setCodigo(dto.getCodigo());
        disciplina.setNome(dto.getNome());
        disciplina.setCargaHoraria(dto.getCargaHoraria());
        disciplina.setTipo(dto.getTipo());
        disciplina.setPreRequisitos(dto.getPreRequisitos());
        return disciplina;
    }

    public static void updateEntityFromDTO(Disciplina disciplina, DisciplinaRequestDTO dto) {
        if (dto != null) {
            disciplina.setNome(dto.getNome());
            disciplina.setCargaHoraria(dto.getCargaHoraria());
            disciplina.setTipo(dto.getTipo());
            disciplina.setPreRequisitos(dto.getPreRequisitos());
        }
    }
}
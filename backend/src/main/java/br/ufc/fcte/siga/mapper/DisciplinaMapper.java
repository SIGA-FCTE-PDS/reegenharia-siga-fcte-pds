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
        return new DisciplinaResponseDTO(
                disciplina.getCodigo(),
                disciplina.getNome(),
                disciplina.getCargaHoraria(),
                disciplina.getTipo(),
                disciplina.getPreRequisitos()
        );
    }

    public static Disciplina toEntity(DisciplinaRequestDTO dto) {
        Disciplina disciplina = new Disciplina();
        disciplina.setCodigo(dto.getCodigo());
        disciplina.setNome(dto.getNome());
        disciplina.setCargaHoraria(dto.getCargaHoraria());
        disciplina.setTipo(dto.getTipo());
        disciplina.setPreRequisitos(dto.getPreRequisitos());
        return disciplina;
    }

    public static void updateEntityFromDTO(Disciplina disciplina, DisciplinaRequestDTO dto) {
        disciplina.setNome(dto.getNome());
        disciplina.setCargaHoraria(dto.getCargaHoraria());
        disciplina.setTipo(dto.getTipo());
        disciplina.setPreRequisitos(dto.getPreRequisitos());
    }
}
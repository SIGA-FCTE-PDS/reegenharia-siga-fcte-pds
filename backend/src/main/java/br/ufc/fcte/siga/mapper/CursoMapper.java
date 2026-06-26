package br.ufc.fcte.siga.mapper;

import br.ufc.fcte.siga.dto.CursoRequestDTO;
import br.ufc.fcte.siga.dto.CursoResponseDTO;
import br.ufc.fcte.siga.model.Curso;

public class CursoMapper {

    private CursoMapper() {
    }

    public static CursoResponseDTO toResponseDTO(Curso curso) {
        if (curso == null) {
            return null;
        }
        return new CursoResponseDTO(curso.getCodigo(), curso.getNome());
    }

    public static Curso toEntity(CursoRequestDTO dto) {
        Curso curso = new Curso();
        curso.setCodigo(dto.getCodigo());
        curso.setNome(dto.getNome());
        return curso;
    }
}

package br.ufc.fcte.siga.dto;

import lombok.Data;
import java.util.List;

@Data
public class DisciplinaRequestDTO {
    private String codigo;
    private String nome;
    private int cargaHoraria;

    // "OBRIGATORIA" ou "OPTATIVA"
    private String tipo;

    // 💡 O código do curso que a disciplina pertence
    private String codigoCurso;

    private List<String> preRequisitos;
}
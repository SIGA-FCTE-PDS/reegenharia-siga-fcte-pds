package br.ufc.fcte.siga.dto;

import lombok.Data;

@Data

public class MatriculaRequestDTO {
    private String matriculaAluno; // ID do Aluno
    private Long turmaId;
}

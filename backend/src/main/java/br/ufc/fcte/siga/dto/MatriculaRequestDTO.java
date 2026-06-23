package br.ufc.fcte.siga.dto;

import lombok.Data;

/**
 * DTO de entrada para matricular um aluno em uma turma (SF-56).
 */
@Data

public class MatriculaRequestDTO {
    private String matriculaAluno; // ID do Aluno
    private Long turmaId;
}

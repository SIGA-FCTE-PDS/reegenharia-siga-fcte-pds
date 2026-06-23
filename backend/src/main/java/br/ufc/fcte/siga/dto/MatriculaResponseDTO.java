package br.ufc.fcte.siga.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO de saída para Matricula (inscrição de um Aluno em uma Turma).
 * Expõe só os dados essenciais de Aluno/Turma (nome/código), nunca os objetos completos,
 * para não cair no loop Matricula -> Turma -> Matriculas -> Turma -> ...
 */
@Data
@NoArgsConstructor
@AllArgsConstructor

public class MatriculaResponseDTO {
    private Long id;
    private String statusMatricula;
    private String matriculaAluno;
    private String nomeAluno;
    private Long turmaId;
    private String codigoTurma;
}

package br.ufc.fcte.siga.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

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

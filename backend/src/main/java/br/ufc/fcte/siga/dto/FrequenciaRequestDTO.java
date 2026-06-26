package br.ufc.fcte.siga.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FrequenciaRequestDTO {
    private String matriculaAluno;
    private Long turmaId;
    private LocalDate data;
    private boolean presente;
    private int quantidadeFaltas;
}
package br.ufc.fcte.siga.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class FrequenciaResponseDTO {
    private Long id;
    private LocalDate data;
    private boolean presente;
    private String matriculaAluno;
    private Long turmaId;
}

package br.ufc.fcte.siga.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoResponseDTO {
    private Long id;
    private String descricao;
    private Long turmaId;
    private String codigoTurma;
    private int peso;
}
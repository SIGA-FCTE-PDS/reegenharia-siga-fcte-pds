package br.ufc.fcte.siga.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotaResponseDTO {
    private Long id;
    private double valor;
    private String matriculaAluno;
    private Long avaliacaoId;
    private String descricaoAvaliacao;
}

package br.ufc.fcte.siga.dto;

import lombok.Data;

@Data
public class AvaliacaoRequestDTO {
    private String descricao;
    private Long turmaId;
    private int peso;
}
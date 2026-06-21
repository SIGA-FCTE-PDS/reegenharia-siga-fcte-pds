package br.ufc.fcte.siga.dto;

import lombok.Data;

/**
 * DTO de entrada para lançamento de nota (SF-58).
 */
@Data
public class NotaRequestDTO {
    private String matriculaAluno;
    private Long avaliacaoId;
    private double valor;
}

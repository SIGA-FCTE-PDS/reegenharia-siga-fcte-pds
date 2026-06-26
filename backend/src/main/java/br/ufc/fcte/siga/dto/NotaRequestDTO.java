package br.ufc.fcte.siga.dto;

import lombok.Data;

@Data
public class NotaRequestDTO {
    private String matriculaAluno;
    private Long avaliacaoId;
    private double valor;
}

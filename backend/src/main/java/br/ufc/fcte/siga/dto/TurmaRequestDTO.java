package br.ufc.fcte.siga.dto;

import lombok.Data;

/**
 * DTO de entrada para criação de Turma
 */
@Data
public class TurmaRequestDTO {
    private String codigoTurma;
    private String semestreLetivo; // ex: "2026.1"
    private String sala;
    private String horario;
    private int capacidadeMaxima;
    private String modalidade; // "Presencial" ou "EAD"
    private String disciplinaCodigo;
    private Long professorId;
}

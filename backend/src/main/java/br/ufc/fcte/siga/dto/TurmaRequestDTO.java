package br.ufc.fcte.siga.dto;

import lombok.Data;

@Data
public class TurmaRequestDTO {
    private String codigoTurma;
    private String semestreLetivo;
    private String codigoDisciplina;
    private Long idProfessor; // Atenção ao nome: no seu front estava 'professorId' ou 'idProfessor'
    private String sala;
    private String horario;
    private Integer capacidadeMaxima;
    private String modalidade;
}
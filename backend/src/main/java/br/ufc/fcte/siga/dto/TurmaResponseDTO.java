package br.ufc.fcte.siga.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TurmaResponseDTO {
    private Long id;
    private String codigoTurma;
    private String semestreLetivo;
    private String sala;
    private String horario;
    private int capacidadeMaxima;
    private String modalidade;

    // Campos estendidos para facilitar a vida do Front-end
    private String disciplinaCodigo;
    private String disciplinaNome;
    private Long professorId;
    private String professorNome;
    private int vagasOcupadas;
}
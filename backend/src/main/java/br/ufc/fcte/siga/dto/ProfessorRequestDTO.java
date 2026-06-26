package br.ufc.fcte.siga.dto;

import lombok.Data;

/**
 * DTO de entrada para criação/atualização de Professor
 */
@Data

public class ProfessorRequestDTO {
    private String nome;
    private String email;
}

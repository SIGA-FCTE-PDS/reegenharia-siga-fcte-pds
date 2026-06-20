package br.ufc.fcte.siga.dto;

import lombok.Data;

/**
 * DTO de entrada para criação/atualização de Professor.
 * Não inclui 'id' (autogerado) nem 'turmas' (evita loop de serialização).
 */
@Data

public class ProfessorRequestDTO {
    private String nome;
    private String email;
}

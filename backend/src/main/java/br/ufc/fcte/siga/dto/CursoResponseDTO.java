package br.ufc.fcte.siga.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CursoResponseDTO {
    private String codigo;
    private String nome;
}

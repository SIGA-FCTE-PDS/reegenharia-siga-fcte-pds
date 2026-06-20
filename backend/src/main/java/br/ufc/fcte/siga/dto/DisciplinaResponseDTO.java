package br.ufc.fcte.siga.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DisciplinaResponseDTO {
    private String codigo;
    private String nome;
    private int cargaHoraria;
    private String tipo;
    private List<String> preRequisitos;
}

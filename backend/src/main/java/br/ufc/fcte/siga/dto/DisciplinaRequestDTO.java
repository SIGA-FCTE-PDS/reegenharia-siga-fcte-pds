package br.ufc.fcte.siga.dto;

import lombok.Data;
import java.util.List;

@Data

public class DisciplinaRequestDTO {
    private String codigo;
    private String nome;
    private int cargaHoraria;
    private String tipo;
    private List<String> preRequisitos;
}

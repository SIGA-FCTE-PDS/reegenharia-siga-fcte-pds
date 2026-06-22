package br.ufc.fcte.siga.dto;

import lombok.Data;
import java.util.List;

/**
 * DTO de entrada para criação/atualização de Disciplina.
 * 'codigo' vem do usuário (não é autogerado, é o @Id da entidade).
 * 'preRequisitos' é seguro de expor pois é List<String>, não List<Disciplina>.
 */
@Data

public class DisciplinaRequestDTO {
    private String codigo;
    private String nome;
    private int cargaHoraria;
    private String tipo;
    private List<String> preRequisitos;
}

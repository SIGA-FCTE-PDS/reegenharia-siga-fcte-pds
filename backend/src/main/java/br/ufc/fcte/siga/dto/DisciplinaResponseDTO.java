package br.ufc.fcte.siga.dto;

import lombok.Data;
import java.util.List;

@Data
public class DisciplinaResponseDTO {
    private String codigo;
    private String nome;
    private int cargaHoraria;
    private String tipo;

    // 💡 NOVOS CAMPOS: Agora o Spring Boot vai enviar o curso para o React!
    private String codigoCurso;
    private String nomeCurso;

    private List<String> preRequisitos;
}
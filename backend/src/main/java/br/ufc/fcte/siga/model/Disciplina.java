package br.ufc.fcte.siga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "disciplinas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Disciplina {

    @Id
    private String codigo;

    private String nome;

    private int cargaHoraria;

    // Campo obrigatório adicionado para atender ao RF02
    private String tipo;

    @ElementCollection
    @CollectionTable(name = "disciplina_prerequisitos_temp", joinColumns = @JoinColumn(name = "disciplina_codigo"))
    @Column(name = "codigo_prerequisito")
    private List<String> preRequisitos;
}
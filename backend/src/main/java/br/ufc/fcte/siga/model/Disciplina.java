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

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private int cargaHoraria;

    // 💡 Campo para definir se é "OBRIGATORIA" ou "OPTATIVA"
    @Column(nullable = false)
    private String tipo;

    // 💡 Vínculo real Disciplina -> Curso
    @ManyToOne
    @JoinColumn(name = "curso_codigo", nullable = false)
    private Curso curso;

    @ElementCollection
    @CollectionTable(name = "disciplina_prerequisitos_temp", joinColumns = @JoinColumn(name = "disciplina_codigo"))
    @Column(name = "codigo_prerequisito")
    private List<String> preRequisitos;
}
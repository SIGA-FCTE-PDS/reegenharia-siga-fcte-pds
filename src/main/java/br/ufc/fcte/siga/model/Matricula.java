package br.ufc.fcte.siga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "matriculas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Matricula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Controle de estado para a RN08 (Ex: "ATIVA", "TRANCADA_PARCIAL", "CONCLUIDA")
    @Column(name = "status_matricula", nullable = false)
    private String statusMatricula;

    // qual aluno a matrícula pertence (Chave Estrangeira)
    @ManyToOne
    @JoinColumn(name = "aluno_matricula", nullable = false)
    private Aluno aluno;

    // Em qual turma o aluno está inscrito (Chave Estrangeira)
    @ManyToOne
    @JoinColumn(name = "turma_id", nullable = false)
    private Turma turma;
}
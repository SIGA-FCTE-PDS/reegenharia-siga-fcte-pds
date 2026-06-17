package br.ufc.fcte.siga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "frequencias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Frequencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate data; // Data exata da aula

    @Column(nullable = false)
    private boolean presente; // true = Presença, false = Falta

    // Relacionamento N:1 com Turma
    @ManyToOne
    @JoinColumn(name = "turma_id", nullable = false)
    private Turma turma;

    // Relacionamento N:1 com Aluno (Quem estava presente/ausente na aula)
    @ManyToOne
    @JoinColumn(name = "aluno_matricula", nullable = false)
    private Aluno aluno;
}
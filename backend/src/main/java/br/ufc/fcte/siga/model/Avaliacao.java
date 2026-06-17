package br.ufc.fcte.siga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "avaliacoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descricao;

    // Relacionamento N:1 com Turma (Muitas avaliações para uma Turma)
    @ManyToOne
    @JoinColumn(name = "turma_id", nullable = false)
    private Turma turma;
}
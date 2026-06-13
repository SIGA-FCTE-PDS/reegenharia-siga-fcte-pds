package br.ufc.fcte.siga.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificacoes")
@Getter
@Setter
@NoArgsConstructor
public class Notificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relacionamento com o Aluno (Quem recebe a notificação)
    @ManyToOne
    @JoinColumn(name = "aluno_matricula", nullable = false)
    private Aluno aluno;

    // Relacionamento com a Turma (Onde ocorreu o excesso de faltas)
    @ManyToOne
    @JoinColumn(name = "turma_id", nullable = false)
    private Turma turma;

    @Column(nullable = false, length = 255)
    private String mensagem;

    @Column(nullable = false)
    private LocalDateTime dataCriacao;

    public Notificacao(Aluno aluno, Turma turma, String mensagem) {
        this.aluno = aluno;
        this.turma = turma;
        this.mensagem = mensagem;
        this.dataCriacao = LocalDateTime.now();
    }
}
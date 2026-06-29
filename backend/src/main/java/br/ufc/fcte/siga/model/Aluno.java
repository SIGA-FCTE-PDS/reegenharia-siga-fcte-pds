package br.ufc.fcte.siga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "alunos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "tipo_aluno", discriminatorType = DiscriminatorType.STRING)
public class Aluno {

    @Id
    private String matricula;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true, nullable = false)
    private String cpf;

    // 💡 AQUI ESTÁ A MÁGICA: Vínculo real Aluno -> Curso
    @ManyToOne
    @JoinColumn(name = "curso_codigo", nullable = false)
    private Curso curso;

    private String email;
    private LocalDate dataNascimento;
    private String endereco;
    private String telefone;

    private String status;

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL)
    private List<Matricula> matriculas;
}
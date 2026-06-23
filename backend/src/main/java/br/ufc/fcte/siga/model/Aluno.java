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
// Define a coluna que dirá se o aluno é NORMAL ou ESPECIAL
@DiscriminatorColumn(name = "tipo_aluno", discriminatorType = DiscriminatorType.STRING)
public class Aluno {

    @Id
    private String matricula;

    @Column(nullable = false) // Garante o "NN" (Not Null) do diagrama
    private String nome;

    @Column(unique = true, nullable = false) // Garante que o CPF não se repita
    private String cpf;

    private String curso;
    private String email;
    private LocalDate dataNascimento;
    private String endereco;
    private String telefone;

    // Status para controle de trancamento (RN07, RN08, RN11)
    private String status;

    //Relacionamento 1 para N com Matrícula
    // mappedBy = "aluno" indica que a chave estrangeira vai ficar na classe Matricula
    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL)
    private List<Matricula> matriculas;


}
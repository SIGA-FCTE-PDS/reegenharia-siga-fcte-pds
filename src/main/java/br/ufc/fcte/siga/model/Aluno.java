package br.ufc.fcte.siga.model;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity                   // Informa ao postgree que é uma tabela"
@Table(name = "alunos")   // define o nome para a tabela
@Data                     // Cria etters e setters sozinho
@NoArgsConstructor        // Cria o construtor vazio(obrigatório)
@AllArgsConstructor       // Cria o construtor

public class Aluno {
    private String nome;
    @Id
    private String matricula;
    private String curso;
}

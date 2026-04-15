package br.ufc.fcte.siga;

import br.ufc.fcte.siga.dao.AlunoDAO;
import br.ufc.fcte.siga.model.Aluno;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import java.util.List;

@SpringBootApplication
public class SigaFctePdsBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SigaFctePdsBackendApplication.class, args);
    }
    // tudo a baixo é temporario, foi apenas para testar a persistência
    @Bean
    CommandLineRunner teste(AlunoDAO alunoDAO) {
        return args -> {
            Aluno a1 = new Aluno();
            a1.setMatricula("571503");
            a1.setNome("Paulo João - Product Owner");
            a1.setCurso("Engenharia de Software");

            Aluno a2 = new Aluno();
            a2.setMatricula("999888");
            a2.setNome("John Miguel - Scrum Master");
            a2.setCurso("Engenharia de Software");

            Aluno a3 = new Aluno();
            a3.setMatricula("991235");
            a3.setNome("Lucas de Souza - Developer");
            a3.setCurso("Engenharia de Software");

            Aluno a4 = new Aluno();
            a4.setMatricula("999534");
            a4.setNome("Enzo Andrade - Developer");
            a4.setCurso("Engenharia de Software");

            alunoDAO.saveAll(List.of(a1, a2, a3, a4));
            System.out.println("✅ Alunos salvos com sucesso no PostgreSQL!");
        };
    }
}
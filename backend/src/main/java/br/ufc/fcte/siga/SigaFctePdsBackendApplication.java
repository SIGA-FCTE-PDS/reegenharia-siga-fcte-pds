package br.ufc.fcte.siga;

import br.ufc.fcte.siga.dao.AlunoDAO;
import br.ufc.fcte.siga.model.Aluno;
import br.ufc.fcte.siga.model.factory.AlunoFactory;
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

    @Bean
    CommandLineRunner teste(AlunoDAO alunoDAO) {
        return args -> {
            try {
                // Verifica se o banco já tem dados
                if (alunoDAO.count() == 0) {
                    // Usando a Factory e preenchendo os campos obrigatórios
                    Aluno a1 = AlunoFactory.criarAluno("NORMAL", "571503", "Paulo João - Product Owner", "000.000.000-01", "Engenharia de Software", null);
                    Aluno a2 = AlunoFactory.criarAluno("NORMAL", "999888", "John Miguel - Scrum Master", "000.000.000-02", "Engenharia de Software", null);
                    Aluno a3 = AlunoFactory.criarAluno("NORMAL", "991235", "Lucas de Souza - Developer", "000.000.000-03", "Engenharia de Software", null);
                    Aluno a4 = AlunoFactory.criarAluno("NORMAL", "999534", "Enzo Andrade - Developer", "000.000.000-04", "Engenharia de Software", null);

                    alunoDAO.saveAll(List.of(a1, a2, a3, a4));
                    System.out.println("Equipe inicial salva com sucesso usando a Factory e validações do PostgreSQL!");
                }
            } catch (Exception e) {
                // Isso vai imprimir o erro real no console se a carga inicial falhar
                System.err.println("!!! ERRO CRÍTICO NA CARGA INICIAL DE DADOS !!!");
                e.printStackTrace();
            }
        };
    }
}
package br.ufc.fcte.siga.dao;

import br.ufc.fcte.siga.model.Aluno;
import br.ufc.fcte.siga.model.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlunoDAO extends JpaRepository<Aluno, String> {

    // Busca um aluno exato pelo CPF (Retorna Optional para evitar erro se não achar)
    Optional<Aluno> findByCpf(String cpf);

    // Retorna verdadeiro ou falso. Ideal para a Service testar antes de tentar salvar e quebrar o banco
    boolean existsByCpf(String cpf);

    // Busca alunos pelo status (Ex: listar todos os alunos "ATIVOS" ou "TRANCADOS")
    List<Aluno> findByStatus(String status);

    // Conta quantos alunos já existem em um curso específico - usado para gerar
    long countByCurso(Curso curso);
}
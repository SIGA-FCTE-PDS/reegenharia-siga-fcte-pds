package br.ufc.fcte.siga.dao;

import br.ufc.fcte.siga.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfessorDAO extends JpaRepository<Professor, Long> {

    // Necessário para utilizar no front-end, podendo montar uma barra de pesquisa de docentes
    List<Professor> findByNomeContainingIgnoreCase(String nome);

    // Necessário para a service impedir que dois professores sejam cadastrados com o mesmo email
    Optional<Professor> findByEmail(String email);

    // Retorna verdadeiro/falso para travar o cadastro duplicado mais rapidamente
    boolean existsByEmail(String email);
}
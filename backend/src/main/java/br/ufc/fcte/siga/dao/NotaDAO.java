package br.ufc.fcte.siga.dao;

import br.ufc.fcte.siga.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotaDAO extends JpaRepository<Nota, Long> {

    // Pega todas as notas de um aluno dentro de uma turma específica
    List<Nota> findByAlunoMatriculaAndAvaliacaoTurmaId(String matricula, Long turmaId);

}
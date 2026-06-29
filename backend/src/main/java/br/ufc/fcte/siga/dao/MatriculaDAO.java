package br.ufc.fcte.siga.dao;

import br.ufc.fcte.siga.model.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatriculaDAO extends JpaRepository<Matricula, Long> {

    boolean existsByAlunoMatriculaAndTurmaId(String matriculaAluno, Long turmaId);

    long countByTurmaIdAndStatusMatricula(Long turmaId, String statusMatricula);

    List<Matricula> findByAlunoMatricula(String matriculaAluno);

    List<Matricula> findByTurmaIdAndStatusMatricula(Long turmaId, String statusMatricula);
}
package br.ufc.fcte.siga.dao;

import br.ufc.fcte.siga.model.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatriculaDAO extends JpaRepository<Matricula, Long> {

    // A Service utiliza para saber se o aluno já está matriculado na turma, impedindo duplicidade
    boolean existsByAlunoMatriculaAndTurmaId(String matriculaAluno, Long turmaId);

    // A Service utiliza para contar quantas vagas estão ocupadas na turma e travar caso lote, atendendo ao RN01
    long countByTurmaIdAndStatusMatricula(Long turmaId, String statusMatricula);

    // Lista todas as disciplinas que o aluno está cursando no momento
    List<Matricula> findByAlunoMatricula(String matriculaAluno);
}
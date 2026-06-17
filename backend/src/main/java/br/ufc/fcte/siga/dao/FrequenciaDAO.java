package br.ufc.fcte.siga.dao;

import br.ufc.fcte.siga.model.Frequencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FrequenciaDAO extends JpaRepository<Frequencia, Long> {

    // Pega a lista de presenças/faltas de um aluno em uma turma específica
    List<Frequencia> findByAlunoMatriculaAndTurmaId(String matricula, Long turmaId);

}
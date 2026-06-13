package br.ufc.fcte.siga.dao;

import br.ufc.fcte.siga.model.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TurmaDAO extends JpaRepository<Turma, Long> {

    // Lista todas as turmas de uma disciplina específica, por exemplo todas as turmas de fundamentos da programação
    List<Turma> findByDisciplinaCodigo(String codigoDisciplina);

    // Lista todas as turmas que um professor específico vai dar aula no semestre
    List<Turma> findByProfessorId(Long professorId);

    // Lista turmas de um semestre letivo especifico, exemplo: "2026.1"
    List<Turma> findBySemestreLetivo(String semestreLetivo);
}
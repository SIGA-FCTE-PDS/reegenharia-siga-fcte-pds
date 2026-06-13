package br.ufc.fcte.siga.dao;

import br.ufc.fcte.siga.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoDAO extends JpaRepository<Avaliacao, Long> {

    // Lista todas as avaliações que fazem parte de uma turma, é necessário para a tela de lançamento de notas.
    List<Avaliacao> findByTurmaId(Long turmaId);
}
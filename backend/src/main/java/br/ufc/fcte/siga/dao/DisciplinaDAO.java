package br.ufc.fcte.siga.dao;

import br.ufc.fcte.siga.model.Disciplina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisciplinaDAO extends JpaRepository<Disciplina, String> {

    // Busca disciplinas que tenham a palavra digitada na barra de pesquisa
    List<Disciplina> findByNomeContainingIgnoreCase(String nome);

    // É importante para filtros na tela, onde vai listar apenas matérias "obrigatoria" ou apenas "optativa"
    List<Disciplina> findByTipo(String tipo);

    // RN de Código (SF-61): usado pela Service para impedir duplicidade de código de disciplina
    // de forma explícita, sem depender implicitamente de existsById.
    boolean existsByCodigo(String codigo);
}
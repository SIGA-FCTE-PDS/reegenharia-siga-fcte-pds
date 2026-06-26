package br.ufc.fcte.siga.dao;

import br.ufc.fcte.siga.model.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CursoDAO extends JpaRepository<Curso, String> {

    // Impede duplicidade de código antes de persistir (mesmo padrão usado em DisciplinaDAO)
    boolean existsByCodigo(String codigo);
}

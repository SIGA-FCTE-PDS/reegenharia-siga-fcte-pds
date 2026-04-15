package br.ufc.fcte.siga.dao;
import br.ufc.fcte.siga.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface AlunoDAO extends JpaRepository<Aluno, String> {

}

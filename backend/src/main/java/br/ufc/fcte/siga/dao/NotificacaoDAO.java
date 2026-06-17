package br.ufc.fcte.siga.dao;

import br.ufc.fcte.siga.model.Aluno;
import br.ufc.fcte.siga.model.Notificacao;
import br.ufc.fcte.siga.model.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacaoDAO extends JpaRepository<Notificacao, Long> {

    // Método que pode ser usado para listar as notificações na tela do aluno
    List<Notificacao> findByAluno(Aluno aluno);

    // Permite listar todas as notificações geradas em uma turma específica
    List<Notificacao> findByTurma(Turma turma);
}
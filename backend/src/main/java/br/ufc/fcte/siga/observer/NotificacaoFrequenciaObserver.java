package br.ufc.fcte.siga.observer;

import br.ufc.fcte.siga.dao.NotificacaoDAO;
import br.ufc.fcte.siga.model.Aluno;
import br.ufc.fcte.siga.model.Notificacao;
import br.ufc.fcte.siga.model.Turma;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NotificacaoFrequenciaObserver implements FrequenciaObserver {

    private final NotificacaoDAO notificacaoDAO;

    @Autowired
    public NotificacaoFrequenciaObserver(NotificacaoDAO notificacaoDAO) {
        this.notificacaoDAO = notificacaoDAO;
    }

    @Override
    public void aoAtingirLimiteCritico(Aluno aluno, Turma turma, int totalFaltas) {
        String mensagem = String.format(
                "Atenção: você já tem %d faltas na disciplina %s. Mais uma e você será reprovado por falta.",
                totalFaltas,
                turma.getDisciplina().getNome()
        );

        Notificacao notificacao = new Notificacao(aluno, turma, mensagem);
        notificacaoDAO.save(notificacao);
    }

    @Override
    public void aoReprovarPorFalta(Aluno aluno, Turma turma, int totalFaltas) {
        String mensagem = String.format(
                "Você atingiu %d faltas na disciplina %s e está reprovado por falta.",
                totalFaltas,
                turma.getDisciplina().getNome()
        );

        Notificacao notificacao = new Notificacao(aluno, turma, mensagem);
        notificacaoDAO.save(notificacao);
    }
}
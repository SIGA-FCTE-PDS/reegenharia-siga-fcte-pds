package br.ufc.fcte.siga.observer;

import br.ufc.fcte.siga.model.Aluno;
import br.ufc.fcte.siga.model.Turma;

/**
 * Interface Observer do padrão GoF Observer (SF-57).
 * Quem implementa esta interface é notificado sempre que o evento de
 * "excesso de faltas" é disparado pelo Subject (FrequenciaSubject).
 */
public interface FrequenciaObserver {

    void aoExcederLimiteFaltas(Aluno aluno, Turma turma, int totalFaltas);
}

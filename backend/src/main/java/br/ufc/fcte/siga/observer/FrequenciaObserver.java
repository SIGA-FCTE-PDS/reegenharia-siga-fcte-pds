package br.ufc.fcte.siga.observer;

import br.ufc.fcte.siga.model.Aluno;
import br.ufc.fcte.siga.model.Turma;

/**
 * Interface Observer do padrão GoF Observer (SF-57).
 * Quem implementa esta interface é notificado em dois momentos distintos do acompanhamento
 * de frequência do aluno, conforme regra definida com o PO:
 *
 * - aoAtingirLimiteCritico: disparado com 16 faltas (aluno ainda NÃO está reprovado,
 *   mas uma falta a mais já reprova).
 * - aoReprovarPorFalta: disparado com 18 faltas (aluno reprovado).
 */
public interface FrequenciaObserver {

    void aoAtingirLimiteCritico(Aluno aluno, Turma turma, int totalFaltas);

    void aoReprovarPorFalta(Aluno aluno, Turma turma, int totalFaltas);
}

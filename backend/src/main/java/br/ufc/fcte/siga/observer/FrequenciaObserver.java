package br.ufc.fcte.siga.observer;

import br.ufc.fcte.siga.model.Aluno;
import br.ufc.fcte.siga.model.Turma;

public interface FrequenciaObserver {

    void aoAtingirLimiteCritico(Aluno aluno, Turma turma, int totalFaltas);

    void aoReprovarPorFalta(Aluno aluno, Turma turma, int totalFaltas);
}

package br.ufc.fcte.siga.observer;

import br.ufc.fcte.siga.model.Aluno;
import br.ufc.fcte.siga.model.Turma;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;


@Component
public class FrequenciaSubject {

    private final List<FrequenciaObserver> observers = new ArrayList<>();

    public FrequenciaSubject(List<FrequenciaObserver> observersDisponiveis) {
        this.observers.addAll(observersDisponiveis);
    }

    public void adicionarObserver(FrequenciaObserver observer) {
        observers.add(observer);
    }

    public void removerObserver(FrequenciaObserver observer) {
        observers.remove(observer);
    }

    public void notificarLimiteCritico(Aluno aluno, Turma turma, int totalFaltas) {
        for (FrequenciaObserver observer : observers) {
            observer.aoAtingirLimiteCritico(aluno, turma, totalFaltas);
        }
    }

    public void notificarReprovacaoPorFalta(Aluno aluno, Turma turma, int totalFaltas) {
        for (FrequenciaObserver observer : observers) {
            observer.aoReprovarPorFalta(aluno, turma, totalFaltas);
        }
    }
}

package br.ufc.fcte.siga.observer;

import br.ufc.fcte.siga.model.Aluno;
import br.ufc.fcte.siga.model.Turma;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Subject do padrão GoF Observer (SF-57).
 * É registrado como @Component único (singleton) e injeta automaticamente
 * todos os FrequenciaObserver disponíveis no contexto Spring (ver construtor).
 */
@Component
public class FrequenciaSubject {

    private final List<FrequenciaObserver> observers = new ArrayList<>();

    /**
     * O Spring injeta aqui, automaticamente, TODOS os beans que implementam
     * FrequenciaObserver (ex: NotificacaoFrequenciaObserver). Assim, novos
     * observers podem ser adicionados no futuro sem alterar esta classe.
     */
    public FrequenciaSubject(List<FrequenciaObserver> observersDisponiveis) {
        this.observers.addAll(observersDisponiveis);
    }

    public void adicionarObserver(FrequenciaObserver observer) {
        observers.add(observer);
    }

    public void removerObserver(FrequenciaObserver observer) {
        observers.remove(observer);
    }

    /**
     * Notifica todos os observers registrados de que o aluno excedeu o limite de faltas na turma.
     */
    public void notificarExcessoFaltas(Aluno aluno, Turma turma, int totalFaltas) {
        for (FrequenciaObserver observer : observers) {
            observer.aoExcederLimiteFaltas(aluno, turma, totalFaltas);
        }
    }
}

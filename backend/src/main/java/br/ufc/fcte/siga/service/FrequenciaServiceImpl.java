package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dao.AlunoDAO;
import br.ufc.fcte.siga.dao.FrequenciaDAO;
import br.ufc.fcte.siga.dao.TurmaDAO;
import br.ufc.fcte.siga.dto.FrequenciaRequestDTO;
import br.ufc.fcte.siga.dto.FrequenciaResponseDTO;
import br.ufc.fcte.siga.exception.AlunoNaoEncontradoException;
import br.ufc.fcte.siga.exception.TurmaNaoEncontradaException;
import br.ufc.fcte.siga.model.Aluno;
import br.ufc.fcte.siga.model.Frequencia;
import br.ufc.fcte.siga.model.Turma;
import br.ufc.fcte.siga.observer.FrequenciaSubject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FrequenciaServiceImpl implements FrequenciaService {

    // Regra definida com o PO: cada registro de falta (presente=false) vale 2 faltas,
    // e o limite de reprovação é 16 faltas por turma/disciplina.
    private static final int FALTAS_POR_REGISTRO = 2;
    private static final int LIMITE_FALTAS = 16;

    private final FrequenciaDAO frequenciaDAO;
    private final AlunoDAO alunoDAO;
    private final TurmaDAO turmaDAO;
    private final FrequenciaSubject frequenciaSubject;

    @Autowired
    public FrequenciaServiceImpl(FrequenciaDAO frequenciaDAO, AlunoDAO alunoDAO,
                                 TurmaDAO turmaDAO, FrequenciaSubject frequenciaSubject) {
        this.frequenciaDAO = frequenciaDAO;
        this.alunoDAO = alunoDAO;
        this.turmaDAO = turmaDAO;
        this.frequenciaSubject = frequenciaSubject;
    }

    @Override
    @Transactional
    public FrequenciaResponseDTO registrar(FrequenciaRequestDTO dto) {
        Aluno aluno = alunoDAO.findById(dto.getMatriculaAluno())
                .orElseThrow(() -> new AlunoNaoEncontradoException(
                        "Aluno não encontrado com matrícula: " + dto.getMatriculaAluno()));

        Turma turma = turmaDAO.findById(dto.getTurmaId())
                .orElseThrow(() -> new TurmaNaoEncontradaException(
                        "Turma não encontrada com id: " + dto.getTurmaId()));

        // Conta quantos registros de FALTA esse aluno já tinha nesta turma ANTES deste novo registro
        int faltasAntesDoRegistro = contarFaltas(dto.getMatriculaAluno(), dto.getTurmaId());

        Frequencia frequencia = new Frequencia();
        frequencia.setAluno(aluno);
        frequencia.setTurma(turma);
        frequencia.setData(dto.getData());
        frequencia.setPresente(dto.isPresente());

        Frequencia salva = frequenciaDAO.save(frequencia);

        // Só recalcula e dispara o Observer se o registro for uma FALTA
        // (uma presença nunca pode causar excesso de faltas)
        if (!dto.isPresente()) {
            int faltasDepoisDoRegistro = faltasAntesDoRegistro + 1;

            int totalFaltasAntes = faltasAntesDoRegistro * FALTAS_POR_REGISTRO;
            int totalFaltasDepois = faltasDepoisDoRegistro * FALTAS_POR_REGISTRO;

            // Dispara o Observer só na transição (cruzou o limite agora), evitando notificar
            // de novo em toda falta subsequente depois que o aluno já está reprovado
            boolean cruzouOLimiteAgora = totalFaltasAntes < LIMITE_FALTAS && totalFaltasDepois >= LIMITE_FALTAS;

            if (cruzouOLimiteAgora) {
                frequenciaSubject.notificarExcessoFaltas(aluno, turma, totalFaltasDepois);
            }
        }

        return toResponseDTO(salva);
    }

    @Override
    public List<FrequenciaResponseDTO> listarPorAlunoETurma(String matriculaAluno, Long turmaId) {
        return frequenciaDAO.findByAlunoMatriculaAndTurmaId(matriculaAluno, turmaId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    private int contarFaltas(String matriculaAluno, Long turmaId) {
        return (int) frequenciaDAO.findByAlunoMatriculaAndTurmaId(matriculaAluno, turmaId)
                .stream()
                .filter(f -> !f.isPresente())
                .count();
    }

    private FrequenciaResponseDTO toResponseDTO(Frequencia frequencia) {
        return new FrequenciaResponseDTO(
                frequencia.getId(),
                frequencia.getData(),
                frequencia.isPresente(),
                frequencia.getAluno().getMatricula(),
                frequencia.getTurma().getId()
        );
    }
}
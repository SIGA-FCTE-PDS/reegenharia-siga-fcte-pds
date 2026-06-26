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

    private static final int LIMITE_CRITICO_FALTAS = 16;
    private static final int LIMITE_REPROVACAO_FALTAS = 18;

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

        int faltasAntes = somarFaltas(dto.getMatriculaAluno(), dto.getTurmaId());

        Frequencia frequencia = new Frequencia();
        frequencia.setAluno(aluno);
        frequencia.setTurma(turma);
        frequencia.setData(dto.getData());
        frequencia.setPresente(dto.isPresente());
        frequencia.setQuantidadeFaltas(dto.getQuantidadeFaltas());

        Frequencia salva = frequenciaDAO.save(frequencia);

        if (!dto.isPresente()) {
            int faltasDepois = faltasAntes + dto.getQuantidadeFaltas();

            boolean cruzouLimiteCriticoAgora =
                    faltasAntes < LIMITE_CRITICO_FALTAS && faltasDepois >= LIMITE_CRITICO_FALTAS;
            boolean cruzouLimiteReprovacaoAgora =
                    faltasAntes < LIMITE_REPROVACAO_FALTAS && faltasDepois >= LIMITE_REPROVACAO_FALTAS;

            if (cruzouLimiteReprovacaoAgora) {
                frequenciaSubject.notificarReprovacaoPorFalta(aluno, turma, faltasDepois);
            } else if (cruzouLimiteCriticoAgora) {
                frequenciaSubject.notificarLimiteCritico(aluno, turma, faltasDepois);
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

    private int somarFaltas(String matriculaAluno, Long turmaId) {
        return frequenciaDAO.findByAlunoMatriculaAndTurmaId(matriculaAluno, turmaId)
                .stream()
                .filter(f -> !f.isPresente())
                .mapToInt(Frequencia::getQuantidadeFaltas)
                .sum();
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
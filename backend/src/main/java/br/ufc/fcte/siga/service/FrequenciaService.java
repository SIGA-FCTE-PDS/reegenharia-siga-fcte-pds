package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dto.FrequenciaRequestDTO;
import br.ufc.fcte.siga.dto.FrequenciaResponseDTO;

import java.util.List;

public interface FrequenciaService {

    /**
     * Registra a presença/falta de um aluno em uma aula da turma.
     * Se o total de faltas (cada falta vale 2, conforme regra do PO) atingir
     * 16 na turma, dispara o Observer que gera a notificação de reprovação (SF-57).
     */
    FrequenciaResponseDTO registrar(FrequenciaRequestDTO dto);

    List<FrequenciaResponseDTO> listarPorAlunoETurma(String matriculaAluno, Long turmaId);
}
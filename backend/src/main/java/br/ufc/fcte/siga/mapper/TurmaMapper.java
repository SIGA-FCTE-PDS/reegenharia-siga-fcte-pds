package br.ufc.fcte.siga.mapper;

import br.ufc.fcte.siga.dto.TurmaResponseDTO;
import br.ufc.fcte.siga.model.Turma;

public class TurmaMapper {

    private TurmaMapper() {
    }

    /**
     * vagasOcupadas é calculado na Service e injetado aqui
     * porque não é um campo persistido em Turma
     */
    public static TurmaResponseDTO toResponseDTO(Turma turma, int vagasOcupadas) {
        if (turma == null) {
            return null;
        }
        return new TurmaResponseDTO(
                turma.getId(),
                turma.getCodigoTurma(),
                turma.getSemestreLetivo(),
                turma.getSala(),
                turma.getHorario(),
                turma.getCapacidadeMaxima(),
                turma.getModalidade(),
                turma.getDisciplina() != null ? turma.getDisciplina().getCodigo() : null,
                turma.getDisciplina() != null ? turma.getDisciplina().getNome() : null,
                turma.getProfessor() != null ? turma.getProfessor().getId() : null,
                turma.getProfessor() != null ? turma.getProfessor().getNome() : null,
                vagasOcupadas
        );
    }
}

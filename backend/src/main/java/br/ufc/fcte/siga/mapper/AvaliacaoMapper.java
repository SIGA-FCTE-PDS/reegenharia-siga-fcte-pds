package br.ufc.fcte.siga.mapper;

import br.ufc.fcte.siga.dto.AvaliacaoResponseDTO;
import br.ufc.fcte.siga.model.Avaliacao;

public class AvaliacaoMapper {

    private AvaliacaoMapper() {
    }

    public static AvaliacaoResponseDTO toResponseDTO(Avaliacao avaliacao) {
        if (avaliacao == null) {
            return null;
        }
        return new AvaliacaoResponseDTO(
                avaliacao.getId(),
                avaliacao.getDescricao(),
                avaliacao.getTurma().getId(),
                avaliacao.getTurma().getCodigoTurma(),
                avaliacao.getPeso()
        );
    }
}
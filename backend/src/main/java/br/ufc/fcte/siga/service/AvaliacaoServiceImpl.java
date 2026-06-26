package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dao.AvaliacaoDAO;
import br.ufc.fcte.siga.dao.TurmaDAO;
import br.ufc.fcte.siga.dto.AvaliacaoRequestDTO;
import br.ufc.fcte.siga.dto.AvaliacaoResponseDTO;
import br.ufc.fcte.siga.exception.TurmaNaoEncontradaException;
import br.ufc.fcte.siga.mapper.AvaliacaoMapper;
import br.ufc.fcte.siga.model.Avaliacao;
import br.ufc.fcte.siga.model.Turma;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvaliacaoServiceImpl implements AvaliacaoService {

    private final AvaliacaoDAO avaliacaoDAO;
    private final TurmaDAO turmaDAO;

    @Autowired
    public AvaliacaoServiceImpl(AvaliacaoDAO avaliacaoDAO, TurmaDAO turmaDAO) {
        this.avaliacaoDAO = avaliacaoDAO;
        this.turmaDAO = turmaDAO;
    }

    @Override
    public AvaliacaoResponseDTO criar(AvaliacaoRequestDTO dto) {
        Turma turma = turmaDAO.findById(dto.getTurmaId())
                .orElseThrow(() -> new TurmaNaoEncontradaException(
                        "Turma não encontrada com id: " + dto.getTurmaId()));

        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setDescricao(dto.getDescricao());
        avaliacao.setTurma(turma);

        Avaliacao salva = avaliacaoDAO.save(avaliacao);
        return AvaliacaoMapper.toResponseDTO(salva);
    }

    @Override
    public List<AvaliacaoResponseDTO> listarPorTurma(Long turmaId) {
        if (!turmaDAO.existsById(turmaId)) {
            throw new TurmaNaoEncontradaException("Turma não encontrada com id: " + turmaId);
        }
        return avaliacaoDAO.findByTurmaId(turmaId)
                .stream()
                .map(AvaliacaoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}

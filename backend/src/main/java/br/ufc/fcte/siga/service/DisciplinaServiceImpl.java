package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dao.DisciplinaDAO;
import br.ufc.fcte.siga.dto.DisciplinaRequestDTO;
import br.ufc.fcte.siga.dto.DisciplinaResponseDTO;
import br.ufc.fcte.siga.exception.DisciplinaDuplicadaException;
import br.ufc.fcte.siga.exception.DisciplinaNaoEncontradaException;
import br.ufc.fcte.siga.mapper.DisciplinaMapper;
import br.ufc.fcte.siga.model.Disciplina;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DisciplinaServiceImpl implements DisciplinaService {

    private final DisciplinaDAO disciplinaDAO;

    @Autowired
    public DisciplinaServiceImpl(DisciplinaDAO disciplinaDAO) {
        this.disciplinaDAO = disciplinaDAO;
    }

    @Override
    public DisciplinaResponseDTO criar(DisciplinaRequestDTO dto) {
        // RN: codigo é o @Id e vem do usuário (não é autogerado), então precisa
        // validar duplicidade explicitamente antes de salvar
        if (disciplinaDAO.existsById(dto.getCodigo())) {
            throw new DisciplinaDuplicadaException("Já existe uma disciplina cadastrada com este código.");
        }

        Disciplina disciplina = DisciplinaMapper.toEntity(dto);
        Disciplina salva = disciplinaDAO.save(disciplina);
        return DisciplinaMapper.toResponseDTO(salva);
    }

    @Override
    public DisciplinaResponseDTO buscarPorCodigo(String codigo) {
        Disciplina disciplina = disciplinaDAO.findById(codigo)
                .orElseThrow(() -> new DisciplinaNaoEncontradaException("Disciplina não encontrada com código: " + codigo));
        return DisciplinaMapper.toResponseDTO(disciplina);
    }

    @Override
    public List<DisciplinaResponseDTO> listarTodos() {
        return disciplinaDAO.findAll()
                .stream()
                .map(DisciplinaMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DisciplinaResponseDTO atualizar(String codigo, DisciplinaRequestDTO dto) {
        Disciplina disciplina = disciplinaDAO.findById(codigo)
                .orElseThrow(() -> new DisciplinaNaoEncontradaException("Disciplina não encontrada com código: " + codigo));

        DisciplinaMapper.updateEntityFromDTO(disciplina, dto);
        Disciplina atualizada = disciplinaDAO.save(disciplina);
        return DisciplinaMapper.toResponseDTO(atualizada);
    }

    @Override
    public void deletar(String codigo) {
        if (!disciplinaDAO.existsById(codigo)) {
            throw new DisciplinaNaoEncontradaException("Disciplina não encontrada com código: " + codigo);
        }
        disciplinaDAO.deleteById(codigo);
    }
}
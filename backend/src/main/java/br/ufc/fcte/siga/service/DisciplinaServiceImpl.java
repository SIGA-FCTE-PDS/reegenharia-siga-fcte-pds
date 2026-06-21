package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dao.DisciplinaDAO;
import br.ufc.fcte.siga.dto.DisciplinaRequestDTO;
import br.ufc.fcte.siga.dto.DisciplinaResponseDTO;
import br.ufc.fcte.siga.exception.CargaHorariaInvalidaException;
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
        // RN de Carga Horária (SF-61): impede o cadastro de disciplinas com
        // carga horária negativa ou zero, antes de qualquer acesso ao DAO.
        validarCargaHoraria(dto.getCargaHoraria());

        // RN de Código (SF-61): codigo é o @Id e vem do usuário (não é autogerado), então precisa
        // validar duplicidade explicitamente antes de salvar, usando existsByCodigo.
        if (disciplinaDAO.existsByCodigo(dto.getCodigo())) {
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
        // RN de Carga Horária (SF-61): também vale na atualização, antes de tocar no DAO.
        validarCargaHoraria(dto.getCargaHoraria());

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

    /**
     * RN de Carga Horária (SF-61): a carga horária precisa ser um valor positivo (> 0).
     * Disciplinas com carga horária negativa ou zero não fazem sentido no domínio
     * (não existe disciplina sem aula) e gerariam inconsistência nos relatórios.
     */
    private void validarCargaHoraria(int cargaHoraria) {
        if (cargaHoraria <= 0) {
            throw new CargaHorariaInvalidaException("A carga horária da disciplina deve ser maior que zero.");
        }
    }
}
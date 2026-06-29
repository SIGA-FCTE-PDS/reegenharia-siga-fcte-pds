package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dao.DisciplinaDAO;
import br.ufc.fcte.siga.dao.CursoDAO;
import br.ufc.fcte.siga.dto.DisciplinaRequestDTO;
import br.ufc.fcte.siga.dto.DisciplinaResponseDTO;
import br.ufc.fcte.siga.exception.CargaHorariaInvalidaException;
import br.ufc.fcte.siga.exception.DisciplinaDuplicadaException;
import br.ufc.fcte.siga.exception.DisciplinaNaoEncontradaException;
import br.ufc.fcte.siga.mapper.DisciplinaMapper;
import br.ufc.fcte.siga.model.Curso;
import br.ufc.fcte.siga.model.Disciplina;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DisciplinaServiceImpl implements DisciplinaService {

    private final DisciplinaDAO disciplinaDAO;
    private final CursoDAO cursoDAO; // Injetando o DAO de Cursos

    @Autowired
    public DisciplinaServiceImpl(DisciplinaDAO disciplinaDAO, CursoDAO cursoDAO) {
        this.disciplinaDAO = disciplinaDAO;
        this.cursoDAO = cursoDAO;
    }

    @Override
    public DisciplinaResponseDTO criar(DisciplinaRequestDTO dto) {
        validarCargaHoraria(dto.getCargaHoraria());

        if (disciplinaDAO.existsByCodigo(dto.getCodigo())) {
            throw new DisciplinaDuplicadaException("Já existe uma disciplina cadastrada com este código.");
        }

        // 💡 Trava de segurança: impede que o sistema tente buscar um curso nulo e quebre o banco
        if (dto.getCodigoCurso() == null || dto.getCodigoCurso().isBlank()) {
            throw new IllegalArgumentException("O código do curso é obrigatório para cadastrar uma disciplina.");
        }
        if (dto.getTipo() == null || dto.getTipo().isBlank()) {
            throw new IllegalArgumentException("O tipo da disciplina (Obrigatória/Optativa) é obrigatório.");
        }

        // Busca o Curso no banco
        Curso curso = cursoDAO.findById(dto.getCodigoCurso())
                .orElseThrow(() -> new RuntimeException("Curso não encontrado com o código: " + dto.getCodigoCurso()));

        Disciplina disciplina = DisciplinaMapper.toEntity(dto);
        disciplina.setCodigo(dto.getCodigo());

        // Amarração no banco e atribuição do tipo (Obrigatória/Optativa)
        disciplina.setCurso(curso);
        disciplina.setTipo(dto.getTipo());

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

        validarCargaHoraria(dto.getCargaHoraria());

        if (dto.getCodigoCurso() == null || dto.getCodigoCurso().isBlank()) {
            throw new IllegalArgumentException("O código do curso é obrigatório para atualizar uma disciplina.");
        }

        Curso curso = cursoDAO.findById(dto.getCodigoCurso())
                .orElseThrow(() -> new RuntimeException("Curso não encontrado com o código: " + dto.getCodigoCurso()));

        DisciplinaMapper.updateEntityFromDTO(disciplina, dto);
        disciplina.setCodigo(codigo);
        disciplina.setCurso(curso); // Atualiza a amarração do curso
        disciplina.setTipo(dto.getTipo());

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

    private void validarCargaHoraria(int cargaHoraria) {
        if (cargaHoraria <= 0) {
            throw new CargaHorariaInvalidaException(
                    "Carga horária deve ser maior que zero. Valor informado: " + cargaHoraria);
        }
    }
}
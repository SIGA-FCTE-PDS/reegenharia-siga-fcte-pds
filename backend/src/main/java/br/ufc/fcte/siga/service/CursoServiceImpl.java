package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dao.CursoDAO;
import br.ufc.fcte.siga.dto.CursoRequestDTO;
import br.ufc.fcte.siga.dto.CursoResponseDTO;
import br.ufc.fcte.siga.exception.CursoNaoEncontradoException;
import br.ufc.fcte.siga.mapper.CursoMapper;
import br.ufc.fcte.siga.model.Curso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CursoServiceImpl implements CursoService {

    private final CursoDAO cursoDAO;

    @Autowired
    public CursoServiceImpl(CursoDAO cursoDAO) {
        this.cursoDAO = cursoDAO;
    }

    @Override
    public CursoResponseDTO criar(CursoRequestDTO dto) {
        // Lógica que estava faltando para converter e salvar no banco
        Curso curso = CursoMapper.toEntity(dto);
        Curso salvo = cursoDAO.save(curso);
        return CursoMapper.toResponseDTO(salvo);
    }

    @Override
    public CursoResponseDTO buscarPorCodigo(String codigo) {
        Curso curso = cursoDAO.findById(codigo)
                .orElseThrow(() -> new CursoNaoEncontradoException("Curso não encontrado com código: " + codigo));
        return CursoMapper.toResponseDTO(curso);
    }

    @Override
    public List<CursoResponseDTO> listarTodos() {
        return cursoDAO.findAll().stream()
                .map(CursoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deletar(String codigo) {
        if (!cursoDAO.existsById(codigo)) {
            throw new CursoNaoEncontradoException("Curso não encontrado com código: " + codigo);
        }
        cursoDAO.deleteById(codigo);
    }
}
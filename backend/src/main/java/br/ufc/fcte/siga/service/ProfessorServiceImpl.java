package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dao.ProfessorDAO;
import br.ufc.fcte.siga.dto.ProfessorRequestDTO;
import br.ufc.fcte.siga.dto.ProfessorResponseDTO;
import br.ufc.fcte.siga.exception.EmailDuplicadoException;
import br.ufc.fcte.siga.exception.ProfessorNaoEncontradoException;
import br.ufc.fcte.siga.mapper.ProfessorMapper;
import br.ufc.fcte.siga.model.Professor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorServiceImpl implements ProfessorService {

    private final ProfessorDAO professorDAO;

    @Autowired
    public ProfessorServiceImpl(ProfessorDAO professorDAO) {
        this.professorDAO = professorDAO;
    }

    @Override
    public ProfessorResponseDTO criar(ProfessorRequestDTO dto) {
        // RN: email não pode se repetir (já existe existsByEmail pronto no ProfessorDAO)
        if (professorDAO.existsByEmail(dto.getEmail())) {
            throw new EmailDuplicadoException("Já existe um professor cadastrado com este email.");
        }

        Professor professor = ProfessorMapper.toEntity(dto);
        Professor salvo = professorDAO.save(professor);
        return ProfessorMapper.toResponseDTO(salvo);
    }

    @Override
    public ProfessorResponseDTO buscarPorId(Long id) {
        Professor professor = professorDAO.findById(id)
                .orElseThrow(() -> new ProfessorNaoEncontradoException("Professor não encontrado com id: " + id));
        return ProfessorMapper.toResponseDTO(professor);
    }

    @Override
    public List<ProfessorResponseDTO> listarTodos() {
        return professorDAO.findAll()
                .stream()
                .map(ProfessorMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProfessorResponseDTO atualizar(Long id, ProfessorRequestDTO dto) {
        Professor professor = professorDAO.findById(id)
                .orElseThrow(() -> new ProfessorNaoEncontradoException("Professor não encontrado com id: " + id));

        // Só valida duplicidade de email se ele estiver de fato mudando
        if (!professor.getEmail().equalsIgnoreCase(dto.getEmail()) && professorDAO.existsByEmail(dto.getEmail())) {
            throw new EmailDuplicadoException("Já existe um professor cadastrado com este email.");
        }

        ProfessorMapper.updateEntityFromDTO(professor, dto);
        Professor atualizado = professorDAO.save(professor);
        return ProfessorMapper.toResponseDTO(atualizado);
    }

    @Override
    public void deletar(Long id) {
        if (!professorDAO.existsById(id)) {
            throw new ProfessorNaoEncontradoException("Professor não encontrado com id: " + id);
        }
        professorDAO.deleteById(id);
    }
}


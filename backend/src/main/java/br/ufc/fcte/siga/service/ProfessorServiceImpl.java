package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dao.ProfessorDAO;
import br.ufc.fcte.siga.dao.TurmaDAO;
import br.ufc.fcte.siga.dto.ProfessorRequestDTO;
import br.ufc.fcte.siga.dto.ProfessorResponseDTO;
import br.ufc.fcte.siga.exception.EmailDuplicadoException;
import br.ufc.fcte.siga.exception.EmailInvalidoException;
import br.ufc.fcte.siga.exception.ProfessorComTurmaAtivaException;
import br.ufc.fcte.siga.exception.ProfessorNaoEncontradoException;
import br.ufc.fcte.siga.mapper.ProfessorMapper;
import br.ufc.fcte.siga.model.Professor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ProfessorServiceImpl implements ProfessorService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");

    private final ProfessorDAO professorDAO;
    private final TurmaDAO turmaDAO;

    @Autowired
    public ProfessorServiceImpl(ProfessorDAO professorDAO, TurmaDAO turmaDAO) {
        this.professorDAO = professorDAO;
        this.turmaDAO = turmaDAO;
    }

    @Override
    public ProfessorResponseDTO criar(ProfessorRequestDTO dto) {
        validarFormatoEmail(dto.getEmail());

        if (professorDAO.existsByEmail(dto.getEmail())) {
            throw new EmailDuplicadoException("Já existe um professor cadastrado com este email.");
        }

        Professor professor = ProfessorMapper.toEntity(dto);
        Professor professorSalvo = professorDAO.save(professor);
        return ProfessorMapper.toResponseDTO(professorSalvo);
    }

    @Override
    public ProfessorResponseDTO atualizar(Long id, ProfessorRequestDTO dto) {
        Professor professor = professorDAO.findById(id)
                .orElseThrow(() -> new ProfessorNaoEncontradoException("Professor não encontrado com id: " + id));

        validarFormatoEmail(dto.getEmail());

        if (!professor.getEmail().equalsIgnoreCase(dto.getEmail()) && professorDAO.existsByEmail(dto.getEmail())) {
            throw new EmailDuplicadoException("Já existe um professor cadastrado com este email.");
        }

        ProfessorMapper.updateEntityFromDTO(professor, dto);
        Professor professorAtualizado = professorDAO.save(professor);
        return ProfessorMapper.toResponseDTO(professorAtualizado);
    }

    @Override
    public void deletar(Long id) {
        if (!professorDAO.existsById(id)) {
            throw new ProfessorNaoEncontradoException("Professor não encontrado com id: " + id);
        }

        if (!turmaDAO.findByProfessorId(id).isEmpty()) {
            throw new ProfessorComTurmaAtivaException("Professor com turma ativa");
        }

        professorDAO.deleteById(id);
    }

    @Override
    public ProfessorResponseDTO buscarPorId(Long id) {
        Professor professor = professorDAO.findById(id)
                .orElseThrow(() -> new ProfessorNaoEncontradoException("Professor não encontrado com id: " + id));
        return ProfessorMapper.toResponseDTO(professor);
    }

    @Override
    public List<ProfessorResponseDTO> listarTodos() {
        return professorDAO.findAll().stream()
                .map(ProfessorMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
    @Override
    public ProfessorResponseDTO buscarPorEmail(String email) {
        Professor professor = professorDAO.findByEmail(email)
                .orElseThrow(() -> new ProfessorNaoEncontradoException("Professor não encontrado com o email: " + email));
        return ProfessorMapper.toResponseDTO(professor);
    }

    private void validarFormatoEmail(String email) {
        if (email == null || email.isBlank() || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new EmailInvalidoException("Formato de email inválido: " + email);
        }
    }
}
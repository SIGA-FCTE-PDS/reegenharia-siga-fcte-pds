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

    // Regex simples e suficiente para o RF: usuario@dominio.tld
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$");

    private final ProfessorDAO professorDAO;
    private final TurmaDAO turmaDAO;

    @Autowired
    public ProfessorServiceImpl(ProfessorDAO professorDAO, TurmaDAO turmaDAO) {
        this.professorDAO = professorDAO;
        this.turmaDAO = turmaDAO;
    }

    @Override
    public ProfessorResponseDTO criar(ProfessorRequestDTO dto) {
        // RN: formato de e-mail válido, verificado antes de qualquer acesso ao DAO
        validarFormatoEmail(dto.getEmail());

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
        // RN: formato de e-mail válido, verificado antes de qualquer acesso ao DAO
        validarFormatoEmail(dto.getEmail());

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

        // RN de integridade (SF-61): impede registro órfão de Turma. Se o professor
        // estiver vinculado a pelo menos uma turma, a exclusão é bloqueada.
        if (!turmaDAO.findByProfessorId(id).isEmpty()) {
            throw new ProfessorComTurmaAtivaException("Professor com turma ativa");
        }

        professorDAO.deleteById(id);
    }

    /**
     * RN: formato de e-mail (SF-61). Validação simples de formato (usuario@dominio.tld)
     * para impedir cadastro de dados inválidos antes de chegar no DAO.
     */
    private void validarFormatoEmail(String email) {
        if (email == null || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new EmailInvalidoException("O e-mail informado não é válido.");
        }
    }
}


package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dao.AlunoDAO;
import br.ufc.fcte.siga.dto.AlunoRequestDTO;
import br.ufc.fcte.siga.dto.AlunoResponseDTO;
import br.ufc.fcte.siga.exception.AlunoNaoEncontradoException;
import br.ufc.fcte.siga.exception.CpfDuplicadoException;
import br.ufc.fcte.siga.exception.MatriculaDuplicadaException;
import br.ufc.fcte.siga.mapper.AlunoMapper;
import br.ufc.fcte.siga.model.Aluno;
import br.ufc.fcte.siga.model.factory.AlunoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlunoServiceImpl implements AlunoService {

    private final AlunoDAO alunoDAO;

    @Autowired
    public AlunoServiceImpl(AlunoDAO alunoDAO) {
        this.alunoDAO = alunoDAO;
    }

    @Override
    public AlunoResponseDTO criar(AlunoRequestDTO dto) {
        if (alunoDAO.existsByCpf(dto.getCpf())) {
            throw new CpfDuplicadoException("Já existe um aluno cadastrado com este CPF.");
        }

        String matricula = gerarMatricula(dto);

        if (alunoDAO.existsById(matricula)) {
            throw new MatriculaDuplicadaException("Conflito ao gerar matrícula, tente novamente: " + matricula);
        }

        Aluno aluno = AlunoFactory.criarAluno(
                dto.getTipoAluno(),
                matricula,
                dto.getNome(),
                dto.getCpf(),
                dto.getCurso(), // Envia o nome do curso para a Factory
                dto.getInstituicaoOrigem()
        );

        aluno.setEmail(dto.getEmail());
        aluno.setDataNascimento(dto.getDataNascimento());
        aluno.setEndereco(dto.getEndereco());
        aluno.setTelefone(dto.getTelefone());
        aluno.setCurso(dto.getCurso());

        Aluno salvo = alunoDAO.save(aluno);
        return AlunoMapper.toResponseDTO(salvo);
    }

    @Override
    public AlunoResponseDTO buscarPorMatricula(String matricula) {
        Aluno aluno = alunoDAO.findById(matricula)
                .orElseThrow(() -> new AlunoNaoEncontradoException("Aluno não encontrado com matrícula: " + matricula));
        return AlunoMapper.toResponseDTO(aluno);
    }

    @Override
    public List<AlunoResponseDTO> listarTodos() {
        return alunoDAO.findAll()
                .stream()
                .map(AlunoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AlunoResponseDTO atualizar(String matricula, AlunoRequestDTO dto) {
        Aluno aluno = alunoDAO.findById(matricula)
                .orElseThrow(() -> new AlunoNaoEncontradoException("Aluno não encontrado com matrícula: " + matricula));

        AlunoMapper.updateEntityFromDTO(aluno, dto);

        Aluno atualizado = alunoDAO.save(aluno);
        return AlunoMapper.toResponseDTO(atualizado);
    }

    @Override
    public void deletar(String matricula) {
        if (!alunoDAO.existsById(matricula)) {
            throw new AlunoNaoEncontradoException("Aluno não encontrado com matrícula: " + matricula);
        }
        alunoDAO.deleteById(matricula);
    }

    private String gerarMatricula(AlunoRequestDTO dto) {
        LocalDate hoje = LocalDate.now();

        int ano = dto.getAnoIngresso() != null ? dto.getAnoIngresso() : hoje.getYear();

        String semestre = dto.getSemestreIngresso() != null
                ? dto.getSemestreIngresso()
                : String.valueOf(hoje.getMonthValue() <= Month.JUNE.getValue() ? 1 : 2);

        String codigoCurso = dto.getCodigoCurso();
        if (codigoCurso == null || codigoCurso.isBlank()) {
            throw new IllegalArgumentException("O código do curso (codigoCurso) é obrigatório para gerar a matrícula.");
        }
        long quantidadeExistente = alunoDAO.countByCurso(dto.getCurso());
        long proximoSequencial = quantidadeExistente + 1;

        return String.format("%d%s%s%03d", ano, semestre, codigoCurso, proximoSequencial);
    }
}
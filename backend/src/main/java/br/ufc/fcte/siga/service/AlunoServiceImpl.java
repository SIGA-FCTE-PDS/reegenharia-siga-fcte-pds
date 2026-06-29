package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dao.AlunoDAO;
import br.ufc.fcte.siga.dao.CursoDAO;
import br.ufc.fcte.siga.dto.AlunoRequestDTO;
import br.ufc.fcte.siga.dto.AlunoResponseDTO;
import br.ufc.fcte.siga.exception.AlunoNaoEncontradoException;
import br.ufc.fcte.siga.exception.CpfDuplicadoException;
import br.ufc.fcte.siga.exception.MatriculaDuplicadaException;
import br.ufc.fcte.siga.mapper.AlunoMapper;
import br.ufc.fcte.siga.model.Aluno;
import br.ufc.fcte.siga.model.Curso;
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
    private final CursoDAO cursoDAO; // Injetando o DAO de Cursos

    @Autowired
    public AlunoServiceImpl(AlunoDAO alunoDAO, CursoDAO cursoDAO) {
        this.alunoDAO = alunoDAO;
        this.cursoDAO = cursoDAO;
    }

    @Override
    public AlunoResponseDTO criar(AlunoRequestDTO dto) {
        if (alunoDAO.existsByCpf(dto.getCpf())) {
            throw new CpfDuplicadoException("Já existe um aluno cadastrado com este CPF.");
        }

        // Busca o Curso real no banco de dados
        Curso curso = cursoDAO.findById(dto.getCodigoCurso())
                .orElseThrow(() -> new RuntimeException("Curso não encontrado com o código: " + dto.getCodigoCurso()));

        String matricula = gerarMatricula(dto, curso);

        if (alunoDAO.existsById(matricula)) {
            throw new MatriculaDuplicadaException("Conflito ao gerar matrícula, tente novamente: " + matricula);
        }

        // Repassamos a entidade 'curso' de forma íntegra para a Factory
        Aluno aluno = AlunoFactory.criarAluno(
                dto.getTipoAluno(),
                matricula,
                dto.getNome(),
                dto.getCpf(),
                curso,
                dto.getInstituicaoOrigem()
        );

        aluno.setEmail(dto.getEmail());
        aluno.setDataNascimento(dto.getDataNascimento());
        aluno.setEndereco(dto.getEndereco());
        aluno.setTelefone(dto.getTelefone());

        // A Factory já fez a amarração do curso, então basta salvar
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

        Curso curso = cursoDAO.findById(dto.getCodigoCurso())
                .orElseThrow(() -> new RuntimeException("Curso não encontrado com o código: " + dto.getCodigoCurso()));

        AlunoMapper.updateEntityFromDTO(aluno, dto);
        aluno.setCurso(curso); // Atualiza a amarração do curso

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

    private String gerarMatricula(AlunoRequestDTO dto, Curso curso) {
        LocalDate hoje = LocalDate.now();

        int ano = dto.getAnoIngresso() != null ? dto.getAnoIngresso() : hoje.getYear();

        String semestre = dto.getSemestreIngresso() != null
                ? dto.getSemestreIngresso()
                : String.valueOf(hoje.getMonthValue() <= Month.JUNE.getValue() ? 1 : 2);

        String codigoCurso = curso.getCodigo();

        long quantidadeExistente = alunoDAO.countByCurso(curso);
        long proximoSequencial = quantidadeExistente + 1;

        return String.format("%d%s%s%03d", ano, semestre, codigoCurso, proximoSequencial);
    }
}
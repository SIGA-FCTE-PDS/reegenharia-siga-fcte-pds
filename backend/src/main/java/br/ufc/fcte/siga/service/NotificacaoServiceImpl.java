package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dao.AlunoDAO;
import br.ufc.fcte.siga.dao.NotificacaoDAO;
import br.ufc.fcte.siga.dto.NotificacaoResponseDTO;
import br.ufc.fcte.siga.exception.AlunoNaoEncontradoException;
import br.ufc.fcte.siga.model.Notificacao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificacaoServiceImpl implements NotificacaoService {

    private final NotificacaoDAO notificacaoDAO;
    private final AlunoDAO alunoDAO;

    @Autowired
    public NotificacaoServiceImpl(NotificacaoDAO notificacaoDAO, AlunoDAO alunoDAO) {
        this.notificacaoDAO = notificacaoDAO;
        this.alunoDAO = alunoDAO;
    }

    @Override
    public List<NotificacaoResponseDTO> listarPorAluno(String matriculaAluno) {
        // Garante que o aluno existe antes de listar, dando um erro mais claro
        // do que simplesmente retornar uma lista vazia se a matrícula estiver errada
        if (!alunoDAO.existsById(matriculaAluno)) {
            throw new AlunoNaoEncontradoException("Aluno não encontrado com matrícula: " + matriculaAluno);
        }

        return notificacaoDAO.findByAlunoMatricula(matriculaAluno)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    private NotificacaoResponseDTO toResponseDTO(Notificacao notificacao) {
        return new NotificacaoResponseDTO(
                notificacao.getId(),
                notificacao.getMensagem(),
                notificacao.getDataCriacao(),
                notificacao.getAluno().getMatricula(),
                notificacao.getTurma().getId(),
                notificacao.getTurma().getCodigoTurma()
        );
    }
}

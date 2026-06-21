package br.ufc.fcte.siga.exception;

import br.ufc.fcte.siga.dto.ErroResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

/**
 * Handler global de exceptions da API (SF-58).
 * Garante que toda exceção de negócio vira um JSON simples com o status HTTP
 * correto, em vez de um erro 500 genérico com stacktrace.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 404 - recurso não encontrado
    @ExceptionHandler({
            AlunoNaoEncontradoException.class,
            ProfessorNaoEncontradoException.class,
            DisciplinaNaoEncontradaException.class,
            TurmaNaoEncontradaException.class,
            AvaliacaoNaoEncontradaException.class
    })
    public ResponseEntity<ErroResponseDTO> tratarNaoEncontrado(RuntimeException ex) {
        return construirResposta(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 409 - conflito (duplicidade ou turma lotada)
    @ExceptionHandler({
            CpfDuplicadoException.class,
            EmailDuplicadoException.class,
            DisciplinaDuplicadaException.class,
            MatriculaDuplicadaException.class,
            TurmaLotadaException.class
    })
    public ResponseEntity<ErroResponseDTO> tratarConflito(RuntimeException ex) {
        return construirResposta(HttpStatus.CONFLICT, ex.getMessage());
    }

    // 400 - dados de entrada inválidos (ex: codigoCurso ausente na geração de matrícula)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErroResponseDTO> tratarArgumentoInvalido(IllegalArgumentException ex) {
        return construirResposta(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // 500 - qualquer outro erro não previsto, para nunca devolver stacktrace puro ao frontend
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponseDTO> tratarErroGenerico(Exception ex) {
        return construirResposta(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno inesperado. Contate o suporte.");
    }

    private ResponseEntity<ErroResponseDTO> construirResposta(HttpStatus status, String mensagem) {
        ErroResponseDTO erro = new ErroResponseDTO(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                mensagem
        );
        return ResponseEntity.status(status).body(erro);
    }
}

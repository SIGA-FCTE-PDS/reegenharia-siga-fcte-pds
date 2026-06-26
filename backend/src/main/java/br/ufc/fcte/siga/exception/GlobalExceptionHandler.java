package br.ufc.fcte.siga.exception;

import br.ufc.fcte.siga.dto.ErroResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

/**
 * Handler global de exceptions da API.
 *
 * ATUALIZADO (resolução de gaps críticos apontados pelo front-end):
 * - Adicionado CursoNaoEncontradoException e MatriculaNaoEncontradaException ao grupo 404
 * - Adicionado CursoDuplicadoException ao grupo 409
 * - Adicionado CapacidadeInvalidaException ao grupo 400
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 404 - recurso não encontrado
    @ExceptionHandler({
            AlunoNaoEncontradoException.class,
            ProfessorNaoEncontradoException.class,
            DisciplinaNaoEncontradaException.class,
            TurmaNaoEncontradaException.class,
            AvaliacaoNaoEncontradaException.class,
            CursoNaoEncontradoException.class,       // NOVO
            MatriculaNaoEncontradaException.class    // NOVO
    })
    public ResponseEntity<ErroResponseDTO> tratarNaoEncontrado(RuntimeException ex) {
        return construirResposta(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 409 - conflito
    @ExceptionHandler({
            CpfDuplicadoException.class,
            EmailDuplicadoException.class,
            DisciplinaDuplicadaException.class,
            MatriculaDuplicadaException.class,
            TurmaLotadaException.class,
            ProfessorComTurmaAtivaException.class,
            CursoDuplicadoException.class            // NOVO
    })
    public ResponseEntity<ErroResponseDTO> tratarConflito(RuntimeException ex) {
        return construirResposta(HttpStatus.CONFLICT, ex.getMessage());
    }

    // 400 - dados de entrada inválidos
    @ExceptionHandler({
            IllegalArgumentException.class,
            EmailInvalidoException.class,
            CargaHorariaInvalidaException.class,
            CapacidadeInvalidaException.class        // NOVO
    })
    public ResponseEntity<ErroResponseDTO> tratarArgumentoInvalido(RuntimeException ex) {
        return construirResposta(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // 500 - erro interno (MODIFICADO PARA DEBUG)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponseDTO> tratarErroGenerico(Exception ex) {
        ex.printStackTrace();
        return construirResposta(HttpStatus.INTERNAL_SERVER_ERROR, "ERRO REAL: " + ex.toString());
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

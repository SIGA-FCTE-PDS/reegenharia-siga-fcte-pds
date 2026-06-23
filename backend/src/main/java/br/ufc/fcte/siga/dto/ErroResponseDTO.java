package br.ufc.fcte.siga.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * Formato padrão de erro retornado pela API (SF-58).
 * Garante que toda exceção vira um JSON simples e previsível para o frontend,
 * em vez de um erro 500 com stacktrace.
 */
@Data
@AllArgsConstructor
public class ErroResponseDTO {
    private LocalDateTime timestamp;
    private int status;
    private String erro;
    private String mensagem;
}

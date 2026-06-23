package br.ufc.fcte.siga.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO de saída para Notificacao (SF-58).
 * Não expõe os objetos Aluno/Turma completos, só os identificadores e nomes
 * necessários para o frontend exibir a notificação.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificacaoResponseDTO {
    private Long id;
    private String mensagem;
    private LocalDateTime dataCriacao;
    private String matriculaAluno;
    private Long turmaId;
    private String codigoTurma;
}

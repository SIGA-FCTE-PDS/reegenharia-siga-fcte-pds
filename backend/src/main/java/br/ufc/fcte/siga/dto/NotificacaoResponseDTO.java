package br.ufc.fcte.siga.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

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

package br.ufc.fcte.siga.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
public class ErroResponseDTO {
    private LocalDateTime timestamp;
    private int status;
    private String erro;
    private String mensagem;
}

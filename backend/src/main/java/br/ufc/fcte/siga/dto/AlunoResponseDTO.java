package br.ufc.fcte.siga.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

/**
 * DTO de saída para Aluno.
 * Não inclui a lista de Matriculas para evitar loop infinito de serialização
 * (Aluno -> Matricula -> Aluno -> ...), conforme alertado pelo PO.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor

public class AlunoResponseDTO {
    private String matricula;
    private String tipoAluno; // "NORMAL" ou "ESPECIAL"
    private String nome;
    private String cpf;
    private String curso;
    private String email;
    private LocalDate dataNascimento;
    private String endereco;
    private String telefone;
    private String status;

    // null quando tipoAluno = "NORMAL"
    private String instituicaoOrigem;
}

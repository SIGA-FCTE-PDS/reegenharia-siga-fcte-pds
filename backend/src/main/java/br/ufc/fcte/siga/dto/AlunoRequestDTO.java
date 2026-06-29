package br.ufc.fcte.siga.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AlunoRequestDTO {
    private String tipoAluno;

    private String nome;
    private String cpf;
    private String email;
    private LocalDate dataNascimento;
    private String endereco;
    private String telefone;

    private String instituicaoOrigem;

    // 💡 O código do curso (Ex: "CC", "ES", "EP") que será usado para vincular no banco
    private String codigoCurso;

    private String semestreIngresso;
    private Integer anoIngresso;
}
package br.ufc.fcte.siga.dto;

import lombok.Data;
import java.time.LocalDate;

/**
 * DTO de entrada para criação/atualização de Aluno.
 * Não inclui 'matricula' (gerada pelo Service, conforme definido com o PO)
 * nem relacionamentos (evita loop de serialização Aluno -> Matricula -> Aluno...).
 */
@Data

public class AlunoRequestDTO {
    // "NORMAL" ou "ESPECIAL" - define qual subclasse a AlunoFactory deve instanciar
    private String tipoAluno;

    private String nome;
    private String cpf;
    private String curso;
    private String email;
    private LocalDate dataNascimento;
    private String endereco;
    private String telefone;

    // Usado apenas quando tipoAluno = "ESPECIAL"
    private String instituicaoOrigem;

    // Código numérico do curso, usado para gerar a matrícula (ex: "03")
    private String codigoCurso;

    // Semestre de ingresso, ex: "1" ou "2". Se não vier, o Service assume o semestre atual.
    private String semestreIngresso;

    // Ano de ingresso, ex: 2026. Se não vier, o Service assume o ano atual.
    private Integer anoIngresso;
}

package br.ufc.fcte.siga.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "alunos_especiais")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("ESPECIAL") // O valor que vai ser salvo na coluna 'tipo_aluno' da tabela pai
public class AlunoEspecial extends Aluno {

    @Column(name = "instituicao_origem", nullable = false)
    private String instituicaoOrigem;

}
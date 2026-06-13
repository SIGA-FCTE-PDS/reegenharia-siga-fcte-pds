package br.ufc.fcte.siga.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("NORMAL") // O valor que será salvo na coluna 'tipo_aluno' da tabela pai
public class AlunoNormal extends Aluno {

}
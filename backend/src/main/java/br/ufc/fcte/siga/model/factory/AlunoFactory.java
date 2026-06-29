package br.ufc.fcte.siga.model.factory;

import br.ufc.fcte.siga.model.Aluno;
import br.ufc.fcte.siga.model.AlunoEspecial;
import br.ufc.fcte.siga.model.AlunoNormal;
import br.ufc.fcte.siga.model.Curso;

public class AlunoFactory {

    /**
     * Método centralizado para criar instâncias de Aluno.
     */
    public static Aluno criarAluno(String tipo, String matricula, String nome, String cpf, Curso curso, String instituicaoOrigem) {

        if (tipo == null || tipo.trim().isEmpty()) {
            throw new IllegalArgumentException("O tipo de aluno deve ser informado (NORMAL ou ESPECIAL).");
        }

        if (tipo.equalsIgnoreCase("NORMAL")) {
            AlunoNormal alunoNormal = new AlunoNormal();
            alunoNormal.setMatricula(matricula);
            alunoNormal.setNome(nome);
            alunoNormal.setCpf(cpf);
            alunoNormal.setCurso(curso);
            alunoNormal.setStatus("ATIVO");
            return alunoNormal;

        } else if (tipo.equalsIgnoreCase("ESPECIAL")) {
            // Validação de segurança para garantir a integridade do modelo
            if (instituicaoOrigem == null || instituicaoOrigem.trim().isEmpty()) {
                throw new IllegalArgumentException("Erro: Um Aluno Especial requer obrigatoriamente a instituição de origem.");
            }

            AlunoEspecial alunoEspecial = new AlunoEspecial();
            alunoEspecial.setMatricula(matricula);
            alunoEspecial.setNome(nome);
            alunoEspecial.setCpf(cpf);
            alunoEspecial.setCurso(curso);
            alunoEspecial.setInstituicaoOrigem(instituicaoOrigem);
            alunoEspecial.setStatus("ATIVO"); // RN07
            return alunoEspecial;

        } else {
            throw new IllegalArgumentException("Tipo de aluno inválido no sistema: " + tipo);
        }
    }
}
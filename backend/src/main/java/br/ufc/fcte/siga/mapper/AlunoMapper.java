package br.ufc.fcte.siga.mapper;

import br.ufc.fcte.siga.dto.AlunoResponseDTO;
import br.ufc.fcte.siga.model.Aluno;
import br.ufc.fcte.siga.model.AlunoEspecial;

public class AlunoMapper {
    private AlunoMapper() {
        // classe utilitária, não deve ser instanciada
    }

    /**
     * Converte a entidade Aluno ou s subclasse para o DTO de resposta
     * Não toca na lista de matriculas, evitando o loop de serialização
     */
    public static AlunoResponseDTO toResponseDTO(Aluno aluno) {
        if (aluno == null) {
            return null;
        }

        AlunoResponseDTO dto = new AlunoResponseDTO();
        dto.setMatricula(aluno.getMatricula());
        dto.setNome(aluno.getNome());
        dto.setCpf(aluno.getCpf());
        dto.setCurso(aluno.getCurso());
        dto.setEmail(aluno.getEmail());
        dto.setDataNascimento(aluno.getDataNascimento());
        dto.setEndereco(aluno.getEndereco());
        dto.setTelefone(aluno.getTelefone());
        dto.setStatus(aluno.getStatus());

        if (aluno instanceof AlunoEspecial alunoEspecial) {
            dto.setTipoAluno("ESPECIAL");
            dto.setInstituicaoOrigem(alunoEspecial.getInstituicaoOrigem());
        } else {
            dto.setTipoAluno("NORMAL");
            dto.setInstituicaoOrigem(null);
        }

        return dto;
    }

    /**
     * Atualiza os campos de uma entidade JÁ EXISTENTE (não recria, mantém a matricula original).
     * Não altera tipoAluno - trocar de NORMAL para ESPECIAL (ou vice-versa) não é suportado
     * por update simples, pois são tabelas diferentes (JOINED inheritance).
     */
    public static void updateEntityFromDTO(Aluno aluno, br.ufc.fcte.siga.dto.AlunoRequestDTO dto) {
        aluno.setNome(dto.getNome());
        aluno.setCurso(dto.getCurso());
        aluno.setEmail(dto.getEmail());
        aluno.setDataNascimento(dto.getDataNascimento());
        aluno.setEndereco(dto.getEndereco());
        aluno.setTelefone(dto.getTelefone());

        if (aluno instanceof AlunoEspecial alunoEspecial && dto.getInstituicaoOrigem() != null) {
            alunoEspecial.setInstituicaoOrigem(dto.getInstituicaoOrigem());
        }
    }
}

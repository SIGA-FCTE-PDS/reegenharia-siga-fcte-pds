package br.ufc.fcte.siga.service;

import br.ufc.fcte.siga.dto.NotificacaoResponseDTO;

import java.util.List;

public interface NotificacaoService {

    List<NotificacaoResponseDTO> listarPorAluno(String matriculaAluno);
}

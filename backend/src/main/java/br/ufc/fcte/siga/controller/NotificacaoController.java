package br.ufc.fcte.siga.controller;

import br.ufc.fcte.siga.dto.NotificacaoResponseDTO;
import br.ufc.fcte.siga.service.NotificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificacoes")
@CrossOrigin(origins = "*")
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    @Autowired
    public NotificacaoController(NotificacaoService notificacaoService) {
        this.notificacaoService = notificacaoService;
    }

    @GetMapping("/aluno/{matriculaAluno}")
    public ResponseEntity<List<NotificacaoResponseDTO>> listarPorAluno(@PathVariable String matriculaAluno) {
        return ResponseEntity.ok(notificacaoService.listarPorAluno(matriculaAluno));
    }
}

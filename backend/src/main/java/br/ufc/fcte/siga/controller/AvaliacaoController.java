package br.ufc.fcte.siga.controller;

import br.ufc.fcte.siga.dto.AvaliacaoRequestDTO;
import br.ufc.fcte.siga.dto.AvaliacaoResponseDTO;
import br.ufc.fcte.siga.service.AvaliacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes")
@CrossOrigin(origins = "*")
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    @Autowired
    public AvaliacaoController(AvaliacaoService avaliacaoService) {
        this.avaliacaoService = avaliacaoService;
    }

    @PostMapping
    public ResponseEntity<AvaliacaoResponseDTO> criar(@RequestBody AvaliacaoRequestDTO dto) {
        AvaliacaoResponseDTO criada = avaliacaoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    @GetMapping("/turma/{turmaId}")
    public ResponseEntity<List<AvaliacaoResponseDTO>> listarPorTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(avaliacaoService.listarPorTurma(turmaId));
    }
}
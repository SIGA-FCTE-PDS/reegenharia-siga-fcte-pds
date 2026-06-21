package br.ufc.fcte.siga.controller;

import br.ufc.fcte.siga.dto.NotaRequestDTO;
import br.ufc.fcte.siga.dto.NotaResponseDTO;
import br.ufc.fcte.siga.service.BoletimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boletim")
@CrossOrigin(origins = "*")
public class BoletimController {

    private final BoletimService boletimService;

    @Autowired
    public BoletimController(BoletimService boletimService) {
        this.boletimService = boletimService;
    }

    @PostMapping("/notas")
    public ResponseEntity<NotaResponseDTO> lancarNota(@RequestBody NotaRequestDTO dto) {
        NotaResponseDTO lancada = boletimService.lancarNota(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(lancada);
    }

    @GetMapping("/notas")
    public ResponseEntity<List<NotaResponseDTO>> listarNotasPorAlunoETurma(
            @RequestParam String matriculaAluno,
            @RequestParam Long turmaId) {
        return ResponseEntity.ok(boletimService.listarNotasPorAlunoETurma(matriculaAluno, turmaId));
    }
}

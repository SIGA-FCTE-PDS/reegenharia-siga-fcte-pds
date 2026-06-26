package br.ufc.fcte.siga.controller;

import br.ufc.fcte.siga.dto.CursoRequestDTO;
import br.ufc.fcte.siga.dto.CursoResponseDTO;
import br.ufc.fcte.siga.service.CursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cursos")
@CrossOrigin(origins = "*")
public class CursoController {

    private final CursoService cursoService;

    @Autowired
    public CursoController(CursoService cursoService) {
        this.cursoService = cursoService;
    }

    @PostMapping
    public ResponseEntity<CursoResponseDTO> criar(@RequestBody CursoRequestDTO dto) {
        CursoResponseDTO criado = cursoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping
    public ResponseEntity<List<CursoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(cursoService.listarTodos());
    }
}
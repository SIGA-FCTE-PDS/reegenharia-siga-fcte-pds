package br.ufc.fcte.siga.controller;

import br.ufc.fcte.siga.dto.DisciplinaRequestDTO;
import br.ufc.fcte.siga.dto.DisciplinaResponseDTO;
import br.ufc.fcte.siga.service.DisciplinaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disciplinas")
@CrossOrigin(origins = "*")
public class DisciplinaController {

    private final DisciplinaService disciplinaService;

    @Autowired
    public DisciplinaController(DisciplinaService disciplinaService) {
        this.disciplinaService = disciplinaService;
    }

    @PostMapping
    public ResponseEntity<DisciplinaResponseDTO> criar(@RequestBody DisciplinaRequestDTO dto) {
        DisciplinaResponseDTO criada = disciplinaService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<DisciplinaResponseDTO> buscarPorCodigo(@PathVariable String codigo) {
        return ResponseEntity.ok(disciplinaService.buscarPorCodigo(codigo));
    }

    @GetMapping
    public ResponseEntity<List<DisciplinaResponseDTO>> listarTodos() {
        return ResponseEntity.ok(disciplinaService.listarTodos());
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<DisciplinaResponseDTO> atualizar(@PathVariable String codigo,
                                                           @RequestBody DisciplinaRequestDTO dto) {
        return ResponseEntity.ok(disciplinaService.atualizar(codigo, dto));
    }

    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> deletar(@PathVariable String codigo) {
        disciplinaService.deletar(codigo);
        return ResponseEntity.noContent().build();
    }
}

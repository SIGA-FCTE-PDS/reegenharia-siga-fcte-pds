package br.ufc.fcte.siga.controller;

import br.ufc.fcte.siga.dto.AlunoRequestDTO;
import br.ufc.fcte.siga.dto.AlunoResponseDTO;
import br.ufc.fcte.siga.service.AlunoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")
@CrossOrigin(origins = "*")
public class AlunoController {

    private final AlunoService alunoService;

    @Autowired
    public AlunoController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @PostMapping
    public ResponseEntity<AlunoResponseDTO> criar(@RequestBody AlunoRequestDTO dto) {
        AlunoResponseDTO criado = alunoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping("/{matricula}")
    public ResponseEntity<AlunoResponseDTO> buscarPorMatricula(@PathVariable String matricula) {
        return ResponseEntity.ok(alunoService.buscarPorMatricula(matricula));
    }

    @GetMapping
    public ResponseEntity<List<AlunoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(alunoService.listarTodos());
    }

    @PutMapping("/{matricula}")
    public ResponseEntity<AlunoResponseDTO> atualizar(@PathVariable String matricula,
                                                      @RequestBody AlunoRequestDTO dto) {
        return ResponseEntity.ok(alunoService.atualizar(matricula, dto));
    }

    @DeleteMapping("/{matricula}")
    public ResponseEntity<Void> deletar(@PathVariable String matricula) {
        alunoService.deletar(matricula);
        return ResponseEntity.noContent().build();
    }
}

package br.ufc.fcte.siga.controller;

import br.ufc.fcte.siga.dto.MatriculaRequestDTO;
import br.ufc.fcte.siga.dto.MatriculaResponseDTO;
import br.ufc.fcte.siga.service.MatriculaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matriculas")
@CrossOrigin(origins = "*")
public class MatriculaController {

    private final MatriculaService matriculaService;

    @Autowired
    public MatriculaController(MatriculaService matriculaService) {
        this.matriculaService = matriculaService;
    }

    @PostMapping
    public ResponseEntity<MatriculaResponseDTO> matricular(@RequestBody MatriculaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(matriculaService.matricularAluno(dto));
    }

    @GetMapping("/turma/{turmaId}")
    public ResponseEntity<List<MatriculaResponseDTO>> listarAlunosDaTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(matriculaService.listarAlunosDaTurma(turmaId));
    }

    @GetMapping("/aluno/{matriculaAluno}")
    public ResponseEntity<List<MatriculaResponseDTO>> listarTurmasDoAluno(@PathVariable String matriculaAluno) {
        return ResponseEntity.ok(matriculaService.listarTurmasDoAluno(matriculaAluno));
    }
}
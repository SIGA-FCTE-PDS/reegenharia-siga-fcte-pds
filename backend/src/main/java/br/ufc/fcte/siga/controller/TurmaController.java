package br.ufc.fcte.siga.controller;

import br.ufc.fcte.siga.dto.MatriculaRequestDTO;
import br.ufc.fcte.siga.dto.MatriculaResponseDTO;
import br.ufc.fcte.siga.service.TurmaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turmas")
@CrossOrigin(origins = "*")
public class TurmaController {

    private final TurmaService turmaService;

    @Autowired
    public TurmaController(TurmaService turmaService) {
        this.turmaService = turmaService;
    }

    @PostMapping("/matriculas")
    public ResponseEntity<MatriculaResponseDTO> matricularAluno(@RequestBody MatriculaRequestDTO dto) {
        MatriculaResponseDTO matricula = turmaService.matricularAluno(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(matricula);
    }

    @GetMapping("/{turmaId}/matriculas")
    public ResponseEntity<List<MatriculaResponseDTO>> listarMatriculasPorTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(turmaService.listarMatriculasPorTurma(turmaId));
    }
}

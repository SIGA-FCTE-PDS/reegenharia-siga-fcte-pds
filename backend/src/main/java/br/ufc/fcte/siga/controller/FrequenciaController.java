package br.ufc.fcte.siga.controller;

import br.ufc.fcte.siga.dto.FrequenciaRequestDTO;
import br.ufc.fcte.siga.dto.FrequenciaResponseDTO;
import br.ufc.fcte.siga.service.FrequenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/frequencias")
@CrossOrigin(origins = "*")
public class FrequenciaController {

    private final FrequenciaService frequenciaService;

    @Autowired
    public FrequenciaController(FrequenciaService frequenciaService) {
        this.frequenciaService = frequenciaService;
    }

    @PostMapping
    public ResponseEntity<FrequenciaResponseDTO> registrar(@RequestBody FrequenciaRequestDTO dto) {
        FrequenciaResponseDTO registrada = frequenciaService.registrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(registrada);
    }

    @GetMapping
    public ResponseEntity<List<FrequenciaResponseDTO>> listarPorAlunoETurma(
            @RequestParam String matriculaAluno,
            @RequestParam Long turmaId) {
        return ResponseEntity.ok(frequenciaService.listarPorAlunoETurma(matriculaAluno, turmaId));
    }
}

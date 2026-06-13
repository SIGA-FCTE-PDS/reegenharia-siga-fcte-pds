package br.ufc.fcte.siga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Table(name = "turmas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Chave primária numérica

    @Column(name = "codigo_turma", nullable = false)
    private String codigoTurma;

    @Column(name = "semestre_letivo", nullable = false)
    private String semestreLetivo;

    private String sala;
    private String horario;

    @Column(name = "capacidade_maxima", nullable = false)
    private int capacidadeMaxima;

    private String modalidade; // Se é por exemplo "Presencial", "EAD"...

    // Relacionamento com a Disciplina (qual matéria essa turma pertence)
    @ManyToOne
    @JoinColumn(name = "disciplina_codigo", nullable = false)
    private Disciplina disciplina;

    // Relacionamento com o Professor (qual professor vai dar a aula)
    @ManyToOne
    @JoinColumn(name = "professor_id", nullable = false)
    private Professor professor;

    // Relacionamento com as Matrículas (Quais alunos estão na turma)
    @OneToMany(mappedBy = "turma", cascade = CascadeType.ALL)
    private List<Matricula> matriculas;

    // Relacionamento com as Avaliações (Quais provas essa turma vai ter)
    @OneToMany(mappedBy = "turma", cascade = CascadeType.ALL)
    private List<Avaliacao> avaliacoes;

    // Relacionamento com Frequências (Aulas registradas na turma)
    @OneToMany(mappedBy = "turma", cascade = CascadeType.ALL)
    private List<Frequencia> frequencias;
}
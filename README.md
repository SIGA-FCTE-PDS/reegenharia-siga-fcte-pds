Sistema Acadêmico - FCTE
Descrição do Projeto

Este projeto teve início como um desafio acadêmico na disciplina de PDS (Projeto Detalhado de Software) na UFC-Campus-Russas. A ideia principal não se baseia em criar algo do zero, mas sim pegar um sistema "legado" (desenvolvido originalmente pelo Pedro Arthur da UnB) e elevar o nível técnico dele através de uma reengenharia completa.
Equipe (Scrum - UFC Russas)

    Product Owner (PO): Paulo João
    Scrum Master (SM): John Miguel
    Developers: Enzo Andrade, Paulo João, John Miguel e Lucas de Souza

1. Objetivos de Reengenharia (Backlog)

Estes são os objetivos definidos para a evolução do sistema:

    Integridade e Armazenamento: Migração de arquivos '.txt' para Banco de Dados Relacional.
    Nova Arquitetura: Implementação dos padrões MVC e DAO para isolar as regras de negócio.
    Segurança de Dados: Tratamento de entradas para evitar ataques de SQL Injection.

2. Instruções para Compilação e Execução
```
    Compilação:

    javac -d bin src/*/*.java src/Main.java

    Execução:

    java -cp bin Main
```
--- 

Estrutura de Pastas:
```
siga-fcte-pds-backend/
├── src/
│   ├── main/
│   │   ├── java/br/ufc/fcte/siga/
│   │   │   ├── controller/               # Endpoints da API (Lucas)
│   │   │   │   ├── AlunoController.java
│   │   │   │   ├── AvaliacaoController.java
│   │   │   │   ├── DisciplinaController.java
│   │   │   │   └── TurmaController.java
│   │   │   ├── dao/                      # Interfaces JPA Repository (Paulo)
│   │   │   │   ├── AlunoDAO.java
│   │   │   │   ├── DisciplinaDAO.java
│   │   │   │   ├── FrequenciaDAO.java
│   │   │   │   ├── MatriculaDAO.java
│   │   │   │   ├── NotaDAO.java
│   │   │   │   └── TurmaDAO.java
│   │   │   ├── exception/                # Tratamento de Erros e Exceções
│   │   │   │   ├── AlunoNaoEncontradoException.java
│   │   │   │   ├── DatabaseException.java
│   │   │   │   ├── MatriculaDuplicadaException.java
│   │   │   │   ├── TurmaLotadaException.java
│   │   │   │   └── TurmaNaoEncontradaException.java
│   │   │   ├── infra/                    # Configurações de Infraestrutura
│   │   │   │   └── Database.java
│   │   │   ├── model/                    # Entidades e Mapeamento JPA (Paulo)
│   │   │   │   ├── factory/              # Padrão Factory (Criação)
│   │   │   │   │   └── AlunoFactory.java
│   │   │   │   ├── Aluno.java            # Abstract @Entity
│   │   │   │   ├── AlunoEspecial.java    # Subclasse @Entity
│   │   │   │   ├── AlunoNormal.java      # Subclasse @Entity
│   │   │   │   ├── Disciplina.java       # @Entity
│   │   │   │   ├── Frequencia.java       # @Entity
│   │   │   │   ├── Matricula.java        # @Entity
│   │   │   │   ├── Nota.java             # @Entity
│   │   │   │   ├── Professor.java        # @Entity
│   │   │   │   └── Turma.java            # @Entity
│   │   │   ├── service/                  # Regras de Negócio (John/Enzo)
│   │   │   │   ├── relatorio/            # Lógica de Relatórios
│   │   │   │   │   ├── RelatorioPorDisciplina.java
│   │   │   │   │   ├── RelatorioPorProfessor.java
│   │   │   │   │   ├── RelatorioPorTurma.java
│   │   │   │   │   └── RelatorioService.java
│   │   │   │   ├── AlunoService.java
│   │   │   │   ├── AvaliacaoService.java
│   │   │   │   ├── DisciplinaService.java
│   │   │   │   └── TurmaService.java
│   │   │   ├── view/                     # Interface de Usuário (Console)
│   │   │   │   ├── MenuAluno.java
│   │   │   │   ├── MenuAvaliacao.java
│   │   │   │   ├── MenuDisciplina.java
│   │   │   │   └── MenuPrincipal.java
│   │   │   └── SigaFctePdsBackendApplication.java
│   │   └── resources/
│   │       ├── application.properties    # Configuração do PostgreSQL
│   │       ├── static/
│   │       └── templates/
├── pom.xml                               # Dependências Maven (Spring Boot, JPA, Lombok)
└── .gitignore                            # Exclusões de arquivos temporários e binários
   
```

3. **Versão do JAVA utilizada:**  
   23.0.1

---

## Principais Funcionalidades Implementadas

- [x] Cadastro, listagem, matrícula e trancamento de alunos (Normais e Especiais)
- [x] Cadastro de disciplinas e criação de turmas (presenciais e remotas)
- [x] Matrícula de alunos em turmas, respeitando vagas e pré-requisitos
- [x] Lançamento de notas e controle de presença
- [x] Cálculo de média final e verificação de aprovação/reprovação
- [x] Relatórios de desempenho acadêmico por aluno, turma e disciplina
- [x] Persistência de dados em arquivos (.txt ou .csv)
- [x] Tratamento de duplicidade de matrículas
- [x] Uso de herança, polimorfismo e encapsulamento

---

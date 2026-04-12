# Sistema Acadêmico - FCTE

## Descrição do Projeto

Este projeto teve início como um desafio acadêmico na disciplina de PDS (Projeto Detalhado de Software) na UFC-Campus-Russas. A ideia principal não se baseia em criar algo do zero, mas sim pegar um sistema "legado" (desenvolvido originalmente pelo Pedro Arthur da UnB) e elevar o nível técnico dele através de uma reengenharia completa.

## Equipe (Scrum - UFC Russas)
**Product Owner (PO):** Paulo João 
**Scrum Master (SM):** John Miguel 
**Developers:** Enzo Andrade, Paulo João , John Miguel e Lucas de Souza 

## Objetivos de Reengenharia (Backlog)
Estes são os objetivos definidos para a evolução do sistema:
**Persistência Profissional:** Migração de arquivos '.txt' para Banco de Dados Relacional.
**Nova Arquitetura:** Implementação dos padrões MVC e DAO para isolar as regras de negócio.
**Segurança de Dados:** Tratamento de entradas para evitar ataques de SQL Injection.

---

## Instruções para Compilação e Execução

1. **Compilação:**  
   ```bash
   javac -d bin src/*/*.java src/Main.java

2. **Execução:**
   ```bash
   java -cp bin Main

3.  **Estrutura de Pastas:**  
      SIGA-FCTE/<br>
   ├── src/ <br>
   │   ├── aluno/          # Classes de Aluno (Normal/Especial)<br>
   │   ├── disciplina/     # Disciplinas e Turmas<br>
   │   ├── avaliacao/      # Notas, Frequência e Relatórios<br>
   │   ├── menus/          # Interfaces de usuário<br>
   │   ├── persistencia/   # Armazenamento em arquivos<br>
   │   └── Main.java       # Ponto de entrada<br>
   ├── bin/                # Arquivos compilados<br>
   ├── dados/              # Arquivos .txt gerados<br>
      ├── alunos.txt<br>
      ├── disciplinas.txt<br>
      └── turmas.txt<br>
   

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

## Contato


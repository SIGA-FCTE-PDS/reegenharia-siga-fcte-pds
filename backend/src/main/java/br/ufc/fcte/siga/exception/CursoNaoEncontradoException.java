package br.ufc.fcte.siga.exception;

public class CursoNaoEncontradoException extends RuntimeException {
    public CursoNaoEncontradoException(String message) {
        super(message);
    }
}
package br.ufc.fcte.siga.exception;

public class MatriculaNaoEncontradaException extends RuntimeException {
    public MatriculaNaoEncontradaException(String message) {
        super(message);
    }
}
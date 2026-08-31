# Contribuição

## Desenvolvimento

O projeto utiliza HTML, CSS e JavaScript sem dependências externas obrigatórias.

Para executar localmente:

    python3 -m http.server 8080

Acesse:

    http://127.0.0.1:8080

## Antes de enviar alterações

1. valide a sintaxe do JavaScript;
2. teste em desktop e smartphone;
3. teste as seringas de 30, 50 e 100 UI;
4. valide entradas em mg, mcg e UI;
5. confirme suporte a ponto e vírgula decimal;
6. não inclua backups, credenciais ou arquivos locais.

Validação:

    node --check app.js

## Padrão de commits

Exemplos:

    feat: melhora escala visual da seringa
    fix: corrige conversão de mcg para UI
    docs: atualiza documentação
    style: ajusta interface mobile

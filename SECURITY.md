# Segurança

## Escopo

A Calculadora de Doses de Peptídeos executa os cálculos diretamente no navegador.

Não existe:

- autenticação;
- banco de dados;
- API própria;
- armazenamento de dados no servidor;
- envio do histórico para backend.

O histórico é armazenado somente em `localStorage`.

## Dados sensíveis

Nenhuma credencial, token, chave privada ou arquivo `.env` deve ser versionado.

Backups da VPS e configurações privadas também não devem ser enviados ao repositório.

## Resultados da calculadora

Os resultados são matemáticos e informativos.

A aplicação não fornece prescrição, indicação clínica ou orientação individual de tratamento.

O preparo e a administração de qualquer substância devem ser confirmados com profissional habilitado.

## Relato de vulnerabilidade

Falhas de segurança devem ser comunicadas de forma privada ao mantenedor antes de divulgação pública.

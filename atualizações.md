# Changelog

Todas as alteracoes notaveis deste projeto serao documentadas neste arquivo.

O formato segue o padrao [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto segue versionamento semantico.

## [1.1.0] - 2026-06-21

### Adicionado

- Sistema de checagem de vencimento com alerta visual para assinaturas vencidas.
- Indicacao visual para assinaturas proximas do vencimento em ate 7 dias.
- Coluna de status na tabela com estados `Vencido`, `Proximo` e `Em dia`.
- Botao de acao rapida para renovar uma assinatura para o proximo periodo cadastrado.
- Acao de cancelamento rapido da assinatura diretamente na tabela.
- Botao no cabecalho para exibir ou ocultar um grafico de barras.
- Grafico comparando custo mensal e anual de cada assinatura cadastrada.
- Atualizacao dinamica do grafico sempre que assinaturas sao adicionadas, editadas, renovadas ou canceladas.

### modificado

- Versao do projeto atualizada para `1.1.0`.
- Botao de exclusao na interface renomeado para `Cancelar`, alinhando a acao ao uso do produto.
- mudar o grafico de linha para grafico de barra.

## [1.0.0] - 2026-06-21

### Adicionado

- Microservico de gerenciamento de assinaturas em Node.js com TypeScript.
- Arquitetura backend organizada em MVC.
- Banco de dados SQLite nativo com `node:sqlite` e arquivo local `assinaturas.db`.
- Model `SubscriptionModel` com prepared statements para evitar SQL Injection.
- Controller `SubscriptionController` com validacao de entradas.
- Endpoints REST para criar, listar, resumir, atualizar e excluir assinaturas.
- Calculo automatico de `my_share` quando a assinatura nao e compartilhada.
- Resumo financeiro com total mensal, total anual, quantidade de assinaturas e proximo vencimento.
- Camada de seguranca com `helmet` e `express-rate-limit`.
- Frontend responsivo em HTML5, JavaScript puro e Bootstrap via CDN.
- Dashboard com cards financeiros.
- Formulario de cadastro e edicao de assinaturas com `autocomplete="off"`.
- Tabela responsiva para visualizacao das assinaturas cadastradas.
- Alertas dinamicos de sucesso e erro usando componentes Bootstrap.
- Scripts `dev`, `build` e `start` para desenvolvimento, compilacao e execucao.

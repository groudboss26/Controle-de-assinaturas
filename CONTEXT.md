# Especificação Técnica: Microserviço de Gerenciamento de Assinaturas 

Este documento serve como guia e especificação para a construção de um microserviço focado no monitoramento e gerenciamento de assinaturas. O objetivo é criar uma aplicação completa com Backend em **TypeScript (MVC)** utilizando o banco de dados **SQLite nativo** do Node.js, incorporando **boas práticas de segurança**, e uma interface Frontend responsiva em **HTML5/JavaScript** com **Bootstrap**.

---

## 🚀 Diretrizes Gerais e Tecnologias

1. **Backend:** Node.js (versão 22+) escrito em **TypeScript**. Utilizar Express.js e tipagens adequadas em ambiente de desenvolvimento.
2. **Padrão de Arquitetura:** **MVC (Model-View-Controller)** estrito no backend.
3. **Banco de Dados:** Módulo nativo `node:sqlite` através da classe `DatabaseSync`.
4. **Frontend:** **HTML5** puro e **JavaScript** (Vanilla JS) usando a API `fetch`.
5. **Estilização e Responsividade:** **Bootstrap CSS** (via CDN), layout mobile-first.

---

##  Camada de Segurança (Boas Práticas)

O Backend deve implementar as seguintes proteções básicas para garantir a integridade do serviço:
1. **Prevenção contra SQL Injection:** O uso de Prepared Statements (placeholders `?`) é obrigatório em todas as consultas feitas no Model. Proibido fazer concatenação de strings em queries.
2. **Proteção de Cabeçalhos (Helmet):** Instalar e utilizar o middleware `helmet` no Express para ocultar informações do servidor e mitigar vulnerabilidades web comuns.
3. **Limitador de Taxa (Rate Limit):** Instalar e configurar o `express-rate-limit` para evitar ataques de força bruta ou negação de serviço (DoS), limitando o número de requisições por IP (ex: máx. 100 requisições a cada 15 min).
4. **Validação de Entrada:** Os Controllers devem validar rigorosamente os payloads recebidos (bloquear strings vazias, garantir que o preço seja um número flutuante positivo e validar o formato de data `YYYY-MM-DD`).

---

## 🎨 Paleta de Cores e Identidade Visual

A interface deve seguir estritamente as seguintes cores:
* **Fundo e Textos Principais:** Base em **Preto** e **Branco** (alto contraste).
* **Elementos de Destaque:** Detalhes importantes e botões de ação principal em **Verde**.
* **Alertas e Status:** **Verde** (sucesso), **Amarelo** (atenção), **Vermelho** (erro/exclusão).

---

## 💾 Camada do Model e Banco de Dados (SQLite)

O banco local gerará o arquivo `assinaturas.db`. O Model gerenciará a tabela `subscriptions`:
* `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
* `name` (TEXT NOT NULL)
* `price` (REAL NOT NULL)
* `due_date` (TEXT NOT NULL)
* `period` (TEXT NOT NULL)
* `shared` (INTEGER DEFAULT 0)
* `my_share` (REAL NOT NULL)

---

## 🛣️ Rotas e Endpoints (Mapeados para os Controllers)

* `POST /subscriptions` -> `SubscriptionController.create` (Calcula `my_share` se não for compartilhado).
* `GET /subscriptions` -> `SubscriptionController.getAll`
* `GET /subscriptions/summary` -> `SubscriptionController.getSummary`
* `PUT /subscriptions/:id` -> `SubscriptionController.update`
* `DELETE /subscriptions/:id` -> `SubscriptionController.delete`

---

## 🖥️ Requisitos da Interface Frontend (HTML5 / View)

1. **Dashboard Inicial:** Cards superiores exibindo o resumo financeiro.
2. **Formulário de Cadastro:** Interface responsiva para inclusão dos dados.
3. **Tabela/Lista de Assinaturas:** Exibição organizada usando `table-responsive`.
4. **Tratamento de Alertas:** Uso de componentes `.alert` do Bootstrap exibidos dinamicamente via JavaScript para sinalizar sucesso (verde) ou falhas na API (vermelho).

---
*Gere o código completo, aplicando as dependências de segurança citadas e separando estritamente as camadas do projeto.*
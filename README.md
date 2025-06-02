# Arkos Market

>**Atenção** Este projeto está **em fase inicial** e **ainda está sendo desenvolvido**. A página principal ainda não está finalizada, e algumas funcionalidades podem não estar implementadas ou funcionando corretamente.

Este é um projeto de uma **Loja Online** construída com **Node.js** no backend e **React** no frontend. O objetivo é criar uma plataforma de e-commerce completa, com funcionalidades básicas e avançadas. Algumas funcionalidades já estão implementadas e em funcionamento.

## Clonar o Repositório
Para clonar esse repositório em sua maquina local, siga os passos abaixo:
 1. Abra o terminar no seu computador
 2. Navegue ate o diretório que deeja salvar o projeto.
 3. Execure o seguinte comando para cloanr o repositório:
 ```bash
    git clone https://github.com/Edu-213/Loja-Online.git
 ```
 4. Após clonar, entre na pasta do projeto:
 ```bash
    cd loja-online
 ```

## Funcionalidades Já Implementadas

- **Sistema de Login/Cadastro**: Os usuários podem se cadastrar, fazer login e manter sua sessão. O frontend já está funcionando com integração ao backend.
- **Login com o Google**: Autenticação através do Google, permitindo que os usuários façam login de forma rápida e prática.
- **Product Card**: Exibição dos produtos em cards, com detalhes como imagem, nome e preço.
- **Carrinho de Compras**:
  - **Adicionar produtos ao carrinho**:Os usuários podem adicionar produtos ao carrinho de compras ao clicar no botão de adicionar.
  - **Ajustar a quantidade**: É possível aumentar ou diminuir a quantidade de cada produto diretamente no carrinho.
  - **Remover produtos**: Os usuários podem remover itens do carrinho com facilidade.
  - **Carrinho Offline**: O carrinho funciona de maneira offline, permitindo que os usuários adicionem produtos ao carrinho sem precisar estar logados.
  - **Sincronização ao Login**: Quando o usuário faz login, o carrinho offline é sincronizado automaticamente com o backend, mantendo os itens no carrinho mesmo após o login.
  - **Limitação de Quantidade de Produtos**: O limite de quantidade de cada produto no carrinho é definido pelo administrador ao adicionar o produto no sistema, permitindo flexibilidade na gestão de estoque.
- **Busca de Produtos**: Os usuários podem buscar produtos diretamente pelo nome ou filtrar por departamento, categoria ou subcategoria.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React, Tailwind CSS
- **Autenticação**: JWT (JSON Web Token), Bcrypt, e login com o **Google OAuth**.
- **Outros**: Nodemon, FontAwesome para ícones, e Abordagem de PWA (Progressive Web App) para sincronização offline.

## Status Atual

O projeto está em andamento e já possui as funcionalidades principais de uma loja online funcionando. A interface do frontend ainda precisa de melhorias.

## Próximas Etapas

- **Frontend**: Criar o frontend de todas as páginas utilizando **React** e garantir que o design seja responsivo com **Tailwind CSS** para proporcionar uma experiência fluida em todos os dispositivos.
- **Cupons**: Implementar a funcionalidade para criar cupons de desconto e permitir que os usuários os utilizem no carrinho de compras. O sistema permitirá a criação de cupons com diferentes tipos de desconto (percentual ou valor fixo) e regras de validade (data de expiração, uso único, etc.).
- **Favoritos**: Permitir que os usuários adicionem e removam produtos da lista de favoritos. A funcionalidade incluirá:
  - **Armazenamento de Favoritos**: Os favoritos serão armazenados no banco de dados e estarão acessíveis para o usuário quando ele fizer login.
  - **Acesso Rápido**: Os usuários poderão acessar rapidamente seus produtos favoritos em uma página dedicada.
  - **Persistência**: Caso o usuário esteja logado, a lista de favoritos será sincronizada entre dispositivos.
- **Minha Conta**: Criar uma página onde o usuário pode acessar suas informações pessoais.
- **Sistema de Recuperar senha**: Permitir que os usuários recuperem o acesso à sua conta caso se esqueçam da senha
- **Sistema de Notificações**: Adicionar notificações por email ou no próprio site para alertar os usuários sobre o status de seus pedidos.
- **Sistema de Avaliação de Produtos**:Adicionar um sistema onde os usuários podem avaliar produtos que compraram, incluindo uma pontuação por estrelas e um campo de comentários.
- **Filtros Avançados de Busca**:Melhorar a busca de produtos com filtros adicionais como preço, avaliação, disponibilidade e outros critérios.
- **Sistema de Pagamento**: Integrar com sistemas de pagamento como Stripe, PayPal, ou Mercado Pago para permitir a finalização de compras no site.
- **Painel Admin**:Criar uma área de administração para gerenciar produtos, pedidos, usuários, e visualizar relatórios sobre as vendas.

## Como Executar o Projeto

### Pré-requisitos

- **Node.js**: instale o [Node.js](https://nodejs.org/) (recomento a versão LTS).
- **MongoDB**

### Configurações

1. **Configuração do Backend(Servidor)**:
  - Navegue até a pasta `server/`
  - Instale as dependências executando `npm install`
  - Crie um arquivo `.env` com as variáveis necessárias. Um exemplo de `.env-example` está disponível na raiz do projeto.
  - Configure seu banco de dados e outras variáveis de ambiente conforme necessário.

2. **Configuração do Frontend**:
  - Navegue até a pasta `client/`.
  - Instale as dependências executando `npm install`

### Rodando o Projeto

1. **Backend**:
  - Na pasta `server/`, execute o servidor com o seguinte comando:
  ```bash
    npm run dev
  ```
  - Isso rodará o servidor com o Nodemon para recarregar automaticamente as alterações no código.

2. **Frontend**:
  - Na pasta `client/`, execute o React com o seguinte comando:
  ```bash
    npm start
  ```
  - O site será acessível no `http://localhost:3000`.

## Estrutura de Pastas

Aqui esta a estrutura atual do projeto:

```bash
/loja-online
    ├── /client                              # Frontend (React)
    │   ├── /public                          # Arquivos públicos
    │   ├── /src                             # Código-fonte do frontend
    │   ├── app.js                           # Arquivo principal para rodar o frontend
    │   └── package.json                     # Dependências do frontend
    ├── /server                              # Backend (Node.js)
    │   ├── /config
    │   ├── /middlewaare                     # Middlewares de autenticação e validação
    │   ├── /models                          # Modelos do banco de dados
    │   ├── /routes                          # Rotas da API
    │   ├── /uploads                         # Imagens dos produtos 
    │   ├── server.js                        # Arquivo principal para rodar o servidor
    │   ├── package.json                     # Dependências do backend
    │   └── .env                             # Variáveis de ambiente do backend
    ├── .gitignore                           # Arquivos e pastas ignoradas pelo Git
    ├── .env-example                         # Exemplo de arquivo .env
    └── README.md                            # Este arquivo
```

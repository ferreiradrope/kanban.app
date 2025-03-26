# Projeto Kanban

## Tecnologias Utilizadas

Este projeto foi construído com:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Como executar o projeto

🌍 Acesse Online

O projeto está disponível no seguinte link:

🔗 https://kanban-app-beta.vercel.app/

### Pré-requisitos para executar localmente

Para executar este projeto, você precisa ter o Node.js e npm instalados - [instale com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Passos para execução com Node.js

```sh
# 1. Clone o repositório
git clone <URL_DO_REPOSITÓRIO>

# 2. Navegue até o diretório do projeto
cd <NOME_DO_PROJETO>

# 3. Instale as dependências necessárias
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:8080`

### Passos para execução com o Docker

Para executar este projeto, você precisa ter o Docker instalado - https://www.docker.com/

```sh
# 1. Inicie usando o comando abaixo
docker run -p 8080:3000 pedrohferreira98/kanban.app:latest
```

O projeto estará disponível em http://localhost:8080

## Funcionalidades

- Quadro Kanban com três colunas: "A Fazer", "Em Progresso" e "Concluído"
- Arrastar e soltar tarefas entre colunas
- Adicionar, editar e excluir tarefas
- Tema claro/escuro
- Interface totalmente em português brasileiro
- Armazenamento local de tarefas (localStorage)

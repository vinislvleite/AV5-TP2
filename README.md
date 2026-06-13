# Atlantis — Sistema Web (AV5-TP2)

---

## Contextualização do Projeto

Os produtos digitais dominaram o modo de consumo através da praticidade e acessibilidade das aplicações web. Para atender à demanda de novos contratos firmados pela equipe de marketing e vendas a partir do protótipo navegável, este projeto consolida o **Sistema Atlantis** completo, unindo a nova Interface Web ao Backend com Banco de Dados.

A aplicação foi migrada de sua arquitetura antiga para uma aplicação web robusta, integrando todas as regras de negócio pré-existentes a um banco de dados estruturado, garantindo que o sistema esteja pronto para produção e uso real pelos clientes.

---

## Stack Tecnológica Utilizada

O desenvolvimento do ecossistema foi construído utilizando as seguintes tecnologias e ferramentas de mercado:

**Backend:**
* **Ambiente de Execução:** [Node.js](https://nodejs.org/) (v24+)
* **Linguagem de Programação:** [TypeScript](https://www.typescriptlang.org/)
* **Framework Web:** [Express](https://expressjs.com/)
* **Mapeamento Objeto-Relacional (ORM):** [Prisma](https://www.prisma.io/) (v6.19.3)
* **Banco de Dados Relacional (SGBD):** [MySQL](https://www.mysql.com/)

**Geral:**
* **IDE Sugerida:** [VSCode IDE](https://code.visualstudio.com/)

---

## Arquitetura do Repositório

O projeto está dividido em duas frentes principais de desenvolvimento:

```text
AV5-TP2/
├── backend/             # API RESTful, Banco de Dados e Regras de Negócio
│   ├── migrations/      # Histórico de scripts SQL gerados pelo Prisma
│   ├── src/             # Código-fonte principal da API
│   ├── .env             # Variáveis de ambiente (MySQL)
│   ├── prisma.config.ts # Configuração do Prisma Client
│   ├── schema.prisma    # Modelagem das tabelas
│   └── seed.ts          # Script para povoamento de dados de teste
│
└── frontend/            # Interface de Usuário (Aplicação Web)
    ├── src/             # Telas e componentes da interface
    ├── package.json     # Dependências do frontend
    └── ...
```

---

## Configuração e Instalação

Para rodar o projeto localmente, você precisará configurar o Backend e o Frontend em **terminais separados**.

### Parte 1: Configurando o Backend e Banco de Dados

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo **`.env`** na raiz da pasta `backend` e configure suas credenciais do MySQL:
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/atlantis"
```
> *(Substitua `usuario` e `senha` com os dados do seu ambiente local).*

4. **Sincronização e População Automática:**
Execute o comando abaixo para criar o banco de dados local, estruturar as tabelas e inserir os dados iniciais automaticamente:
```bash
npm run prisma:migrate
```

5. Inicie o servidor da API:
```bash
npm run dev
```

---

### Parte 2: Configurando o Frontend (Aplicação Web)

Com o backend já rodando, abra um **novo terminal** para iniciar a interface de usuário.

1. Navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências da interface:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento web:
```bash
npm run dev
```

Tudo pronto! A aplicação web do sistema Atlantis agora estará acessível no seu navegador, conectada diretamente ao banco de dados estruturado.

### Easter Egg: erick santos champions

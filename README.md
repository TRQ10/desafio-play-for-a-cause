# Desafio Play For a Cause ChatAPP


![Logo do Projeto](https://gitlab.com/trq10/desafio-play-for-a-cause/-/raw/main/Header.jpg)
---

Link para o site: https://play-for-a-cause-gmjz6uzyo-trq10.vercel.app/
aviso: site não está completo, ainda falta implementação de alguma features.

---

## Visão Geral:

Este aplicativo de chat em tempo real representa um projeto desafiador e enriquecedor, desenvolvido por mim com a integração de tecnologias como NestJS, Next.js, Socket.IO, Prisma ORM e PostgreSQL. Ao longo dessa jornada, enfrentei vários desafios, solidificando meu entendimento dessas tecnologias e aprimorando minhas habilidades.

---

## Como Iniciar o Projeto:

### Frontend (Next.js)

1. Navegue até a pasta `client`:
    ```bash
    cd client
    ```

2. **Configuração de Variáveis de Ambiente:**
    - Crie um arquivo chamado `.env.local` na raiz da pasta `client`.
    - Adicione as seguintes variáveis de ambiente:
        ```plaintext
        NEXT_PUBLIC_SERVER_URI=http://localhost:3001
        NEXTAUTH_SECRET=sua_chave_secreta_para_NextAuth
        ```
    - Estas variáveis são cruciais para a integração adequada com o servidor Next.js e para a segurança do NextAuth.

3. Instale as dependências:
    ```bash
    npm install
    ```

4. Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

5. Acesse o aplicativo em [http://localhost:3000](http://localhost:3000).

### Backend (NestJS)

1. Navegue até a pasta `server`:
    ```bash
    cd server
    ```

2. **Configuração de Variáveis de Ambiente:**
    - Crie um arquivo chamado `.env` na raiz da pasta `server`.
    - Adicione as seguintes variáveis de ambiente:
        ```plaintext
        CORS_ORIGIN=http://localhost:3000
        JWT_REFRESH_SECRET=sua_chave_secreta_para_refresh_token
        JWT_SECRET=sua_chave_secreta_para_token_jwt
        DATABASE_URL=sua_url_do_banco_de_dados_postgresql
        ```
    - Essas variáveis são essenciais para a segurança, autenticação JWT e configuração do banco de dados.

3. Instale as dependências:
    ```bash
    npm install
    ```

4. Inicie o servidor:
    ```bash
    npm run start
    ```

5. O servidor estará em execução em [http://localhost:3001](http://localhost:3001).

---

## Principais Recursos:

- **Comunicação em Tempo Real:** Utilizei o Socket.IO para possibilitar mensagens em tempo real entre os usuários, proporcionando conversas dinâmicas e interativas.

- **Integração com Banco de Dados:** O Prisma ORM, aliado ao PostgreSQL, atua como uma base de dados robusta, garantindo armazenamento eficiente, recuperação e gerenciamento de dados, incluindo informações de usuário e mensagens.

- **Design Responsivo:** Embora o projeto alcance sua funcionalidade principal, reconheço a necessidade de melhorias adicionais, especialmente na otimização do desempenho do WebSocket para uma maior responsividade e interatividade.

---

## Experiência de Aprendizado:

Embarcar nessa jornada foi uma experiência de aprendizado profunda. A integração complexa de várias tecnologias, a gestão da comunicação em tempo real e a estruturação de um banco de dados escalável contribuíram significativamente para o meu crescimento como desenvolvedor.

---

## Desafios Enfrentados:

Este projeto apresentou desafios significativos, desde a busca por uma funcionalidade fluida do WebSocket até a implementação de melhorias na UI. Enfrentar esses obstáculos foi uma experiência desafiadora, mas, com persistência, consegui superar cada dificuldade.

---

## Melhorias Futuras:

Reconheço a necessidade de melhorias contínuas e tenho planos para futuras implementações, incluindo aprimoramento das rotas WebSocket, introdução do Redis como cache para diminuir a carga de consultas no banco de dados e melhorias na UI.

---

## Agradecimentos:

Expresso minha gratidão pela oportunidade de trabalhar neste projeto, aplicando conhecimentos teóricos em cenários do mundo real. A jornada foi desafiadora e enriquecedora, e espero ansiosamente por refinamentos e contribuições contínuas.

---

## Contribuições São Bem-Vindas:

Este projeto está aberto a contribuições e sugestões. Qualquer assistência ou insights para aprimorar a funcionalidade, responsividade ou recursos são calorosamente bem-vindos. Juntos, podemos continuar a desenvolver um aplicativo de chat em tempo real robusto e amigável.

---

*Expresso minha apreciação pela oportunidade de realizar este projeto, especialmente considerando a complexidade de acumular tantas tecnologias diferentes em um único projeto.*

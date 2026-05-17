# Gerenciador de Check-in de Leitura - Backend

Backend Node.js/Express para o sistema de gerenciamento de grupos de leitura colaborativa.

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Crie um arquivo `.env` na raiz do backend com as seguintes variáveis:
```
DB_URI=mongodb+srv://user:password@cluster.mongodb.net/checkindeleitura
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRATION=5184000
PORT=5000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

## Execução

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

Para produção:
```bash
npm start
```

## Endpoints da API

### Autenticação
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login
- `GET /auth/profile` - Obter perfil do usuário (requer autenticação)
- `PUT /auth/profile` - Atualizar perfil (requer autenticação)
- `PUT /auth/password` - Atualizar senha (requer autenticação)
- `DELETE /auth/account` - Deletar conta (requer autenticação)

### Grupos
- `POST /groups` - Criar novo grupo
- `GET /groups` - Listar meus grupos
- `GET /groups/:groupId` - Obter detalhes do grupo
- `PUT /groups/:groupId` - Atualizar grupo
- `POST /groups/invite` - Convidar usuário para grupo
- `POST /groups/invitation/respond` - Responder convite
- `POST /groups/member/remove` - Remover membro
- `POST /groups/member/ban` - Banir membro
- `POST /groups/member/promote-admin` - Promover a admin
- `POST /groups/member/promote-creator` - Promover a criador

### Projetos
- `POST /projects` - Criar novo projeto
- `GET /projects/group/:groupId` - Listar projetos do grupo
- `GET /projects/:projectId` - Obter detalhes do projeto
- `PUT /projects/:projectId` - Atualizar projeto
- `POST /projects/:projectId/pause` - Pausar projeto
- `POST /projects/:projectId/reopen` - Reabrir projeto
- `DELETE /projects/:projectId` - Deletar projeto
- `POST /projects/invitation/respond` - Responder convite do projeto
- `POST /projects/participant/remove` - Remover participante
- `POST /projects/participant/ban` - Banir participante

### Check-ins
- `POST /checkins` - Criar novo check-in
- `GET /checkins/project/:projectId` - Listar check-ins do projeto
- `GET /checkins/project/:projectId/user` - Listar meus check-ins
- `GET /checkins/:checkInId` - Obter detalhes do check-in
- `PUT /checkins/:checkInId` - Atualizar check-in
- `DELETE /checkins/:checkInId` - Deletar check-in
- `GET /checkins/project/:projectId/progress` - Obter progresso do projeto

## Estrutura do Projeto

```
backend/
├── models/          # Modelos Mongoose
├── controllers/     # Controladores de lógica
├── routes/          # Definição de rotas
├── middleware/      # Middlewares (autenticação, etc)
├── utils/           # Utilitários
├── app.js           # Arquivo principal
├── package.json     # Dependências
└── .env.example     # Exemplo de variáveis de ambiente
```

## Autenticação

A autenticação é feita via JWT (JSON Web Token). O token é gerado no login e deve ser enviado no header `Authorization: Bearer {token}` para acessar endpoints protegidos.

O token expira em 2 meses (5184000 segundos) por padrão.

## Banco de Dados

O projeto utiliza MongoDB Cloud. Configure a variável `DB_URI` com sua string de conexão do MongoDB Atlas.

## Hierarquia de Permissões em Grupos

1. **Criador** - Pode fazer tudo, incluindo promover outros a criador
2. **Criador Promovido** - Pode fazer quase tudo, exceto promover a criador
3. **Admin** - Pode gerenciar membros e projetos
4. **Membro** - Acesso básico

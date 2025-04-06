# Gestão de Consultórios Odontológicos

Um sistema completo para gerenciamento de consultórios odontológicos, desenvolvido com Next.js, TypeScript, Tailwind CSS e Prisma.

## Funcionalidades

- **Autenticação**: Sistema completo de login, registro e controle de acesso baseado em roles (Administrador, Dentista, Recepcionista, Paciente)
- **Dashboard**: Visualização rápida das principais métricas e ações
- **Pacientes**: Cadastro e gerenciamento de pacientes
- **Dentistas**: Cadastro e gerenciamento de profissionais
- **Consultas**: Agendamento, visualização e gerenciamento de consultas
- **Usuários**: Administração de usuários do sistema

## Tecnologias Utilizadas

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: API Routes do Next.js, Prisma ORM
- **Autenticação**: JWT (JSON Web Tokens)
- **Banco de Dados**: PostgreSQL

## Requisitos

- Node.js 18+
- PostgreSQL
- NPM ou Yarn

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/gestao-consultorios.git
   cd gestao-consultorios
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:
   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/gestao-consultorios"
   JWT_SECRET="seu-segredo-jwt-aqui"
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

4. Configure o banco de dados:
   ```bash
   npx prisma migrate dev
   # ou
   yarn prisma migrate dev
   ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

6. Acesse a aplicação em `http://localhost:3000`

## Estrutura do Projeto

```
gestao-consultorios/
├── src/
│   ├── app/                # Páginas da aplicação (Next.js App Router)
│   ├── components/         # Componentes reutilizáveis
│   ├── lib/                # Funções utilitárias
│   ├── prisma/             # Configuração e esquema do Prisma
├── public/                 # Arquivos estáticos
├── .env.local              # Variáveis de ambiente (não versionado)
├── next.config.js          # Configuração do Next.js
├── package.json            # Dependências e scripts
└── README.md               # Documentação
```

## Usuários e Permissões

### Administrador
- Acesso total ao sistema
- Gerenciamento de usuários
- Configurações da clínica

### Dentista
- Visualização e gerenciamento de pacientes
- Visualização e gerenciamento de consultas
- Acesso ao histórico de atendimentos

### Recepcionista
- Cadastro e gerenciamento de pacientes
- Agendamento de consultas
- Visualização de agenda de dentistas

### Paciente
- Visualização de consultas agendadas
- Agendamento de novas consultas
- Acesso ao histórico de atendimentos

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

Desenvolvido por [Seu Nome](https://github.com/seu-usuario)

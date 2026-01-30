# 🍽️ Marmita Express - Dashboard Administrativo

Um dashboard moderno e eficiente para gestão de restaurantes, focado em delivery e retirada. Construído com **React**, **Vite** e **Supabase**, o sistema oferece controle em tempo real de pedidos, cardápio e equipe de entrega.

## 🚀 Funcionalidades

- **Dashboard em Tempo Real:** Acompanhamento de pedidos ativos e métricas de desempenho.
- **Gestão de Pedidos:** Fila de produção integrada com status dinâmicos (Na Cozinha, Pronto, Saiu p/ Entrega).
- **Controle de Cardápio:** Gerenciamento lateral (Drawer) para adicionar, editar e remover itens com suporte a categorias e imagens.
- **Gestão de Entregadores:** Controle de status, localização e bateria da equipe de entrega.
- **Relatórios de Observabilidade:** Gráficos interativos e métricas detalhadas (Faturamento, Ticket Médio, Vendas por Categoria) com filtros por período.
- **Autenticação Segura:** Acesso administrativo via Supabase Auth.

## 🛠️ Tecnologias Utilizadas

- **Core:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Banco de Dados & Auth:** [Supabase](https://supabase.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Testes:** [Vitest](https://vitest.dev/) + React Testing Library

## 📦 Estrutura do Projeto

O projeto segue uma arquitetura modular para facilitar o crescimento:

```text
src/
├── api/             # Serviços e conexão com Supabase
├── components/      
│   ├── common/      # Componentes genéricos (Badge, Gráficos)
│   └── dashboard/   # Componentes específicos do dashboard
├── hooks/           # Lógica de negócio isolada (useOrders, useMenu, etc)
├── pages/           # Telas da aplicação (Login, Dashboard)
└── tests/           # Conjunto de testes unitários
```

## ⚙️ Configuração e Instalação

### 1. Clonar e Instalar
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto ou edite o arquivo `src/api/supabase.service.js` com suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 3. Rodar o Projeto
```bash
npm run dev
```

## 🔐 Configuração de Autenticação (E-mail)

O Supabase exige, por padrão, que o usuário confirme o e-mail antes de acessar o painel. Caso o cliente se cadastre pela tela de "Criar Conta", siga estes passos para garantir que ele receba e consiga validar:

1.  **Acesse o Console:** Vá em [supabase.com](https://supabase.com) e selecione seu projeto.
2.  **Authentication:** No menu lateral, clique em **Authentication**.
3.  **Provisers:** Clique em **Providers** e depois em **Email**.
4.  **Confirm Email:** Certifique-se de que "Confirm Email" esteja **Ativado**.
5.  **Templates:** Em **Email Templates**, você pode personalizar a mensagem que seu cliente receberá.

> [!IMPORTANT]
> Se você preferir que o cliente entre **sem precisar confirmar o e-mail** (não recomendado para produção), você pode desativar a opção "Confirm Email" no console do Supabase.

## 📊 Observabilidade com Langfuse

Este projeto utiliza o **Langfuse** para monitorar a saúde do sistema e fluxos críticos.
Para configurar:
1.  Crie uma conta no [Langfuse](https://langfuse.com).
2.  Gere suas chaves (`Public Key` e `Secret Key`).
3.  Adicione as chaves às variáveis de ambiente:
    ```env
    VITE_LANGFUSE_PUBLIC_KEY=sua_chave_publica
    VITE_LANGFUSE_BASEURL=https://cloud.langfuse.com
    ```

## 🧪 Comandos Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a versão de produção.
- `npm run test`: Executa os testes unitários.
- `npm run test:ui`: Abre a interface visual do Vitest para acompanhar os testes.
- `npm run lint`: Verifica erros de padrão de código.

## 🚀 Deploy Manual (Passo a Passo)

Se você deseja subir o sistema para um servidor manualmente, sem usar integração contínua (CI/CD), siga estes passos:

### 1. Gerar os arquivos de produção
No seu terminal local, dentro da pasta do projeto, execute:
```bash
npm run build
```
Isso criará uma pasta chamada `dist/` na raiz do seu projeto. Esta pasta contém todo o seu aplicativo otimizado e pronto para ser servido.

### 2. Localizar a pasta `dist`
Abra a pasta do seu projeto e localize a subpasta `dist/`. O conteúdo desta pasta será algo como:
- `assets/` (contendo arquivos JS e CSS minificados)
- `index.html`
- `vite.svg` (ou outros assets da raiz)

### 3. Subir para o servidor
Dependendo do seu serviço de hospedagem, o processo pode variar:

#### Opção A: Hospedagem Tradicional (cPanel/FTP)
1. Conecte-se ao seu servidor via Gerenciador de Arquivos (cPanel) ou cliente FTP (como FileZilla).
2. Navegue até a pasta pública do seu servidor (geralmente `public_html` ou `www`).
3. **Importante:** Não suba a pasta `dist` inteira. Suba **apenas o conteúdo** que está dentro da pasta `dist/` diretamente para a raiz da pasta pública do seu servidor.

#### Opção B: Drag & Drop (Netlify / Vercel / Surge)
1. Acesse o painel da ferramenta (ex: [Netlify Drop](https://app.netlify.com/drop)).
2. Arraste e solte a pasta `dist/` diretamente na área indicada.
3. O deploy será concluído em segundos.

### 4. Configurações Adicionais (Importante)
Como este aplicativo é um **Single Page Application (SPA)**, se você navegar para as páginas internas (como `/login`) e atualizar o navegador, o servidor pode retornar um erro 404.
Para corrigir isso:
- No **Netlify/Vercel:** Isso já é gerenciado automaticamente.
- No **Apache/cPanel:** Crie um arquivo chamado `.htaccess` dentro da pasta `dist/` (ou na raiz do servidor após subir) com o seguinte conteúdo:
  ```apache
  <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
  </IfModule>
  ```

---
Desenvolvido para máxima eficiência na gestão de marmitas e entregas. 🛵💨

# 📋 Checklist - Subir Dashboard no Git

## ✅ Pré-requisitos

### 1. Verificar arquivos sensíveis
- [ ] Confirmar que `.env` está no `.gitignore` ✅
- [ ] Verificar se não há credenciais hardcoded no código
- [ ] Garantir que `.env.example` está atualizado

### 2. Limpar arquivos temporários
```bash
# Remover arquivos de build (serão recriados)
rm -rf dist/

# Remover arquivos de teste (opcional, mas recomendado)
rm -f test_output.txt utf8_test_output.txt
```

### 3. Testar o projeto localmente
```bash
# Instalar dependências
npm install

# Rodar testes
npm run test

# Testar build de produção
npm run build

# Rodar em dev
npm run dev
```

---

## 🚀 Subir para o Git

### Opção A: Criar novo repositório no GitHub

1. **Criar repositório no GitHub:**
   - Acesse https://github.com/new
   - Nome: `dashboard-restaurante`
   - Descrição: "Dashboard administrativo para gestão de restaurante com n8n + Supabase"
   - Visibilidade: **Privado** (recomendado por conter lógica de negócio)
   - **NÃO** marque "Add README" (já temos um)

2. **Inicializar Git localmente:**
```bash
# Navegar até a pasta do projeto
cd "c:\Users\anton\OneDrive\Área de Trabalho\Projetos_Web\dashboard-restaurante"

# Inicializar repositório
git init

# Adicionar todos os arquivos (o .gitignore vai filtrar automaticamente)
git add .

# Verificar o que será commitado (IMPORTANTE!)
git status

# Criar primeiro commit
git commit -m "🎉 Initial commit - Dashboard Restaurante v1.0

- ✅ Sistema de autenticação com Supabase
- ✅ Gestão de pedidos em tempo real
- ✅ Chat ao vivo integrado com n8n
- ✅ Gerenciamento de cardápio, clientes e entregadores
- ✅ Testes unitários com Vitest
- ✅ Dashboard com métricas e gráficos"

# Conectar com o repositório remoto (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/dashboard-restaurante.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

### Opção B: Repositório já existe

```bash
cd "c:\Users\anton\OneDrive\Área de Trabalho\Projetos_Web\dashboard-restaurante"

git init
git add .
git commit -m "🎉 Initial commit - Dashboard Restaurante v1.0"
git remote add origin https://github.com/SEU_USUARIO/dashboard-restaurante.git
git push -u origin main
```

---

## 🔐 Configurar Secrets (se for usar CI/CD)

Se você for usar GitHub Actions ou deploy automático:

1. Acesse: `Settings` → `Secrets and variables` → `Actions`
2. Adicione as seguintes secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_N8N_BASE_URL`

---

## 📝 Comandos Git Úteis

```bash
# Ver status dos arquivos
git status

# Ver o que está sendo ignorado
git status --ignored

# Ver histórico de commits
git log --oneline

# Criar nova branch para desenvolvimento
git checkout -b dev

# Voltar para main
git checkout main

# Atualizar repositório remoto
git push

# Baixar alterações
git pull
```

---

## ⚠️ IMPORTANTE - Antes de dar push

Execute este comando para verificar se nenhum arquivo sensível será enviado:

```bash
git status
```

**Verifique se NÃO aparecem:**
- ❌ `.env`
- ❌ `node_modules/`
- ❌ `dist/`
- ❌ Arquivos com credenciais

**Devem aparecer:**
- ✅ `.env.example`
- ✅ `.gitignore`
- ✅ `src/`
- ✅ `README.md`
- ✅ `package.json`

---

## 🎯 Próximos Passos Recomendados

1. **Adicionar badges ao README:**
   - Build status
   - Testes
   - Versão

2. **Configurar GitHub Actions:**
   - Testes automáticos em cada push
   - Deploy automático

3. **Criar tags de versão:**
```bash
git tag -a v1.0.0 -m "Versão 1.0.0 - Release inicial"
git push origin v1.0.0
```

4. **Documentar melhorias recentes:**
   - Criar arquivo `CHANGELOG.md`
   - Documentar integração com n8n
   - Documentar funcionalidade de chat ao vivo

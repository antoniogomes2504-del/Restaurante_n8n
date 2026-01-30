# ⚡ Comandos Rápidos - Git Setup

**Use este arquivo para copiar e colar os comandos rapidamente!**

---

## 🚀 Setup Inicial (Execute HOJE)

### 1. Abrir PowerShell na pasta do projeto

```powershell
cd "c:\Users\anton\OneDrive\Área de Trabalho\Projetos_Web\dashboard-restaurante"
```

---

### 2. Verificar o que será commitado (IMPORTANTE!)

```powershell
git status
```

**✅ Verifique se NÃO aparecem:**
- `.env` (arquivo com credenciais)
- `node_modules/` (dependências)
- `dist/` (build)

**✅ Devem aparecer:**
- `src/` (código fonte)
- `package.json`
- `README.md`
- `.gitignore`
- `.env.example`

---

### 3. Inicializar Git

```powershell
git init
```

---

### 4. Adicionar todos os arquivos

```powershell
git add .
```

---

### 5. Verificar novamente (segurança extra)

```powershell
git status
```

---

### 6. Criar primeiro commit

```powershell
git commit -m "🎉 Initial commit - Dashboard Restaurante v1.0

- Sistema de autenticação com Supabase
- Gestão de pedidos em tempo real
- Chat ao vivo integrado com n8n
- Gerenciamento de cardápio, clientes e entregadores
- Testes unitários com Vitest
- Dashboard com métricas e gráficos"
```

---

### 7. Criar repositório no GitHub

**Acesse:** https://github.com/new

**Configurações:**
- Nome: `dashboard-restaurante`
- Descrição: `Dashboard administrativo para gestão de restaurante com n8n + Supabase`
- Visibilidade: **Privado** ✅
- **NÃO** marque "Add README" (já temos)
- **NÃO** marque "Add .gitignore" (já temos)

---

### 8. Conectar com GitHub (SUBSTITUA SEU_USUARIO)

```powershell
git remote add origin https://github.com/antoniogomes2504-del/dashboard-restaurante.git
```

**Exemplo:**
```powershell
git remote add origin https://github.com/antoniogomes2504/dashboard-restaurante.git
```

---

### 9. Renomear branch para main

```powershell
git branch -M main
```

---

### 10. Enviar para GitHub (PUSH!)

```powershell
git push -u origin main
```

**Se pedir autenticação:**
- Usuário: seu_email@gmail.com
- Senha: **Personal Access Token** (não é a senha do GitHub!)

**Como criar token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Marque: `repo` (acesso completo)
4. Copie o token e use como senha

---

## 🔄 Comandos Futuros (Próximas Atualizações)

### Adicionar novos arquivos

```powershell
git add .
git commit -m "feat: descrição da mudança"
git push
```

### Ver status

```powershell
git status
```

### Ver histórico

```powershell
git log --oneline
```

### Criar branch de desenvolvimento

```powershell
git checkout -b dev
```

### Voltar para main

```powershell
git checkout main
```

### Atualizar do GitHub

```powershell
git pull
```

---

## 📝 Mensagens de Commit (Padrão)

Use estes prefixos:

```powershell
# Nova funcionalidade
git commit -m "feat: adiciona sistema de notificações"

# Correção de bug
git commit -m "fix: corrige erro no chat ao vivo"

# Documentação
git commit -m "docs: atualiza README com instruções de deploy"

# Refatoração
git commit -m "refactor: melhora performance do realtime"

# Testes
git commit -m "test: adiciona testes para chat"

# Estilo/formatação
git commit -m "style: formata código com prettier"
```

---

## ⚠️ Comandos de Emergência

### Desfazer último commit (mantém alterações)

```powershell
git reset --soft HEAD~1
```

### Ver o que está sendo ignorado

```powershell
git status --ignored
```

### Remover arquivo do staging (antes do commit)

```powershell
git reset HEAD nome_do_arquivo
```

### Ver diferenças

```powershell
git diff
```

---

## 🏷️ Criar Tag de Versão

```powershell
git tag -a v1.0.0 -m "Versão 1.0.0 - Release inicial"
git push origin v1.0.0
```

---

## 🔐 Verificação de Segurança

### Antes de QUALQUER push, execute:

```powershell
# 1. Ver o que será enviado
git status

# 2. Ver conteúdo dos arquivos staged
git diff --cached

# 3. Verificar se .env está no .gitignore
cat .gitignore | Select-String ".env"
```

**✅ Deve aparecer:**
```
.env
.env.local
.env.production
.env.*.local
```

---

## 📊 Verificar Tamanho do Repositório

```powershell
# Ver tamanho total
git count-objects -vH

# Ver arquivos maiores
git ls-files | ForEach-Object { Get-Item $_ } | Sort-Object Length -Descending | Select-Object -First 10
```

---

## 🎯 Checklist Final

Antes de dar push, verifique:

- [ ] `git status` não mostra `.env`
- [ ] `git status` não mostra `node_modules/`
- [ ] `git status` não mostra `dist/`
- [ ] `.gitignore` está atualizado
- [ ] `.env.example` está atualizado
- [ ] `README.md` está completo
- [ ] Testes estão passando (`npm run test`)
- [ ] Build funciona (`npm run build`)
- [ ] Commit message está clara

---

## 🆘 Problemas Comuns

### "fatal: not a git repository"
```powershell
git init
```

### "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/dashboard-restaurante.git
```

### "failed to push some refs"
```powershell
git pull origin main --rebase
git push -u origin main
```

### "Permission denied (publickey)"
Use HTTPS ao invés de SSH:
```powershell
git remote set-url origin https://github.com/SEU_USUARIO/dashboard-restaurante.git
```

---

## 📞 Suporte

**Documentação completa:**
- `GIT_CHECKLIST.md` - Checklist detalhado
- `RESUMO_ANALISE.md` - Resumo da análise
- `ANALISE_SINCRONIZACAO_N8N.md` - Documentação técnica
- `FLUXO_MENSAGENS.md` - Fluxos visuais

---

**🎉 Boa sorte com o push! Qualquer dúvida, consulte os arquivos acima.**

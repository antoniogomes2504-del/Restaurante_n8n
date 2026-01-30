# 🔐 Como Criar e Usar Personal Access Token

**O push falhou porque o GitHub não aceita mais senha direta!**

Você precisa usar um **Personal Access Token** (PAT) ao invés da senha.

---

## 📝 Passo a Passo (5 minutos)

### 1️⃣ Criar o Token no GitHub

1. **Acesse:** https://github.com/settings/tokens

2. **Clique em:** `Generate new token` → `Generate new token (classic)`

3. **Preencha:**
   - **Note:** `Dashboard Restaurante` (nome para você lembrar)
   - **Expiration:** `90 days` (ou `No expiration` se preferir)
   
4. **Marque APENAS esta opção:**
   - ✅ **`repo`** (Full control of private repositories)
   
5. **Role até o final** e clique em: `Generate token`

6. **COPIE O TOKEN!** 
   - Vai aparecer algo como: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - ⚠️ **Você só verá UMA VEZ!** Copie agora!

---

### 2️⃣ Usar o Token no Git

Agora execute este comando novamente:

```powershell
git push -u origin main
```

**Quando pedir:**
- **Username:** `antoniogomes2504-del`
- **Password:** **Cole o token** (ghp_xxxx...) ← NÃO é a senha do GitHub!

---

## 🚀 Comando Completo (Copie e Cole)

```powershell
cd "c:\Users\anton\OneDrive\Área de Trabalho\Projetos_Web\dashboard-restaurante"
git push -u origin main
```

**Depois cole:**
1. Username: `antoniogomes2504-del`
2. Password: `ghp_seu_token_aqui` (o token que você copiou)

---

## 💡 Dica: Salvar Credenciais (Opcional)

Para não precisar digitar toda vez:

```powershell
git config --global credential.helper wincred
```

Depois do primeiro push com token, o Windows vai salvar automaticamente!

---

## 🆘 Alternativa: GitHub CLI (Mais Fácil!)

Se preferir não criar token manualmente:

```powershell
# 1. Instalar GitHub CLI
winget install --id GitHub.cli

# 2. Fazer login (abre navegador automaticamente)
gh auth login

# 3. Escolher:
# - GitHub.com
# - HTTPS
# - Yes (authenticate Git)
# - Login with a web browser

# 4. Depois que autenticar, execute:
git push -u origin main
```

---

## ✅ Como Saber se Funcionou?

Você verá algo assim:

```
Enumerating objects: 100, done.
Counting objects: 100% (100/100), done.
Delta compression using up to 8 threads
Compressing objects: 100% (90/90), done.
Writing objects: 100% (100/100), 50.00 KiB | 5.00 MiB/s, done.
Total 100 (delta 20), reused 0 (delta 0), pack-reused 0
To https://github.com/antoniogomes2504-del/Restaurante_n8n.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

**Depois acesse:** https://github.com/antoniogomes2504-del/Restaurante_n8n

E você verá todos os arquivos lá! 🎉

---

## 📸 Visual do Token

Quando você criar o token, vai aparecer assim:

```
┌─────────────────────────────────────────┐
│ Personal access tokens (classic)        │
├─────────────────────────────────────────┤
│                                         │
│ ✅ Make sure to copy your personal     │
│    access token now. You won't be      │
│    able to see it again!               │
│                                         │
│ ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx        │
│                                         │
│ [Copy] ← Clique aqui!                  │
└─────────────────────────────────────────┘
```

---

## ⚠️ IMPORTANTE

- ❌ **NÃO use a senha do GitHub** (não funciona mais)
- ✅ **USE o Personal Access Token** (ghp_xxx...)
- 🔐 **Guarde o token em local seguro** (você vai precisar de novo)

---

**🚀 Agora sim! Crie o token e tente novamente o push!**

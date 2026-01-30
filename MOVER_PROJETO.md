# 🔄 Script para Mover Projeto do OneDrive

**IMPORTANTE: Execute estes comandos UM POR VEZ!**

---

## 📍 Novo Local Recomendado

```
C:\Projetos\dashboard-restaurante
```

**Por que este local?**
- ✅ Fora do OneDrive
- ✅ Caminho curto (evita problemas com paths longos)
- ✅ Fácil de acessar
- ✅ Não sincroniza com nuvem

---

## 🚀 Comandos para Mover (Execute UM POR VEZ)

### 1️⃣ Criar pasta de projetos

```powershell
# Criar pasta C:\Projetos
New-Item -Path "C:\Projetos" -ItemType Directory -Force
```

---

### 2️⃣ Copiar projeto inteiro

```powershell
# Copiar tudo (incluindo .git, node_modules, etc)
Copy-Item -Path "c:\Users\anton\OneDrive\Área de Trabalho\Projetos_Web\dashboard-restaurante" -Destination "C:\Projetos\dashboard-restaurante" -Recurse -Force
```

**⏱️ Isso pode demorar alguns minutos por causa do `node_modules/`**

---

### 3️⃣ Verificar se copiou tudo

```powershell
# Listar arquivos na nova pasta
Get-ChildItem "C:\Projetos\dashboard-restaurante" -Force
```

**Deve aparecer:**
- ✅ `.git/` (pasta oculta)
- ✅ `src/`
- ✅ `node_modules/`
- ✅ `package.json`
- ✅ `.env`
- ✅ Todos os outros arquivos

---

### 4️⃣ Testar se funciona

```powershell
# Navegar para nova pasta
cd "C:\Projetos\dashboard-restaurante"

# Verificar Git
git status

# Testar npm
npm run dev
```

---

### 5️⃣ Excluir pasta do OneDrive (CUIDADO!)

**⚠️ SÓ EXECUTE DEPOIS DE CONFIRMAR QUE TUDO FUNCIONA!**

```powershell
# Parar OneDrive de sincronizar esta pasta primeiro
# Depois deletar:
Remove-Item -Path "c:\Users\anton\OneDrive\Área de Trabalho\Projetos_Web\dashboard-restaurante" -Recurse -Force
```

---

## 🎯 Checklist de Verificação

Antes de deletar a pasta antiga:

- [ ] Nova pasta existe em `C:\Projetos\dashboard-restaurante`
- [ ] `git status` funciona na nova pasta
- [ ] `.env` está na nova pasta
- [ ] `npm run dev` funciona
- [ ] VSCode abre o projeto corretamente
- [ ] Todos os arquivos foram copiados

---

## 🔧 Atualizar VSCode

Depois de mover:

1. **Fechar VSCode**
2. **Abrir VSCode na nova pasta:**
   ```powershell
   code "C:\Projetos\dashboard-restaurante"
   ```

---

## 📝 Atualizar .gitignore para OneDrive

Adicione estas linhas ao `.gitignore` (prevenção futura):

```gitignore
# OneDrive
desktop.ini
*.tmp
~$*
```

---

## 🆘 Se Algo Der Errado

**Não se preocupe!** O projeto está no GitHub:

```powershell
# Clonar do GitHub
cd C:\Projetos
git clone https://github.com/antoniogomes2504-del/Restaurante_n8n.git dashboard-restaurante
cd dashboard-restaurante

# Copiar .env da pasta antiga
Copy-Item "c:\Users\anton\OneDrive\Área de Trabalho\Projetos_Web\dashboard-restaurante\.env" -Destination ".env"

# Instalar dependências
npm install

# Rodar
npm run dev
```

---

## ✅ Vantagens da Nova Localização

| Antes (OneDrive) | Depois (C:\Projetos) |
|------------------|----------------------|
| ❌ Sincronização constante | ✅ Sem sincronização |
| ❌ Conflitos de arquivos | ✅ Sem conflitos |
| ❌ Performance ruim | ✅ Performance máxima |
| ❌ Path longo | ✅ Path curto |
| ❌ Problemas com node_modules | ✅ Sem problemas |

---

**🚀 Execute os comandos acima UM POR VEZ e me avise se tudo funcionar!**

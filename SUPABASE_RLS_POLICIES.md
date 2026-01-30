# 🔐 Políticas RLS do Supabase

**Data da última atualização:** 30/01/2026

---

## ⚠️ PROBLEMA COMUM: Botão "Pronto" não funciona

### 🔍 Sintoma:
- O botão "Pronto" é clicado
- Os logs mostram que o UPDATE foi enviado
- **MAS o status não muda no banco de dados**
- O pedido continua como "PENDENTE" ou "IMPRIMINDO"

### 🎯 Causa:
**RLS (Row Level Security)** está bloqueando operações de UPDATE porque não há política configurada.

### ✅ Solução:
Execute este SQL no Supabase para permitir UPDATE:

```sql
-- Permite UPDATE em pedidos (para mudar status)
CREATE POLICY "Permitir UPDATE de status" ON fila_impressao 
FOR UPDATE 
USING (true) 
WITH CHECK (true);
```

---

## 📋 Políticas Necessárias para o Dashboard Funcionar

### 1. **SELECT** (Leitura de Pedidos)
```sql
DROP POLICY IF EXISTS "Diagnostico Pedidos" ON fila_impressao;
CREATE POLICY "Diagnostico Pedidos" ON fila_impressao 
FOR SELECT 
USING (true);
```

### 2. **UPDATE** (Atualizar Status dos Pedidos)
```sql
DROP POLICY IF EXISTS "Permitir UPDATE de status" ON fila_impressao;
CREATE POLICY "Permitir UPDATE de status" ON fila_impressao 
FOR UPDATE 
USING (true) 
WITH CHECK (true);
```

### 3. **INSERT** (Opcional - se o dashboard criar pedidos)
```sql
DROP POLICY IF EXISTS "Permitir INSERT de pedidos" ON fila_impressao;
CREATE POLICY "Permitir INSERT de pedidos" ON fila_impressao 
FOR INSERT 
WITH CHECK (true);
```

---

## 🚀 Script Completo para Configuração Inicial

Execute este script quando criar um **novo ambiente** (teste ou produção):

```sql
-- ========================================
-- POLÍTICAS RLS PARA fila_impressao
-- ========================================

-- 1. SELECT: Permite ler todos os pedidos
DROP POLICY IF EXISTS "Diagnostico Pedidos" ON fila_impressao;
CREATE POLICY "Diagnostico Pedidos" ON fila_impressao 
FOR SELECT 
USING (true);

-- 2. UPDATE: Permite atualizar status dos pedidos
DROP POLICY IF EXISTS "Permitir UPDATE de status" ON fila_impressao;
CREATE POLICY "Permitir UPDATE de status" ON fila_impressao 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- 3. INSERT: Permite criar novos pedidos (se necessário)
DROP POLICY IF EXISTS "Permitir INSERT de pedidos" ON fila_impressao;
CREATE POLICY "Permitir INSERT de pedidos" ON fila_impressao 
FOR INSERT 
WITH CHECK (true);
```

---

## 🔍 Como Verificar se as Políticas Estão Ativas

### No Supabase Dashboard:
1. Vá em **Database** → **Tables** → `fila_impressao`
2. Clique na aba **RLS** (Row Level Security)
3. Verifique se aparecem as políticas:
   - ✅ "Diagnostico Pedidos" (SELECT)
   - ✅ "Permitir UPDATE de status" (UPDATE)

### Via SQL:
```sql
-- Listar todas as políticas da tabela fila_impressao
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'fila_impressao';
```

---

## 📝 Outras Tabelas que Precisam de Políticas

### **cardapio** (Cardápio)
```sql
-- SELECT: Ler itens do cardápio
CREATE POLICY "Cardapio visivel" ON cardapio FOR SELECT USING (true);

-- UPDATE: Editar itens do cardápio
CREATE POLICY "Cardapio editavel" ON cardapio FOR UPDATE USING (true) WITH CHECK (true);

-- INSERT: Adicionar novos itens
CREATE POLICY "Cardapio inserivel" ON cardapio FOR INSERT WITH CHECK (true);

-- DELETE: Remover itens
CREATE POLICY "Cardapio deletavel" ON cardapio FOR DELETE USING (true);
```

### **drivers** (Entregadores)
```sql
-- SELECT: Ler entregadores
CREATE POLICY "Drivers visiveis" ON drivers FOR SELECT USING (true);

-- UPDATE: Editar entregadores
CREATE POLICY "Drivers editaveis" ON drivers FOR UPDATE USING (true) WITH CHECK (true);

-- INSERT: Adicionar entregadores
CREATE POLICY "Drivers inseriveis" ON drivers FOR INSERT WITH CHECK (true);

-- DELETE: Remover entregadores
CREATE POLICY "Drivers deletaveis" ON drivers FOR DELETE USING (true);
```

### **clientes** (Clientes)
```sql
-- SELECT: Ler clientes
CREATE POLICY "Clientes visiveis" ON clientes FOR SELECT USING (true);

-- UPDATE: Editar clientes (ex: bot_ativo)
CREATE POLICY "Clientes editaveis" ON clientes FOR UPDATE USING (true) WITH CHECK (true);

-- INSERT: Adicionar clientes
CREATE POLICY "Clientes inseriveis" ON clientes FOR INSERT WITH CHECK (true);
```

---

## ⚠️ IMPORTANTE: Ambiente de Teste vs Produção

### Tabelas de TESTE (sufixo `_teste`)
- `fila_impressao_teste`
- `cardapio_teste`
- `clientes_teste`
- `n8n_chat_histories_teste`

**As mesmas políticas devem ser aplicadas nas tabelas de teste!**

### Script para Tabelas de Teste:
```sql
-- Copie o script acima e substitua os nomes das tabelas:
-- fila_impressao → fila_impressao_teste
-- cardapio → cardapio_teste
-- etc.
```

---

## 🛠️ Troubleshooting

### Problema: "Error updating status"
**Causa:** Falta política de UPDATE  
**Solução:** Execute o script de UPDATE acima

### Problema: "Error fetching orders"
**Causa:** Falta política de SELECT  
**Solução:** Execute o script de SELECT acima

### Problema: "Error saving item"
**Causa:** Falta política de INSERT ou UPDATE  
**Solução:** Execute os scripts de INSERT e UPDATE

---

## 📚 Referências

- [Documentação RLS do Supabase](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Policies](https://www.postgresql.org/docs/current/sql-createpolicy.html)

---

## ✅ Checklist de Configuração

Ao configurar um **novo ambiente**, verifique:

- [ ] RLS está **habilitado** nas tabelas principais
- [ ] Política de **SELECT** configurada
- [ ] Política de **UPDATE** configurada
- [ ] Política de **INSERT** configurada (se necessário)
- [ ] Política de **DELETE** configurada (se necessário)
- [ ] Testado o botão "Pronto" no dashboard
- [ ] Testado edição de cardápio
- [ ] Testado gestão de entregadores

---

**🎉 Com essas políticas configuradas, o dashboard funcionará perfeitamente!**

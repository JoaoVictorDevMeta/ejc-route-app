# 🕊️ EJC · Apoio à Externa

<div align="center">

**Ferramenta web para apoiar a equipe da externa do EJC na priorização, agrupamento e estimativa de rotas dos encontristas.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Prisma](https://img.shields.io/badge/Prisma-8-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io)

</div>

---

## ✨ Sobre o projeto

O **EJC · Apoio à Externa** nasceu de um problema real: a equipe da externa precisa decidir, a cada encontro, **quem buscar, em qual ordem e em qual agrupamento de carros**. Hoje essa decisão é feita de forma manual, sem visão geográfica consolidada e sem critérios transparentes de priorização.

Esta aplicação resolve isso com uma pipeline completa de análise geoespacial — geocodificação, priorização ponderada, agrupamento inteligente e estimativa de rotas — tudo em uma interface visual, simples e pensada para ser usada por qualquer pessoa da equipe.

> **Princípio fundamental:** a ferramenta **apoia** a decisão, não a substitui. Tudo é transparente, ajustável e auditável.

---

## 🎯 Funcionalidades

<table>
<tr>
<td width="50%" valign="top">

### 👥 Encontristas
- Cadastro com busca automática por CEP
- Priorização por score ponderado
- Classificação em Alta / Média / Baixa
- Filtros por status, prioridade e nome
- Edição e exclusão com um clique

### 🗺️ Mapa interativo
- Visualização geográfica de todos os pontos
- Camadas ativáveis (encontristas, carros, rotas)
- Modo claro / escuro / colorido
- Rotas animadas com cores distintas

</td>
<td width="50%" valign="top">

### 🚗 Carros e grupos
- Cadastro de pais de carro com origem
- Distribuição automática por proximidade
- Respeito à capacidade de cada veículo
- Otimização com **Simulated Annealing**
- Estimativa de distância e tempo por rota

### ⚙️ Configurações
- Cadastro do encontro ativo
- Ajuste de pesos de priorização em tempo real
- Permissão de remanejamento de capacidade
- Recálculo automático dos scores

</td>
</tr>
</table>

---

## 🛠️ Stack

| Camada | Tecnologia | Por quê |
|---|---|---|
| **Frontend + Backend** | Next.js 16 (App Router) | BFF unificado, Server Actions, streaming |
| **Linguagem** | TypeScript | Type-safety de ponta a ponta |
| **Estilo** | Tailwind CSS 4 + shadcn/ui | Design system moderno e acessível |
| **Banco** | Supabase (Postgres) | Free tier generoso, auth incluso |
| **ORM** | Prisma 8 | Migrations versionadas, type-safe |
| **Mapa** | React Leaflet + CARTO | Open-source, sem custo |
| **Autenticação** | Supabase Auth | Sem signup público, controlado |
| **Hospedagem** | Vercel | Deploy automático, edge network |

---

## 🧠 Algoritmos

Este projeto implementa **algoritmos reais** de otimização, não apenas chamadas a bibliotecas prontas.

### 📍 Haversine — distância entre coordenadas
Cálculo em linha reta entre dois pontos geográficos, considerando a curvatura da Terra. Complexidade `O(1)`.

### 🎯 Score Ponderado — priorização
Soma ponderada de critérios normalizados:
```
score = (peso_distancia × nota_distancia)
      + (peso_fila      × nota_fila)
      + (peso_presenca  × nota_presenca)
      + (peso_indicacao × nota_indicacao)
```

### 🌐 DBSCAN — clustering por densidade
Agrupa pontos densamente próximos e trata isolados como ruído. Descobre o número de clusters sozinho.

### 🧩 Greedy Capacitado — formação de trios
Distribui encontristas por proximidade da origem do carro, respeitando capacidade. Complexidade `O(n² log n)`.

### 🔥 Simulated Annealing — otimização VRP
Metaheurística inspirada no resfriamento de metais. Aceita soluções ruins no início para escapar de ótimos locais e converge para o melhor global.

- **Estado:** `{ carros: Ponto[][] }`
- **Custo:** soma de distâncias + penalidades (capacidade, carros vazios, fairness)
- **Vizinhança:** mover, trocar, inverter segmento, rebalancear
- **Critério de aceitação:** Metropolis (`e^(-ΔE/T)`)

### 🛣️ OSRM — roteamento real
Motor open-source de roteamento baseado em OpenStreetMap. Retorna distância, tempo e polyline de rotas reais.

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    NAVEGADOR                            │
│  Next.js Client Components + shadcn/ui + Leaflet        │
└────────────────────────────┬────────────────────────────┘
                             │ Server Actions / Route Handlers
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  NEXT.JS SERVER                         │
│  • Middleware de autenticação                           │
│  • Server Components (fetch via Prisma)                 │
│  • Server Actions (CRUD, geocodificação, otimização)    │
└────────────┬─────────────────────────┬──────────────────┘
             │                         │
             ▼                         ▼
┌────────────────────────┐   ┌──────────────────────────┐
│  SUPABASE (Postgres)   │   │   APIs externas          │
│  • auth.users          │   │   • ViaCEP               │
│  • Tabelas da app      │   │   • Nominatim / Photon   │
│  • RLS                 │   │   • OSRM público         │
└────────────────────────┘   └──────────────────────────┘
```

**Princípio:** cálculos leves rodam no cliente; acessos a banco e APIs externas rodam no servidor.

---

## 📁 Estrutura de pastas

```
src/
├── app/
│   ├── (public)/
│   │   └── login/                    # Autenticação
│   └── (painel)/
│       ├── layout.tsx                # Sidebar + Header
│       └── painel/
│           ├── page.tsx              # Dashboard
│           ├── encontristas/         # Planilha + cadastro
│           ├── grupos/               # Formação de trios
│           ├── mapa/                 # Visualização geoespacial
│           └── config/               # Configurações do encontro
│
├── components/
│   ├── ui/                           # shadcn/ui
│   ├── layout/                       # Sidebar, Header, UserNav
│   ├── encontristas/                 # Tabela, formulário, toolbar
│   ├── grupos/                       # Cards de trio, métricas
│   ├── mapa/                         # Leaflet wrapper
│   └── config/                       # Formulários de config
│
├── lib/
│   ├── supabase/                     # Clients client + server
│   ├── algorithm/                    # Algoritmos de otimização
│   │   ├── haversine.ts
│   │   ├── dbscan.ts
│   │   ├── greedytrio.ts
│   │   ├── simulatedAnnealing.ts
│   │   ├── vrp.ts
│   │   ├── priorizacao.ts
│   │   ├── osrm.ts
│   │   └── adapters.ts
│   ├── prisma.ts                     # Singleton do Prisma
│   ├── geocoding.ts                  # ViaCEP + Nominatim + Photon
│   └── endereco.ts                   # Parser de endereço
│
├── actions/                          # Server Actions
│   ├── encontros.ts
│   ├── encontristas.ts
│   ├── carros.ts
│   ├── config.ts
│   ├── scores.ts
│   └── routeOtimization.ts
│
└── types/                            # Tipos compartilhados
```

---

## 🚀 Começando

### Pré-requisitos

- **Node.js** 20+
- **npm** ou **pnpm**
- Conta no **Supabase**
- Conta na **Vercel** (para deploy)

### 1. Clonar e instalar

```bash
git clone https://github.com/seu-usuario/ejc-app.git
cd ejc-app
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."

# Banco (Supabase Pooler)
DATABASE_URL="postgresql://postgres.xxx:senha@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

### 3. Aplicar migrations no banco

```bash
npx prisma contract emit
npx prisma migration plan
npx prisma db migrate
```

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## 🔐 Autenticação

O sistema **não permite cadastro público**. Os usuários da equipe são criados manualmente no painel do Supabase:

1. **Supabase Dashboard** → Authentication → Users → Add user
2. Popule a tabela `Profile` correspondente (ou crie uma Server Action de sync)
3. Configure **Authentication → URL Configuration** com o domínio de produção

---

## 📜 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção local |
| `npm run lint` | Verificação de lint |
| `npm run contract:emit` | Gera os tipos do Prisma 8 |

---

## 🌐 Deploy

### Vercel (recomendado)

```bash
# 1. Instalar CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Preview
vercel

# 4. Produção
vercel --prod
```

Configure as variáveis de ambiente em **Settings → Environment Variables** no painel da Vercel.

### Checklist antes de ir para produção

```
[ ] DATABASE_URL aponta para o pooler do Supabase
[ ] Variáveis configuradas na Vercel
[ ] Migrations aplicadas no banco de produção
[ ] Supabase Auth com signup desativado
[ ] Usuários da equipe criados
[ ] Tabela Profile populada
[ ] next.config.ts com headers de segurança
[ ] Middleware com matcher ajustado
[ ] Testado em preview antes de --prod
```

---

## 🎨 Design System

O projeto usa **shadcn/ui** como base, com suporte nativo a **tema claro e escuro**.

- **Paleta:** tons de azul (primary) e neutros
- **Tipografia:** Inter (via `next/font`)
- **Componentes:** Cards, Badges, Dialogs, Tabs, Sliders, Switches
- **Animações:** transições suaves em `page-in`, `row-in`
- **Responsivo:** mobile-first com sidebar adaptável

---

## 🤝 Contribuindo

Este é um projeto de uma comunidade paroquial, feito com carinho para facilitar o trabalho de quem serve. Se você quer contribuir:

1. Faça um **fork** do projeto
2. Crie uma branch com sua feature (`git checkout -b feature/minha-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/minha-feature`)
5. Abra um **Pull Request**

---

<div align="center">

**Feito com ❤️ para a equipe da externa do EJC**

*"A alegria do Senhor é a nossa força."* — Neemias 8:10

</div>
# AeroCode 

Protótipo navegável de um sistema para gerenciar a produção de aeronaves
---

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm (já vem com o Node)

### Instalação e execução

```bash
# 1. Clone o repositório ou extraia o projeto
cd AV2

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

O terminal exibirá a URL de acesso:

```
  VITE v5.x.x  ready in ~300ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Abra o link no navegador para acessar o sistema.

---

## Acesso ao sistema

O protótipo **não exige preenchimento de credenciais reais** — basta clicar em **LOGIN** para entrar como Administrador.

---

## Estrutura do projeto

```
AV2/
├── src/
│   ├── assets/
│   │   └── logo.png               # Logo da aplicação
│   │
│   ├── components/
│   │   ├── ui/                    # Componentes de interface reutilizáveis
│   │   │   ├── Badge.tsx          # Indicadores de status coloridos
│   │   │   ├── Btn.tsx            # Botão com variantes (primary, ghost, danger…)
│   │   │   ├── Card.tsx           # Container de conteúdo com sombra
│   │   │   ├── FormField.tsx      # Wrapper de campo com label
│   │   │   ├── Logo.tsx           # Componente da logo AeroCode
│   │   │   ├── SectionTitle.tsx   # Título de seção com subtítulo
│   │   │   ├── StatCard.tsx       # Card de métrica (valor + ícone)
│   │   │   ├── Table.tsx          # Tabela com header, linhas e estado vazio
│   │   │   └── Toast.tsx          # Notificação flutuante de sucesso/erro
│   │   ├── Modal.tsx              # Modal genérico com backdrop blur
│   │   └── Sidebar.tsx            # Navegação lateral com grupos e status
│   │
│   ├── context/
│   │   └── AppContext.tsx         # Estado global, lógica de negócio e actions
│   │
│   ├── pages/
│   │   ├── Login.tsx              # Tela de autenticação com foto de fundo
│   │   ├── Dashboard.tsx          # Visão geral com gráficos e tabela de frota
│   │   ├── AeroDetalhe.tsx        # Detalhes de uma aeronave (etapas, peças, testes)
│   │   ├── ViewAeronaves.tsx      # Listagem e cadastro de aeronaves
│   │   ├── ViewPecas.tsx          # Gerenciamento de peças e status
│   │   ├── ViewEtapas.tsx         # Etapas de produção com controle sequencial
│   │   ├── ViewTestes.tsx         # Registro de testes técnicos
│   │   ├── ViewFuncionarios.tsx   # Equipe, associações e permissões
│   │   └── ViewRelatorio.tsx      # Geração e download do relatório final (.txt)
│   │
│   ├── types/
│   │   └── index.ts               # Tipos TypeScript (Aeronave, Etapa, View…)
│   │
│   ├── App.tsx                    # Roteamento de views e layout principal
│   ├── main.tsx                   # Entry point — monta o React no DOM
│   └── index.css                  # Estilos globais e variáveis CSS
│
├── index.html                     # HTML base do Vite
├── package.json                   # Dependências e scripts
├── tsconfig.json                  # Configuração do TypeScript
├── tsconfig.node.json             # Configuração do TypeScript para o Vite
├── vite.config.ts                 # Configuração do servidor Vite
└── .gitignore                     # node_modules e build ignorados
```

---


##  Observações

- Este projeto é um **protótipo navegável** — os dados não são persistidos entre recarregamentos da página.
- O login não valida credenciais reais; clicar em **LOGIN** autentica automaticamente como Administrador.
- O Wireframe: https://www.figma.com/design/ybMMwPHJ7ZPp82VfggsnoS/AeroCode?node-id=9-775&t=nWY2t4ffzWcFUjOq-1 
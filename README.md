# AeroCode 

Protótipo navegável de um sistema MRO (*Maintenance, Repair & Overhaul*) para gerenciar o ciclo completo de produção de aeronaves — do cadastro inicial até a entrega final ao cliente.

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

## 🗂 Páginas e funcionalidades

### Dashboard
Visão geral operacional com:
- Cards de métricas (aeronaves, peças, etapas abertas, funcionários)
- Gráfico de etapas por status (Pendente / Em Andamento / Concluído)
- Gráfico de progresso da frota por aeronave (% de etapas concluídas)
- Gráfico de resultados dos testes (Aprovado / Reprovado)
- Tabela da frota com barra de progresso por aeronave

### Aeronaves
- Listagem completa com código, modelo, tipo, capacidade e alcance
- Cadastro de nova aeronave com validação de **código único**
- Acesso à página de detalhes de cada aeronave

### Detalhe da Aeronave
- Informações completas e barra de progresso geral
- Lista de etapas vinculadas com ações de iniciar/concluir inline
- Lista de peças com status
- Lista de testes realizados

### Peças
- Listagem de todas as peças de todas as aeronaves
- Adição de peça a uma aeronave (nome, tipo, fornecedor)
- Atualização de status: `Em Produção` → `Em Transporte` → `Pronta`

### Etapas de Produção
- Listagem geral de etapas com aeronave, prazo, responsáveis e status
- Adição de etapa com **bloqueio**: não é permitido criar nova etapa se já existe uma com status `Pendente`
- Controle sequencial: etapas devem ser **iniciadas e concluídas em ordem**
- Ações de **Iniciar** e **Concluir** diretamente na tabela

###  Testes Técnicos
- Registro de testes por aeronave
- Tipos disponíveis: `Elétrico`, `Hidráulico`, `Aerodinâmico`
- Resultado: `Aprovado` ou `Reprovado`

###  Funcionários
- Listagem com ID, nome, usuário, telefone, cargo e nível de permissão
- Cadastro de novo funcionário com validação de **usuário único** e **senha única**
- Associação de funcionários a etapas específicas (sem duplicidade)
- Visualização de membros por etapa
- Cadastro restrito ao nível **Administrador**

###  Relatório Final
- Seleção de aeronave, cliente e data de entrega
- Geração de relatório completo com etapas, peças e resultados de testes
- **Download em `.txt`** para consulta posterior

---

##  Stack tecnológica

| Tecnologia       | Versão  | Uso                              |
|------------------|---------|----------------------------------|
| React            | 18      | Biblioteca de interface          |
| TypeScript       | 5       | Tipagem estática                 |
| Vite             | 5       | Build tool e dev server          |
| Recharts         | 2       | Gráficos do dashboard            |
| Lucide React     | 0.383   | Ícones                           |

---

##  Regras de negócio implementadas

- Código de aeronave deve ser **único**
- Usuário e senha de funcionário devem ser **únicos** no sistema
- Não é possível adicionar nova etapa enquanto houver etapa com status **Pendente**
- Etapas seguem **ordem sequencial**: só é possível iniciar a próxima após concluir a anterior
- Associação de funcionário a etapa **não permite duplicidade**
- Cadastro de funcionários restrito ao nível **Administrador**

---

##  Observações

- Este projeto é um **protótipo navegável** — os dados não são persistidos entre recarregamentos da página.
- O login não valida credenciais reais; clicar em **LOGIN** autentica automaticamente como Administrador.
- O Wireframe: https://www.figma.com/design/ybMMwPHJ7ZPp82VfggsnoS/AeroCode?node-id=9-775&t=nWY2t4ffzWcFUjOq-1 
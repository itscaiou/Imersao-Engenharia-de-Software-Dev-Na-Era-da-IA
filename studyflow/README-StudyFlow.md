# StudyFlow 📚

O **StudyFlow** é uma aplicação web para ajudar estudantes a organizar sua rotina de estudos. Nela, é possível cadastrar objetivos, definir prazos e acompanhar o andamento de cada meta em um painel.

O projeto foi desenvolvido durante a imersão **Engenharia de Software: Dev na Era da IA**, da Alura, com apoio do **Google AI Studio**. A aplicação é uma oportunidade para praticar a criação de prompts e explorar o código e as tecnologias utilizadas no desenvolvimento web.

## Funcionalidades

- **Cadastro de objetivos:** título, descrição opcional, prazo e status.
- **Edição e exclusão:** atualize informações ou remova uma meta mediante confirmação.
- **Acompanhamento de status:** marque objetivos como não iniciados, em andamento ou concluídos.
- **Prazos:** visualize metas que vencem hoje ou estão atrasadas e use atalhos para escolher datas.
- **Busca e filtros:** pesquise por título ou descrição e filtre os objetivos por status.
- **Ordenação:** organize por prazo mais próximo ou pelos objetivos criados recentemente.
- **Painel de progresso:** consulte a quantidade de objetivos por status e o percentual concluído.
- **Armazenamento local:** mantenha os objetivos salvos no navegador. No primeiro acesso, a aplicação apresenta exemplos de metas.
- **Interface responsiva:** layout adaptável para diferentes tamanhos de tela.

## Tecnologias

| Tecnologia | Uso no projeto |
| --- | --- |
| **React** | Construção da interface com componentes. |
| **TypeScript** | Tipagem dos dados e componentes. |
| **Vite** | Ambiente de desenvolvimento e geração da versão de produção. |
| **Tailwind CSS** | Estilização da interface. |
| **Lucide React** | Ícones da aplicação. |
| **localStorage** | Armazenamento dos objetivos no navegador. |

O Google AI Studio foi utilizado como ferramenta de apoio ao desenvolvimento. Na versão analisada, o gerenciamento de objetivos é feito localmente e não há uma funcionalidade de IA integrada à interface.

## Como executar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) e npm instalados. Para o Vite 8, use Node.js **20.19+ ou 22.12+**.
- Os arquivos do StudyFlow no computador, obtidos pelo repositório ou pelo download do projeto.

### Instalação

1. Abra o terminal na pasta do StudyFlow, onde está o arquivo `package.json`.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Acesse o endereço informado no terminal, normalmente **http://localhost:3000**.

Para gerar a versão de produção, execute `npm run build`. Para verificar os tipos do projeto, execute `npm run lint`.

### Variáveis de ambiente

O projeto inclui um arquivo `.env.example` com referências a configurações do Google AI Studio. As funcionalidades de objetivos analisadas não utilizam uma chave da API Gemini. Se o projeto for ampliado para usar serviços externos, configure as variáveis necessárias com segurança e não publique chaves no repositório.

## Como usar

1. Clique em **Cadastrar Novo Objetivo**.
2. Informe um título, escolha um prazo e, se desejar, adicione uma descrição.
3. Selecione o status e salve a meta.
4. Use os cartões para atualizar o status, editar ou excluir objetivos.
5. Utilize a busca, os filtros e a ordenação para encontrar suas metas.

## Armazenamento dos dados

Os objetivos ficam salvos no `localStorage` do navegador, sem cadastro de usuário ou sincronização entre dispositivos. Os dados podem ser perdidos se o armazenamento do navegador for limpo. Os exemplos iniciais podem ser editados ou excluídos.

## Estrutura do projeto

```text
studyflow/
├── src/
│   ├── components/      # Componentes da interface
│   ├── services/        # Operações de armazenamento dos objetivos
│   ├── types/           # Tipos e configurações dos objetivos
│   ├── App.tsx          # Componente principal e lógica da interface
│   ├── index.css        # Estilos globais
│   └── main.tsx         # Entrada da aplicação
├── index.html
├── package.json
└── vite.config.ts
```

## Autor

**Caio Victor**  
[GitHub](https://github.com/itscaiou)

---

Projeto desenvolvido para fins de estudo durante a imersão da Alura.

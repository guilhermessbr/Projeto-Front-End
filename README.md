# Hotel Paraíso — Sistema de Reservas

Acesso Vercel: https://frontend-three-pi-f3d9yttdim.vercel.app

Projeto acadêmico de desenvolvimento front-end para organizar reservas e acompanhar hospedagens de um pequeno hotel.

## Problema e objetivo

O controle de reservas em anotações ou planilhas pode dificultar a consulta de hóspedes, o cálculo de valores e o acompanhamento das hospedagens. O sistema reúne essas informações em uma interface com cadastro, cálculo automático e gerenciamento de status.

## Funcionalidades principais

1. **Cadastro de reservas:** registra nome, e-mail, telefone, tipo de quarto, período e número de pessoas. Os campos obrigatórios e a ordem das datas são verificados antes do registro.
2. **Cálculo automático:** calcula a quantidade de noites e multiplica pelo preço da diária do tipo de quarto selecionado.
3. **Gestão de reservas:** permite consultar registros, filtrar por status, alterar entre confirmada, check-in e checkout e cancelar reservas.

### Recursos adicionais

- Calendário com indicação dos dias associados às reservas.
- Histórico agrupado por e-mail do hóspede, com quantidade de reservas e soma dos valores registrados.
- Persistência dos dados no navegador com `localStorage`.
- Exportação das reservas em CSV.
- Limpeza de todos os dados mediante confirmação.

## Tecnologias

- HTML5 semântico: estrutura da página e formulários.
- CSS3 com Flexbox: aparência, organização dos elementos e quebra de linha em telas menores.
- JavaScript puro: eventos, validações, cálculos e atualização da interface.
- Web Storage (`localStorage`): armazenamento local das reservas.

O projeto não utiliza frameworks nem exige instalação de dependências para sua versão atual.

## Estrutura de arquivos

```text
/
├── index.html    # Estrutura e conteúdo da página
├── styles.css    # Estilos e organização com Flexbox
├── app.js        # Lógica e manipulação dos dados
└── README.md     # Documentação
```

Mantenha os arquivos na mesma pasta. O HTML referencia os nomes `styles.css` e `app.js`.

## Como executar

1. Baixe ou clone este repositório.
2. Abra a pasta do projeto no Visual Studio Code.
3. Execute o `index.html` com um servidor local, como a extensão Live Server, caso esteja disponível.
4. Acesse o endereço local exibido pelo servidor no navegador.

Também é possível abrir o `index.html` diretamente para uma visualização inicial. Para testar o armazenamento e a versão final, prefira acessar por um servidor local ou pelo site publicado.

## Como utilizar

1. Preencha os dados fictícios de um hóspede no formulário.
2. Escolha o tipo de quarto e as datas de entrada e saída.
3. Confira o valor calculado e confirme a reserva.
4. Consulte o registro no painel de controle.
5. Use o botão de alteração de status para registrar check-in ou checkout.
6. Utilize o filtro para consultar reservas em uma situação específica.
7. Consulte o calendário e o histórico ou exporte as reservas em CSV.

### Diárias configuradas

| Tipo de quarto | Valor por noite |
| --- | --- |
| Simples | R$ 150,00 |
| Duplo | R$ 250,00 |
| Suíte | R$ 450,00 |

Exemplo: duas noites em quarto simples resultam em R$ 300,00. O número de pessoas é registrado, mas não altera o cálculo atual, que considera o tipo de quarto e a quantidade de noites.

## Organização do código

### HTML

- `header`: cabeçalho do sistema.
- `main`: conteúdo principal.
- `section`: agrupamento das áreas, como cadastro e painel.
- `h2`: títulos das seções.
- `form`, `label`, `input` e `select`: estrutura e campos do cadastro.

### CSS

As classes organizam os estilos dos formulários, cards, botões e calendário. O layout utiliza Flexbox, com propriedades como `display: flex`, `flex-direction` e `flex-wrap`.

### JavaScript

| Função | Responsabilidade |
| --- | --- |
| `criarReserva()` | Verificar dados e registrar uma reserva. |
| `calcularTotal()` | Atualizar o valor exibido no formulário. |
| `calcularDiarias()` | Calcular a quantidade de noites entre duas datas. |
| `renderizarReservas()` | Montar a listagem conforme o filtro selecionado. |
| `alterarStatus()` | Atualizar a situação de uma reserva. |
| `cancelarReserva()` | Remover uma reserva após confirmação. |
| `renderizarCalendario()` | Montar a visualização dos dias do mês. |
| `verificarOcupacao()` | Consultar os períodos registrados para indicar a situação de um dia. |
| `renderizarHistoricoHospedes()` | Agrupar os registros por hóspede. |
| `salvarReservas()` e `carregarReservas()` | Gravar e recuperar os dados locais. |
| `exportarReservas()` | Gerar o arquivo CSV. |
| `atualizarTelas()` | Atualizar calendário, painel e histórico. |
| `buscar()`, `formatarValor()` e `linhaInfo()` | Reutilizar operações e reduzir repetições. |

## Armazenamento e limitações

- As reservas são salvas na chave `reservasHotel` do `localStorage`.
- Os dados pertencem ao navegador e à origem em que o sistema é acessado; não são sincronizados entre dispositivos ou navegadores.
- Não existe servidor de aplicação, banco de dados compartilhado ou autenticação nesta versão.
- O calendário não controla quartos individuais nem a quantidade disponível por categoria.
- O cadastro não bloqueia reservas com períodos sobrepostos. Portanto, esta versão não deve ser tratada como um controle completo de disponibilidade.
- O histórico é calculado a partir das reservas existentes. Ao cancelar uma reserva, ela deixa de compor esse histórico; não existe registro separado de cancelamentos.
- O total apresentado no histórico soma os valores das reservas, não pagamentos efetivamente recebidos.
- A ação de limpar os dados remove os registros locais. O CSV exportado não possui função de importação nesta versão.

Utilize dados fictícios nas demonstrações. Esta é uma aplicação acadêmica, não uma solução pronta para uso em produção com dados reais de hóspedes.

## Checklist de testes

- [ ] Registrar uma reserva com dados válidos.
- [ ] Conferir duas noites em quarto simples com total de R$ 300,00.
- [ ] Verificar a rejeição de saída anterior ou igual à entrada.
- [ ] Alterar o status e aplicar os filtros.
- [ ] Navegar entre os meses do calendário.
- [ ] Recarregar a página e verificar a persistência dos dados.
- [ ] Conferir o agrupamento no histórico.
- [ ] Cancelar uma reserva e verificar a atualização das telas.
- [ ] Exportar reservas e abrir o CSV.
- [ ] Testar a limpeza dos dados usando apenas registros fictícios.
- [ ] Conferir o layout em computador e celular.

## Publicação

O projeto pode ser publicado como site estático. Antes da entrega, confira se a hospedagem utiliza a versão final dos arquivos e se o link público abre corretamente.

- Site publicado: **adicionar o link após a publicação**.
- Repositório: **adicionar o link deste repositório**.

## Equipe

Substitua os campos abaixo pelos nomes dos integrantes:

1. Nome do integrante 1
2. Nome do integrante 2
3. Nome do integrante 3
4. Nome do integrante 4
5. Nome do integrante 5

## Contexto acadêmico

Projeto Prático de Desenvolvimento Front-End — Sistema Empresarial.

A entrega deve incluir repositório público com histórico de commits e sistema publicado. A apresentação deve ocorrer ao vivo no navegador, com exibição do código no GitHub, sem slides, durante 5 a 8 minutos e com todos os integrantes presentes.

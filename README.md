# Catálogo Devs

Catálogo com **2 landing pages** para empresas de desenvolvimento de software, pensadas para campanhas de Google Ads.

**As duas páginas trazem as quatro frentes completas — desenvolvimento, manutenção, servidores e firewall e aplicativos — com o mesmo peso:** descrição, entregas, botão de orçamento que já seleciona o serviço no formulário e respostas no FAQ para cada uma. Nenhuma página é dedicada a um serviço só; o que muda entre elas é a identidade visual, o tom e os recursos de conversão.

| # | Modelo | Estilo | Destaques | Visual |
|---|--------|--------|-----------|--------|
| 01 | [Bastião Tecnologia & Segurança](landing-pages/bastiao/index.html) | Técnica e escura | Terminal animado, autodiagnóstico com sinais das quatro frentes e diagrama de como tudo se conecta | Escuro técnico, verde terminal · Space Grotesk + IBM Plex + JetBrains Mono |
| 02 | [Vetor Software House](landing-pages/vetor/index.html) | Suíça e assertiva | Orçamento em 3 etapas no hero, serviços em abas, modelos de contratação e números em destaque | Suíço/brutalista, azul elétrico e lima · Archivo |

A página inicial ([`index.html`](index.html)) é a vitrine: mostra as prévias, as características de cada modelo e permite ver cada página em desktop, tablet e celular sem sair do catálogo.

> Todas as empresas, números, cases, depoimentos, telefones (`(11) 90000-0000`) e e-mails (`@*.example`) são **fictícios** e servem apenas como demonstração. As landing pages vêm com `<meta name="robots" content="noindex">` para não aparecerem no Google enquanto forem demonstrações.

## Como visualizar

Não há build nem dependências: é HTML, CSS e JavaScript puro.

- **Direto no navegador:** abra o arquivo `index.html`.
- **Servidor local (opcional):**

  ```bash
  python3 -m http.server 8000
  ```

  e acesse `http://localhost:8000`.
- **GitHub Pages:** em *Settings → Pages*, escolha *Deploy from a branch*, selecione a branch e a pasta `/ (root)`.

## Estrutura

```
index.html                  catálogo (vitrine dos modelos)
assets/
  catalog.css, catalog.js   estilos e pré-visualização do catálogo
  previews/                 capturas usadas nos cartões do catálogo
  shared/
    base.css                reset, utilidades e estados comuns
    lp.js                   comportamentos compartilhados (formulários, abas, simuladores…)
landing-pages/
  bastiao/   vetor/
    index.html              conteúdo da página
    style.css               identidade visual (variáveis no topo)
scripts/capturar-previews.js  regenera as imagens de assets/previews
```

## O que toda landing page inclui

- **As quatro frentes completas:** seção de serviços com desenvolvimento, manutenção, servidores e firewall e aplicativos, cada um com entregas e botão que já marca o serviço no formulário; campo “Serviço de interesse” com as quatro opções e “Mais de um serviço”; FAQ cobrindo todas as frentes.
- **Palavras-chave das buscas** na headline e nas seções (software sob medida, manutenção de sistemas, firewall gerenciado, desenvolvimento de aplicativos), então qualquer grupo de anúncios pode apontar para qualquer modelo.
- **Formulário de lead** com validação em português, máscara de WhatsApp, foco no primeiro erro e tela de sucesso com atalho para o WhatsApp levando o resumo do que foi preenchido.
- **Parâmetros de campanha preservados:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `gbraid`, `wbraid` e a página de origem são enviados como campos ocultos.
- **Eventos de conversão no `dataLayer`:** `generate_lead` (envio do formulário) e `whatsapp_click` (qualquer link de WhatsApp, com `link_location`).
- **Prova social, processo, cases, FAQ** e botão flutuante de WhatsApp.
- **Responsiva e acessível:** navegação por teclado, link “pular para o conteúdo”, contraste adequado e animações desligadas para quem prefere menos movimento. Sem JavaScript, o conteúdo continua visível e os formulários usam a validação nativa do navegador.

## Como adaptar um modelo para uma empresa real

1. **Copie** a pasta `landing-pages/<modelo>` junto com `assets/shared` (ajuste os caminhos `../../assets/shared/` se mudar a estrutura).
2. **Marca e textos:** troque nome, logo (SVG inline no HTML), textos, cases e depoimentos. Cores e fontes ficam nas variáveis no topo do `style.css`; o link das Google Fonts fica no `<head>`.
3. **WhatsApp:** substitua `5511900000000` (DDI + DDD + número) em todo o `index.html` — ele aparece nos links `wa.me` e no atributo `data-whatsapp` do `<body>`. A mensagem inicial de cada formulário fica em `data-wa-intro`.
4. **Receber os leads:** por padrão o formulário valida, mostra a tela de sucesso e oferece continuar no WhatsApp. Para enviar os dados a um serviço, adicione `action` ao `<form>`:

   ```html
   <form class="lead-form" method="post" data-lead-form action="https://formspree.io/f/SEU_ID" …>
   ```

   O envio é feito via `fetch` (POST com `FormData`). Funciona com Formspree, Getform, webhooks de RD Station/HubSpot/Make/Zapier ou uma API própria. Se o envio falhar, o visitante vê uma mensagem de erro e o caminho pelo WhatsApp continua disponível.
5. **Rastreamento:** instale o Google Tag Manager no `<head>` e crie gatilhos de *evento personalizado* para `generate_lead` e `whatsapp_click` (conversões do Google Ads/GA4).
6. **Publicação:** remova a meta tag `noindex`, preencha `og:url`/`og:image` se quiser, e troque os dados de rodapé (razão social, CNPJ, endereço, política de privacidade).

## Recursos do `lp.js` (por atributo)

| Atributo | Onde usar | O que faz |
|----------|-----------|-----------|
| `data-lead-form` | `<form>` | Validação, campos ocultos de campanha, envio (com ou sem `action`), evento `generate_lead` e tela de sucesso (`[data-form-success]`, `[data-success-name]`, `[data-success-whatsapp]`). |
| `data-mask="phone"` | `<input type="tel">` | Máscara `(11) 91234-5678`; aceita números colados com `+55`. |
| `data-step` | blocos dentro do formulário | Formulário em etapas com `[data-step-next]`, `[data-step-prev]`, `[data-step-status]` e `[data-step-progress]`. |
| `data-prefill="campo=valor"` | links e botões | Preenche um campo do formulário antes de rolar até ele (serviço escolhido, plano). |
| `data-tabs` | contêiner de abas | Abas acessíveis (`role="tab"`/`tabpanel`) com setas, Home e End. |
| `data-risk` | autodiagnóstico | Soma os pesos (`data-weight`) das caixas marcadas, mostra o nível (`data-risk-level`) e prepara a mensagem do formulário. |
| `data-count` | números | Contagem animada ao aparecer na tela (`data-prefix`, `data-suffix`, `data-decimals`). |
| `data-reveal` | qualquer bloco | Revelação suave ao rolar (`style="--delay: .1s"` para escalonar). |
| `data-js-only` / `data-no-js` | qualquer elemento | Mostra só com JavaScript ativo / só sem JavaScript. |
| `data-header`, `data-nav`, `data-nav-toggle` | cabeçalho | Estado ao rolar e menu mobile. |

## Atualizar as prévias do catálogo

Depois de mudar o visual de alguma página, regenere as imagens de `assets/previews`:

```bash
npm install
```

```bash
npx playwright install chromium
```

```bash
npm run previews
```

## Referências

A estrutura segue o padrão das landing pages de software houses anunciadas no Google (hero com proposta clara e formulário, prova social, dores, serviços, processo, cases, FAQ e CTA final com WhatsApp). Os textos, marcas e layouts deste repositório são originais.

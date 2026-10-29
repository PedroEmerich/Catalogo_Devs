/*
 * Catálogo Devs — pré-visualização das landing pages em tamanhos de tela diferentes.
 * Sem suporte a <dialog>, os botões continuam escondidos e os links normais seguem funcionando.
 */
(() => {
  'use strict';

  const dialog = document.getElementById('viewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const stage = dialog.querySelector('.viewer__stage');
  const frame = dialog.querySelector('.viewer__frame');
  const iframe = frame.querySelector('iframe');
  const title = dialog.querySelector('.viewer__title');
  const openLink = dialog.querySelector('.viewer__open');
  const deviceButtons = Array.from(dialog.querySelectorAll('[data-device]'));
  const WIDTHS = { desktop: 1440, tablet: 820, mobile: 390 };
  const GAP = 16;
  let device = 'desktop';

  // Encaixa a "tela" no espaço disponível, reduzindo a escala quando ela não cabe.
  const fit = () => {
    frame.classList.toggle('is-device', device !== 'desktop');
    frame.style.width = `${WIDTHS[device]}px`;
    const border = frame.offsetWidth - WIDTHS[device]; // moldura do aparelho; 0 no desktop
    const scale = Math.min(1, (stage.clientWidth - GAP * 2) / frame.offsetWidth);
    frame.style.height = `${(stage.clientHeight - GAP * 2) / scale - border}px`;
    frame.style.transform = `translateX(-50%) scale(${scale})`;
  };

  const setDevice = (next) => {
    device = next;
    deviceButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.device === next)));
    fit();
  };

  deviceButtons.forEach((button) => button.addEventListener('click', () => setDevice(button.dataset.device)));

  document.querySelectorAll('[data-preview]').forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', () => {
      const url = button.dataset.preview;
      title.textContent = button.dataset.name;
      iframe.title = `Pré-visualização: ${button.dataset.name}`;
      iframe.src = url;
      openLink.href = url;
      dialog.showModal();
      setDevice(window.innerWidth < 700 ? 'mobile' : 'desktop');
    });
  });

  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  // Clique no fundo escurecido (fora da janela) também fecha.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    iframe.src = 'about:blank';
  });

  new ResizeObserver(() => {
    if (dialog.open) fit();
  }).observe(stage);
})();

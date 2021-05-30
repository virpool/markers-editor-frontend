import './modal.less';

let isVisible = false;

const show = (templateId, onHide) => {
  if (isVisible) throw new Error('Modal is already shown');

  const $background = document.createElement('div');
  $background.classList.add('modal-background');
  document.body.appendChild($background);
  const $modal = document.createElement('div');
  $modal.classList.add('modal');
  document.body.appendChild($modal);

  $modal.innerHTML = document.querySelector(templateId).innerHTML;

  const handleKeyPress = (e) => {
    if (e.keyCode === 27) {
      hide();
    }
  }

  const hide = () => {
    if (!isVisible) throw new Error('Modal is already hidden');

    $background.removeEventListener('click', hide, false);
    document.removeEventListener('keyup', handleKeyPress, false);
    $background.parentElement.removeChild($background);
    $modal.parentElement.removeChild($modal);
    isVisible = false;

    if (onHide) onHide();
  }

  $background.addEventListener('click', hide, false);
  document.body.addEventListener('keyup', handleKeyPress);

  isVisible = true;

  return hide;
}

export { show };
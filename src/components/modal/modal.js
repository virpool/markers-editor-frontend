import './modal.less';
import * as focusTrap from 'focus-trap';

let isVisible = false;
let modalFocusTrap;

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
    // escape
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

    modalFocusTrap.deactivate();
    modalFocusTrap = null;

    if (onHide) onHide();
  }

  $background.addEventListener('click', hide, false);
  document.addEventListener('keyup', handleKeyPress);

  modalFocusTrap = focusTrap.createFocusTrap([$modal, $background]);
  modalFocusTrap.activate();

  isVisible = true;

  return hide;
}

export { show };
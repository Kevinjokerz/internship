class Modal {
  constructor(modalId, closeBtnId, onClose = null) {
    this.modal = document.getElementById(modalId);
    this.closeBtn = document.getElementById(closeBtnId);
    this.onClose = onClose;
    this.init();
  }

  init() {
    this.closeBtn.addEventListener("click", () => {
      this.hide();
      if (this.onClose) this.onClose();
    });
    window.addEventListener("click", (event) => {
      if (event.target === this.modal) {
        this.hide();
        if (this.onClose) this.onClose();
      }
    });
  }

  show() {
    this.modal.style.display = "block";
  }

  hide() {
    this.modal.style.display = "none";
  }
}

export { Modal };

function canShowModal(vm) {
  return {
    init() {
      // Modal elements
      this.modal = document.getElementById("modal");
      this.modalTitle = document.getElementById("modal-title");
      this.modalMessage = document.getElementById("modal-message");
      this.modalOk = document.getElementById("modal-ok");
      this.modalCancel = document.getElementById("modal-cancel");
      this.modalCancel.addEventListener('click', () => this.modal.close());
    },
    showModal(title, message, onOk) {
      this.modalTitle.textContent = title;
      this.modalMessage.innerHTML = message;

      const newOk = this.modalOk.cloneNode(true);
      this.modalOk.parentNode.replaceChild(newOk, this.modalOk);
      this.modalOk = newOk;

      this.modalOk.addEventListener("click", () => {
        if (onOk) {
          onOk();
        }
        this.modal.close();
      });

      this.modal.showModal();
    },
    close() {
      this.modal.close();
    }
  };
}

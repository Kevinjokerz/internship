class Form {
    constructor(formId, onSubmit) {
        this.form = document.getElementById(formId);
        this.onSubmit = onSubmit;
        this.init();
    }

    init() {
        this.form.addEventListener("submit", async (event) => {
            event.preventDefault();
            await this.onSubmit(this.getFormData());
        });
    }

    getFormData() {
        const formData = new FormData(this.form);
        return Object.fromEntries(formData.entries());
    }

    reset() {
        this.form.reset();
    }
}

export { Form };
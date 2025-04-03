export function createRequiredFieldValidator(containerSelector, options = {}) {
    const emptyClass = options.emptyClass || "empty-field";
    const requiredClass = options.requiredClass || "required";
    const container = document.querySelector(containerSelector);

    function markFieldAsEmpty(element, isEmpty) {
        const cell = element.tagName === "TD" ? element : element.closest("td") || element;
        cell.classList.toggle(emptyClass, isEmpty);
    }

    function isEmptyValue(element) {
        if(element.tagName === "TD" && element.isContentEditable) {
            return element.innerText.trim() === "";
        } else if(element.tagName === "SELECT" || element.tagName === "INPUT") {
            return element.value.trim() === "";
        }
        return false
    }

    function attachValidationListeners(element) {
        const validateField = () => markFieldAsEmpty(element, isEmptyValue(element));
        element.addEventListener("input", validateField);
        element.addEventListener("change", validateField);
        element.addEventListener("blur", validateField);
    }

    function initialize() {
        const requiredFields = container.querySelectorAll(`.${requiredClass}`);
        requiredFields.forEach((field) => {
            attachValidationListeners(field);
            markFieldAsEmpty(field, isEmptyValue(field))
        })
    }

    function validateAll() {
        const requiredFields = container.querySelectorAll(`.${requiredClass}`);
        const emptyFields = Array.from(requiredFields).filter(isEmptyValue);
        emptyFields.forEach((field) => markFieldAsEmpty(field, true));
        if(emptyFields.length > 0) {
            alert("Please fill out the required fields");
            return false;
        }
        return true;
    }

    function clearHighLights() {
        const highlightedFields = container.querySelectorAll(`.${emptyClass}`);
        highlightedFields.forEach((field) => field.classList.remove(emptyClass));
    }

    return { initialize, validateAll, clearHighLights };
}
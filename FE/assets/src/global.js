async function fetchAPI(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText);
      alert("Fetch Error, please try again");
      throw new Error(errorText);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching from:", url, error);
    throw error;
  }
}

async function fetchCourse() {
  return fetchAPI("http://localhost:3000/api/sample/degree-plan");
}

async function fetchAllCourses() {
  return fetchAPI("http://localhost:3000/api/sample/get-all-courses");
}

async function fetchDepartment() {
  return fetchAPI("http://localhost:3000/api/sample/get-all-subject-category");
}

function initModal(modalId, closeBtnId) {
  const modal = document.getElementById(modalId);
  const closeModalBtn = document.getElementById(closeBtnId);
  if (modal && closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  }
}

function initSaveCancelButtons(saveBtnId, cancelBtnId, onSave, onCancel) {
  const saveBtn = document.getElementById(saveBtnId);
  const cancelBtn = document.getElementById(cancelBtnId);
  if (saveBtn) {
    saveBtn.addEventListener("click", onSave);
  }
  if (cancelBtn) {
    cancelBtn.addEventListener("click", onCancel);
  }
}

function updateSaveButton({
  saveButton,
  modifiedSelector = "td.modified",
  noChangesMessage = "No changes to save",
  saveMessage = "Save Changes",
} = {}) {
  const saveBtn = typeof saveButton === "string" ? document.getElementById(saveButton) : saveButton;
  if(!saveBtn) {
    console.error("Save Button not found");
    return;
  }
  const modifiedCells = document.querySelectorAll(modifiedSelector);
  saveBtn.disabled = modifiedCells.length === 0;
  saveBtn.title = modifiedCells.length === 0 ? noChangesMessage : saveMessage;
}

function createRequiredFieldValidator(containerSelector, options) {
  options = options || {};
  const emptyClass = options.emptyClass || "empty-field";
  const requiredClass = options.requiredClass || "required";

  const container = document.querySelector(containerSelector);
  if (!container) {
    throw new Error(
      'Container with selector "' + containerSelector + '" not found.'
    );
  }

  function markFieldAsEmpty(element, isEmpty) {
    const cell =
      element.tagName === "TD" ? element : element.closest("td") || element;
    if (isEmpty) {
      cell.classList.add(emptyClass);
    } else {
      cell.classList.remove(emptyClass);
    }
  }

  function isEmptyValue(element) {
    if (element.tagName === "TD" && element.isContentEditable) {
      return element.innerText.trim() === "";
    } else if (element.tagName === "SELECT") {
      return element.value === "";
    } else if (element.tagName === "INPUT") {
      return element.value.trim() === "";
    }
    return false;
  }

  function attachValidationListeners(element) {
    function validateField() {
      const isEmpty = isEmptyValue(element);
      markFieldAsEmpty(element, isEmpty);
    }

    if (element.tagName === "TD" && element.isContentEditable) {
      element.addEventListener("input", validateField);
      element.addEventListener("blur", validateField);
    } else if (element.tagName === "SELECT") {
      element.addEventListener("change", validateField);
      element.addEventListener("blur", validateField);
    } else if (element.tagName === "INPUT") {
      element.addEventListener("input", validateField);
      element.addEventListener("blur", validateField);
    }
  }

  function initialize() {
    const requiredFields = container.querySelectorAll("." + requiredClass);
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      attachValidationListeners(field);
      const isEmpty = isEmptyValue(field);
      markFieldAsEmpty(field, isEmpty);
    }
  }

  function validateAll() {
    const requiredFields = container.querySelectorAll("." + requiredClass);
    let emptyFields = [];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (isEmptyValue(field)) {
        emptyFields.push(field);
      }
    }

    for (let i = 0; i < emptyFields.length; i++) {
      markFieldAsEmpty(emptyFields[i], true);
    }

    if (emptyFields.length > 0) {
      alert("Please fill out the required fields");
    }

    return emptyFields.length === 0;
  }

  function clearHighLights() {
    const highlightedFields = container.querySelectorAll("." + emptyClass);
    for (let i = 0; i < highlightedFields.length; i++) {
      highlightedFields[i].classList.remove(emptyClass);
    }
  }

  return {
    initialize: initialize,
    validateAll: validateAll,
    clearHighLights: clearHighLights,
  };
}

function setupDeleteButton({containerSelector, buttonSelector, idAttribute, deleteFunction, reloadFunction, itemName}) {
  const container = document.querySelector(containerSelector);
  if(!container) {
    console.error(`Container with selector ${containerSelector} not found`);
    return;
  }

  container.addEventListener("click", async (event) => {
    const button = event.target.closest(buttonSelector);
    if(!button) return;

    const itemId = button.getAttribute(idAttribute);
    if(!itemId) {
      console.error(`ID attribute ${idAttribute} not found on button`);
      return;
    }

    if(confirm(`Are you sure you want to delete ${itemName} with ID ${itemId}?`)) {
      try {
        await deleteFunction(itemId);
        await reloadFunction();
      } catch (error) {
        console.error(`Error deleting ${itemName}:`, error);
        alert(`Error deleting ${itemName}: ${error}`)
      }
    }
  });
}

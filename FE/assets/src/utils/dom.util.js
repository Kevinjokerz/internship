export function updateSaveButton({saveButton, modifiedSelector = "td.modified", noChangesMessage = "No Changes to save", saveMessage = "Save Changes"}) {
    const saveBtn = document.getElementById(saveButton);
    const modifiedCells = document.querySelectorAll(modifiedSelector);
    saveBtn.disabled = modifiedCells.length === 0;
    saveBtn.title = modifiedCells.length === 0 ? noChangesMessage : saveMessage;
}
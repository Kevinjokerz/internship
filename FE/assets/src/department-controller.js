let departments = [];

async function loadDepartment() {
    const deparmentInfo = await fetchDepartment();
    const tableBody = document.getElementById("department-table-body");
    tableBody.innerHTML= "";

    departments = []
    deparmentInfo.forEach((department, index) => {
        departments.push({
            departmentId: department.categoryId,
            departmentName: department.categoryName,
            isActive: department.isActive,
        })
        const row = document.createElement("tr");
        row.classList.add("department-row");
        row.innerHTML = `
        <td>${department.categoryId}</td>
        <td contenteditable="true" class="editable required" data-field="departmentName" data-index="${index}" data-initial-value="${department.categoryName}">${department.categoryName}</td>
        <td contenteditable="false" data-field="isActive" data-index="${index}" data-initial-value="${department.isActive}">
            <input type="checkbox" ${department.isActive ? "checked" : ""} class="editable">
        </td>
        <td class="delete-column">
            <button class="delete-btn" data-id="${department.categoryId}"><i class="fa-solid fa-trash"></i></button>
        </td>
        `;
        tableBody.appendChild(row)
    });

    const requiredFieldValidator = createRequiredFieldValidator("#department-table-body");
    requiredFieldValidator.initialize();

    const editableCells = document.querySelectorAll('td[contenteditable="true"]');
    editableCells.forEach((cell) => {
        cell.addEventListener("input", () => {
            const initialValue = cell.getAttribute('data-initial-value');
            const currentValue = cell.innerText;
            if(currentValue !== initialValue) {
                cell.classList.add("modified");
            } else {
                cell.classList.remove("modified");
            }
            updateSaveButton({ saveButton: "save-btn" });
        })
    });

    const checkboxes = document.querySelectorAll('input[type="checkbox"].editable')
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            const cell = checkbox.closest('td');
            const initialValue = cell.getAttribute('data-initial-value') === "true";
            const currentValue = checkbox.checked;
            if(currentValue !== initialValue) {
                cell.classList.add("modified");
            } else {
                cell.classList.remove("modified");
            }
            updateSaveButton({ saveButton: "save-btn" });
        })
    })
    updateSaveButton({ saveButton: "save-btn" });
}

async function deleteDepartment(departmentId) {
    try {
        const response = await fetch(
          `http://localhost:3000/api/sample/delete-department/${departmentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
          });

        if(response.ok) {
            alert("Department deleted successfully");
            await loadDepartment();
            window.scrollTo({top: 0, behavior: "instant"});
        } else {
            const data = await response.json();
            throw new Error(data.error);
        }
    } catch (error) {
        console.error("Error deleting department:", error);
        throw error;
    }
}

function revertChanges() {
  const modifiedCells = document.querySelectorAll("td.modified");
  modifiedCells.forEach((cell) => {
    const field = cell.getAttribute("data-field");
    const initialValue = cell.getAttribute("data-initial-value");
    if (field === "isActive") {
      const checkbox = cell.querySelector('input[type="checkbox"]');
      checkbox.checked = initialValue === "true";
    } else {
      cell.innerText = initialValue;
    }
    cell.classList.remove("modified");
  });

  const requiredFieldValidator = createRequiredFieldValidator("#department-table-body");
  requiredFieldValidator.clearHighLights();
  requiredFieldValidator.initialize();

  updateSaveButton({ saveButton: "save-btn" });
  alert("All changes have been reverted.");
}

async function handleSaveDepartment(tableBodySelector) {
    const requiredFieldValidator = createRequiredFieldValidator(tableBodySelector);
    if(!requiredFieldValidator.validateAll()) {
        return;
    }
    const rows = document.querySelectorAll(tableBodySelector + " tr");

    const updateDepartments = [];

    rows.forEach((row, index) => {
        const department = departments[index]
        const modifiedCells = row.querySelectorAll('td.modified');
        if(modifiedCells.length === 0) return;

        const updatedDepartment = {
            categoryId: department.departmentId,
            categoryName: row.querySelector('td[data-field="departmentName"]').innerText.trim(),
            isActive: row.querySelector('td[data-field="isActive"] input[type="checkbox"]').checked,
        }

        const departmentFields = ["departmentName", "isActive"];
        const hasDepartmentModified = Array.from(modifiedCells).some(
            (cell) => {
            const field = cell.getAttribute("data-field");
            return departmentFields.includes(field);
            }
        );

        if (hasDepartmentModified) {
            const modifiedDepartment = {
            categoryId: updatedDepartment.categoryId,
            };

            if(row.querySelector('td[data-field="departmentName"]').classList.contains('modified')) {
                modifiedDepartment.categoryName = updatedDepartment.categoryName;
            }

            if(row.querySelector('td[data-field="isActive"]').classList.contains('modified')) {
                modifiedDepartment.isActive = updatedDepartment.isActive;
            }
            updateDepartments.push(modifiedDepartment);
        }
    })


    const payload = {
        payload: {
            updateDepartment: updateDepartments
        }
    }

    try {
        const response = await fetch(
          "http://localhost:3000/api/sample/modify-department",
          {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(payload)
          }
        );

        const data = await response.json();
        if(response.ok) {
            alert(data.message);
            loadDepartment();
            return;
        }else {
            throw new Error(data.error || "Failed to update department")
        }
    } catch (error) {
        console.error("Error saving data:", error);
        alert("Error saving data: " + error);
    }


}

document.addEventListener("DOMContentLoaded", () => {
    loadDepartment();
    initSaveCancelButtons("save-btn", "cancel-btn", () => {
        handleSaveDepartment('#department-table-body');
    }, () => {
        revertChanges();
        window.scrollTo({top: 0, behavior: "instant"})
    });

    setupDeleteButton({
        containerSelector: "#department-table-body",
        buttonSelector: ".delete-btn",
        idAttribute: "data-id",
        deleteFunction: deleteDepartment,
        reloadFunction: loadDepartment,
        itemName: "department",
    })
})
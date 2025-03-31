let colleges = [];
let academicMaps = []
const degreeTypes = ["Bachelor of Science", "Bachelor of Art"]

async function loadAcademicMap() {
    try {
        const academicMapData = await fetchAcademicMap();
        const collegeData = await fetchCollege();
        const tableBody = document.getElementById("academic-map-table-body");
        tableBody.innerHTML="";

        colleges = collegeData.filter((college) => college.isActive)
                              . map((college) => college.collegeName);

        academicMapData.forEach((academicMap, index) => {
            const isValidCollege = colleges.includes(academicMap.college.collegeName);
            const isValidDegreeType = degreeTypes.includes(academicMap.degreeType)
            academicMaps.push({
                academicMapId: academicMap.academicMapId,
                degreeType: academicMap.degreeType,
                major: academicMap.major,
                sortOrder: academicMap.sortOrder,
                college: academicMap.college.collegeName,
            });

            const row = document.createElement("tr");
            row.classList.add("academic-map-row");
            row.innerHTML = `
            <td>${academicMap.academicMapId}</td>
            <td data-field="degreeType" data-index="${index}" data-initial-value="${academicMap.degreeType}" ${!isValidDegreeType ? 'class="invalid-degree-type"' : ""}>
                <select class="editable required" aria-label="Select Degree Type" required>
                  <option value="">Select...</option>
                    ${degreeTypes.map((degree) => {
                        const isSelected = degree === academicMap.degreeType ? 'selected' : '';
                        return `<option value="${degree}" ${isSelected}>${degree}</option>`;
                    }).join("")}
                    ${!isValidDegreeType && academicMap.degreeType ? `<option value="${academicMap.degreeType}" disabled selected>${academicMap.degreeType} (Inactive)</option>` : ""}
                </select>
            </td>
            <td contenteditable="true" class="editable required" data-field="major" data-index="${index}" data-initial-value="${academicMap.major}">${academicMap.major}</td>
            <td data-field="college" data-index="${index}" data-initial-value="${academicMap.college.collegeName}" ${!isValidCollege ? 'class="invalid-college"' : ""}>
                <select class="editable required" aria-label="Select College" required>
                  <option value="">Select...</option>
                    ${colleges.map((college) => {
                        const isSelected = college === academicMap.college.collegeName ? 'selected' : '';
                        return `<option value="${college}" ${isSelected}>${college}</option>`;
                    }).join("")}
                    ${!isValidCollege && academicMap.college.collegeName ? `<option value="${academicMap.college.collegeName}" disabled selected>${academicMap.college.collegeName} (Inactive)</option>` : ""}
                </select>
            </td>
            <td data-field="sortOrder" data-index="${index}" data-initial-value="${academicMap.sortOrder}">
                <input type="number" class="editable number-input sort-order required" min="0" step="1" value="${academicMap.sortOrder}" required aria-label="Sort Order">
            </td>
            <td contenteditable="false" data-field="isActive" data-index="${index}" data-initial-value="${academicMap.isActive}">
                <input type="checkbox" ${academicMap.isActive ? "checked" : ""} class="editable">
            </td>
            <td class="actions">
              <button class="edit-btn" data-index="${index}" onclick="handleEdit(${academicMap.academicMapId})"><i class="fa-solid fa-pen-to-square"></i></button>
              <button class="view-btn" data-index="${index}" onclick="handleView(${academicMap.academicMapId})"><i class="fa-solid fa-eye"></i></button>
            </td>
            <td class="delete-column">
              <button class="delete-btn" data-id="${academicMap.academicMapId}"><i class="fa-solid fa-trash"></i></button>
            </td>
            `;
            tableBody.appendChild(row)
        });


        const requiredFieldValidator = createRequiredFieldValidator("#academic-map-table-body");
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

        const sortOrderInputs = document.querySelectorAll('input.sort-order');
        for(let i = 0; i < sortOrderInputs.length; i++){
            const input = sortOrderInputs[i];
            input.addEventListener("input",function () {
                const cell = this.closest("td");
                const initialValue = cell.getAttribute("data-initial-value");
                let currentValue = this.value;

                if(currentValue === "" || parseInt(currentValue, 10) < 0) {
                this.value = 0;
                currentValue = "0";
                alert("Sort Order must be 0 or greater");
                }

                if (currentValue !== initialValue) {
                cell.classList.add("modified");
                } else {
                cell.classList.remove("modified");
                }
                updateSaveButton({ saveButton: "save-btn" });
            });

            input.addEventListener("blur", function () {
                const cell = this.closest("td");
                const initialValue = cell.getAttribute("data-initial-value");
                let currentValue = this.value;

                if (currentValue === "" || parseInt(currentValue, 10) < 0) {
                this.value = 0;
                currentValue = "0";
                alert("Sort Order must be 0 or greater");
                }

                if (currentValue !== initialValue) {
                cell.classList.add("modified");
                } else {
                cell.classList.remove("modified");
                }
                updateSaveButton({ saveButton: "save-btn" });
            });

            input.addEventListener("keydown", function (e) {
                if(["Backspace", "ArrowLeft", "ArrowRight", "Tab"].indexOf(e.key) !== -1) return;
                if(!/^[0-9]$/.test(e.key)) {
                e.preventDefault();
            }
            })
        }


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
        });


        const dropboxes = document.querySelectorAll('select[class~="editable"]')
        dropboxes.forEach((dropbox) => {
            dropbox.addEventListener("change", () => {
            const cell = dropbox.closest("td");
            const initialValue = cell.getAttribute("data-initial-value");
            const currentValue = dropbox.value;
            if(currentValue !== initialValue) {
                cell.classList.add('modified');
            } else {
                cell.classList.remove('modified')
            }
            updateSaveButton({ saveButton: "save-btn" });
            })
        })
        updateSaveButton({ saveButton: "save-btn" });
    } catch (error) {
        console.error("Error loading academic map:", error);
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
    } else if (field === "college" || field === "degreeType") {
        const select = cell.querySelector("select.editable");
        select.value = initialValue;
    } else if (field === "sortOrder") {
        const input = cell.querySelector("input[type='number']");
        input.value = initialValue;
    } else {
      cell.innerText = initialValue;
    }
    cell.classList.remove("modified");
  });

  const requiredFieldValidator = createRequiredFieldValidator(
    "#academic-map-table-body"
  );
  requiredFieldValidator.clearHighLights();
  requiredFieldValidator.initialize();

  updateSaveButton({ saveButton: "save-btn" });
  alert("All changes have been reverted.");
}

async function handleSaveAcademicMaps(tableBodySelector) {
    const requiredFieldValidator = createRequiredFieldValidator(tableBodySelector);
    if (!requiredFieldValidator.validateAll()) {
    return;
  }


  let invaliDegreeType = [];
  let invalidColleges = [];
  let invalidSortOrder =[];

  const degreeTypeSelects = document.querySelectorAll('td[data-field="degreeType"] select');
  for (let i = 0; i < degreeTypeSelects.length; i++){
    const select = degreeTypeSelects[i];
    if(select.value && degreeTypes.indexOf(select.value) === -1) {
        invaliDegreeType.push(select)
    }
  }

  const collegeSelects = document.querySelectorAll('td[data-field="college"] select');
  for (let i = 0; i < collegeSelects.length; i++) {
    const select = collegeSelects[i];
    if(select.value && colleges.indexOf(select.value) === -1) {
        invalidColleges.push(select)
    }
  }

  if(invaliDegreeType.length > 0) {
    alert("Please select a valid degree type.");
    return;
  }

  if(invalidColleges.length > 0) {
    alert("Please select a valid college.");
    return;
  }


  const sortOrderInputs = document.querySelectorAll('td[data-field="sortOrder"] input');
  for(let i = 0; i < sortOrderInputs.length; i++) {
    const input = sortOrderInputs[i];
    const value = parseInt(input.value, 10);
    if(!validateSortOrders(value)) {
        invalidSortOrder.push(input);
    }
  }

  if(invalidSortOrder.length > 0) {
    alert("Please ensure all sort order are positive and greater than 0.");
    for(let i = 0; i < invalidSortOrder.length; i++) {
        invalidSortOrder[i].value = 0;
        alert("Sort Order must be equal or greater than 0")
    }
    return;
  }


  const updateAcademicMaps = [];
  const rows = document.querySelectorAll(tableBodySelector + " tr");

  rows.forEach((row, index) => {
    const academicMap = academicMaps[index]
    const modifiedCells = row.querySelectorAll("td.modified");

    if(modifiedCells.length === 0) return;

    const updatedAcademicMap = {
      academicMapId: academicMap.academicMapId,
      degreeType: row.querySelector('td[data-field="degreeType"] select').value,
      major: row.querySelector('td[data-field="major"]').innerText.trim(),
      college: row.querySelector('td[data-field="college"] select').value,
      sortOrder: parseInt(row.querySelector('td[data-field="sortOrder"] input').value, 10),
      isActive: row.querySelector('td[data-field="isActive"] input[type="checkbox"]').checked,
    };

    const academicMapFields = ["degreeType", "major", "college", "sortOrder", "isActive"];
    const hasModified  = Array.from(modifiedCells).some((cell) => {
        const field = cell.getAttribute("data-field");
        return academicMapFields.includes(field);
    });

    if(hasModified) {
        const modifiedAcademicMap = {
            academicMapId: updatedAcademicMap.academicMapId,
        };

        if(row.querySelector('td[data-field="degreeType"]').classList.contains("modified") ||
            row.querySelector('td[data-field="major"]').classList.contains("modified")) {
            modifiedAcademicMap.degreeType = updatedAcademicMap.degreeType
            modifiedAcademicMap.major  = updatedAcademicMap.major
        }
        if(row.querySelector('td[data-field="college"]').classList.contains("modified")) {
            modifiedAcademicMap.college = updatedAcademicMap.college
        }
        if(row.querySelector('td[data-field="sortOrder"]').classList.contains("modified")) {
            modifiedAcademicMap.sortOrder = updatedAcademicMap.sortOrder
        }
        if(row.querySelector('td[data-field="isActive"]').classList.contains("modified")) {
            modifiedAcademicMap.isActive = updatedAcademicMap.isActive
        }
        updateAcademicMaps.push(modifiedAcademicMap);
    }
  });

  const payload = {
    payload : {
        updateAcademicMaps: updateAcademicMaps,
    },
  };


  try {
    const response = await fetch(
      "http://localhost:3000/api/sample/modify-academic-map",
      {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();
    if(response.ok) {
        alert(data.message);
        loadAcademicMap();
        return;
    } else {
        throw new Error(data.error || "Failed to update Academic Map")
    }
  } catch (error) {
    console.error("Error saving data: ", error);
    alert("Error saving data: " + error);
  }
}

async function deleteAcademicMap(academicMapId) {
    try {
        const response = await fetch(
          `http://localhost:3000/api/sample/delete-academic-map/${academicMapId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
          });

        if(!response.ok) {
            const errorData = response.json();
            throw new Error(errorData.error || "Failed to delete Academic Map")
        } else {
            alert("Academic Map deleted successfully");
            await loadAcademicMap();
            window.scrollTo({top: 0, behavior: "instant"})
        }
    } catch (error) {
        console.error("Error deleting academic map:", error);
        throw error;
    }
}

async function handleEdit(academicMapId) {
    try {
        const response = await fetch(`http://localhost:3000/api/sample/get-course-by-academic-map-id/${academicMapId}`);
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to load academic map data")
        }

        const academicMapData = await response.json();
        window.location.href = `academic-map-edit.html?id=${academicMapId}`
    } catch (error) {
        console.error('Error fetching academic map data: ', error);
        alert('Error fetching academic map data: ' + error.message);
    }
}

async function handleView(academicMapId) {
    try {
        const response = await fetch(
          `http://localhost:3000/api/sample/degree-plan/${academicMapId}`
        );

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to load academic map data")
        }

        const coursesInAcademicMapData = await response.json();
        window.location.href = `academic-map-view.html?id=${academicMapId}`
    } catch (error) {
        console.error('Error fetching academic map data: ', error);
        alert('Error fetching academic map data: ' + error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadAcademicMap();
    initSaveCancelButtons("save-btn", "cancel-btn", () => {
        handleSaveAcademicMaps('#academic-map-table-body')
    }, 
    () => {revertChanges(),
        window.scrollTo({top: 0, behavior: "instant"})
    })

    setupDeleteButton({
    containerSelector: "#academic-map-table-body",
    buttonSelector: ".delete-btn",
    idAttribute: "data-id",
    deleteFunction: deleteAcademicMap,
    reloadFunction: loadAcademicMap,
    itemName: "academic map",
    })
})
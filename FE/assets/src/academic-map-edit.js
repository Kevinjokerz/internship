let courses = [];
const years = [1, 2, 3, 4, 5];
const seasons = ['Fall', 'Spring'];
const semesters = ['Semester 1', 'Semester 2'];
const semesterSeasons = ['Semester 1 Fall', 'Semester 2 Spring']

async function loadCourses() {
    try {
        const courseData = await fetchAllCourses();
        courses = [];
        courseData.forEach((course) => {
            courses.push({
                courseId: course.courseId,
                courseCode: course.courseCode,
                courseNo: course.courseNo,
                courseName: course.courseName,
            })
        })

        courses.sort((a, b) => a.courseId - b.courseId)
        displayPlannedCourses();
    } catch (error) {
        console.error("Error loading courses:", error);
    }
}
async function displayPlannedCourses() {
  const urlParams = new URLSearchParams(window.location.search);
  const academicMapId = urlParams.get("id");
  if (!academicMapId) {
    alert("Academic Map ID is missing");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/sample/get-course-by-academic-map-id/${academicMapId}`);
    if(!response.ok) {
        throw new Error("Failed to fetch planned courses")
    }
    const plannedCourses = await response.json();
    const tableBody = document.getElementById("academic-map-info-table-body");
    tableBody.innerHTML = "";

    plannedCourses.forEach((plannedCourse, index) => {
        const row = document.createElement("tr");
        row.classList.add("course-in-academic-map-row");
        const semesterSeasonValue = `${plannedCourse.planner.semester.semesterName} ${plannedCourse.planner.season}`
        row.innerHTML = `
        <td data-field="plannedCourseId">${plannedCourse.plannedCourseId}</td>
        <td data-field="year" data-index="${index}" data-initial-value="${plannedCourse.planner.yearNumber}">
            <select class="editable required" aria-label="Select Year" required>
                <option value="">Select...</option>
                ${years.map((year) => {
                    const isSelected = year === plannedCourse.planner.yearNumber ? 'selected' : '';
                    return `<option value="${year}" ${isSelected}>${year}</option>`;
                }).join("")}
            </select>
        </td>
        <td data-field="semesterSeason" data-index="${index}" data-initial-value="${semesterSeasonValue}">
            <select class="editable required" aria-label="Select Semester and Season" required>
                <option value="">Select...</option>
                ${semesterSeasons.map((semesterSeason) => {
                    const isSelected = semesterSeason === semesterSeasonValue ? 'selected' : '';
                    return `<option value="${semesterSeason}" ${isSelected}>${semesterSeason}</option>`;
                }).join("")}
            </select>
        </td>
        <td data-field="course" data-index="${index}" data-initial-value="${plannedCourse.course.courseId}">
            <select class="editable required" aria-label="Select Season" required>
                <option value="">Select...</option>
                ${courses.map((course) => {
                    const isSelected = course.courseId === plannedCourse.course.courseId ? 'selected' : '';
                    return `<option value="${course.courseId}" ${isSelected}>${course.courseCode} ${course.courseNo} - ${course.courseName}</option>`;
                }).join("")}
            </select>
        </td>
        <td data-field="sortOrder" data-index="${index}" data-initial-value="${plannedCourse.sortOrder}">
            <input type="number" class="editable number-input sort-order required" min="0" step="1" value="${plannedCourse.sortOrder}" required aria-label="Sort Order">
        </td>
        <td contenteditable="false" data-field="isActive" data-index="${index}" data-initial-value="${plannedCourse.isActive}">
            <input type="checkbox" ${plannedCourse.isActive ? "checked" : ""} class="editable">
        </td>
        <td class="delete-column">
            <button class="delete-btn" data-id="${plannedCourse.plannedCourseId}"><i class="fa-solid fa-trash"></i></button>
        </td>
        `;
        tableBody.appendChild(row)
    });

    const requiredFieldValidator = createRequiredFieldValidator("#academic-map-info-table-body");
    requiredFieldValidator.initialize();

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
        });
    };


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
    console.error("Error fetching or rendering planned courses:", error);
    alert("Error loading academic map data: " + error.message);
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
    } else if (field === "year" || field === "semesterSeason" || field === "course") {
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
    "#academic-map-info-table-body"
  );
  requiredFieldValidator.clearHighLights();
  requiredFieldValidator.initialize();

  updateSaveButton({ saveButton: "save-btn" });
  alert("All changes have been reverted.");
}

async function handleSaveCoursesInAM(tableBodySelector) {
    const urlParams = new URLSearchParams(window.location.search);
    const academicMapId = urlParams.get("id");
    if (!academicMapId) {
        alert("Academic Map ID is missing");
        return;
    }
    const requiredFieldValidator = createRequiredFieldValidator(tableBodySelector);
    if (!requiredFieldValidator.validateAll()) {
    return;
  }

  let invalidYear = [];
  let invalidSemesterSeason = [];
  let invalidCourses = [];
  let invalidSortOrder = [];

  const yearSelect = document.querySelectorAll('td[data-field="year"] select')
  for (let i = 0; i < yearSelect.length; i++) {
    const select = yearSelect[i];
    if (select.value && years.indexOf(Number(select.value)) === -1) {
      invalidYear.push(select);
    }
  }


  const semesterSeasonSelect = document.querySelectorAll('td[data-field="semesterSeason"] select');
  for (let i = 0; i < semesterSeasonSelect.length; i++) {
    const select = semesterSeasonSelect[i];
    if(select.value && semesterSeasons.indexOf(select.value) === -1) {
        invalidSemesterSeason.push(select);
    }
  }

  const courseSelect = document.querySelectorAll('td[data-field="course"] select');
  for(let i = 0; i < courseSelect.length; i++) {
    const select = courseSelect[i];
    const isValidCourse = courses.some(course => course.courseId.toString() === select.value);
    if(!isValidCourse) {
        invalidCourses.push(select);
    }
  }

  const sortOrderInputs = document.querySelectorAll('td[data-field="sortOrder"] input');
  for (let i = 0; i < sortOrderInputs.length; i++) {
    const input = sortOrderInputs[i];
    const value = parseInt(input.value, 10);
    if (!validateSortOrders(value)) {
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

  if(invalidYear.length > 0) {
    alert("Please select a valid year");
    return;
  }
  if(invalidSemesterSeason.length > 0) {
    alert("Please select a valid Semester");
    return;
  }
  if(invalidCourses.length > 0) {
    alert("Please select a valid course");
    return;
  }

  const updatePlannedCourses = [];
  const rows = document.querySelectorAll(tableBodySelector + " tr");

  rows.forEach((row, index) => {
    const modifiedCells = row.querySelectorAll("td.modified");

    if(modifiedCells.length === 0) return;

    const semesterSeason = row.querySelector('td[data-field="semesterSeason"] select').value;
    const [semester, season] = semesterSeason.split(" ").reduce(
      (acc, part, index) => {
        if (index === 0 || index === 1) {
          acc[0] = acc[1] ? `${acc[0]} ${part}` : part;
        } else {
          acc[1] = part;
        }
        return acc;
      },
      ["", ""]
    );
    const updatedPlannedCourse = {
      academicMapId: Number(academicMapId),
      plannedCourseId: Number(row.querySelector('td[data-field="plannedCourseId"]').innerText),
      year: Number(row.querySelector('td[data-field="year"] select').value),
      semester: `Semester ${semester}`,
      season: season,
      courseId: Number(row.querySelector('td[data-field="course"] select').value),
      sortOrder: Number(row.querySelector('td[data-field="sortOrder"] input').value),
      isActive: row.querySelector('td[data-field="isActive"] input[type="checkbox"]').checked,
    };

    const plannedCourseFields = ['year', 'semesterSeason', 'course', 'sortOrder', 'isActive'];
    const hasModified = Array.from(modifiedCells).some((cell) => {
        const field = cell.getAttribute("data-field");
        return plannedCourseFields.includes(field);
    })

    if(hasModified) {
        const modifiedPlannedCourses = {
            academicMapId: updatedPlannedCourse.academicMapId,
            plannedCourseId: updatedPlannedCourse.plannedCourseId
        }

        if(row.querySelector('td[data-field="year"]').classList.contains("modified") || 
            row.querySelector('td[data-field="semesterSeason"]').classList.contains('modified')) {
            modifiedPlannedCourses.year = updatedPlannedCourse.year,
            modifiedPlannedCourses.semester = updatedPlannedCourse.semester,
            modifiedPlannedCourses.season = updatedPlannedCourse.season
        }
        if(row.querySelector('td[data-field="course"]').classList.contains('modified')) {
            modifiedPlannedCourses.courseId = updatedPlannedCourse.courseId
        }
        if(row.querySelector('td[data-field="sortOrder"]').classList.contains('modified')) {
            modifiedPlannedCourses.sortOrder = updatedPlannedCourse.sortOrder
        }
        if(row.querySelector('td[data-field="isActive"]').classList.contains("modified")) {
            modifiedPlannedCourses.isActive = updatedPlannedCourse.isActive;
        }
        updatePlannedCourses.push(modifiedPlannedCourses)
    }
  });

    const payload = {
      payload: {
        updatePlannedCourses: updatePlannedCourses,
      },
    };

    try {
        const response = await fetch("http://localhost:3000/api/sample//modify-planned-courses",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        const data = await response.json();
        if(response.ok) {
            alert(data.message);
            loadCourses();
            return;
        } else {
            throw new Error(data.error || "Failed to update Courses in Academic Map")
        }
    } catch (error) {
        console.error("Error saving data: ", error);
        alert("Error saving data: " + error);
    }

  
}

async function deletePlannedCourse(plannedCourseId) {
    try {
        const response = await fetch(
          `http://localhost:3000/api/sample/delete-planned-course/${plannedCourseId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
          });
        if(!response.ok) {
            const errorData = response.json();
            throw new Error(errorData.error || "Failed to delete Planned Course")
        } else {
            alert("Planned Coursee deleted successfully");
            await loadCourses();
            window.scrollTo({top: 0, behavior: "instant"})
        }
    } catch (error) {
        console.error("Error deleting academic map:", error);
        throw error;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
  loadCourses();
      initSaveCancelButtons("save-btn", "cancel-btn", () => {
        handleSaveCoursesInAM("#academic-map-info-table-body");
    }, 
    () => {revertChanges(),
        window.scrollTo({top: 0, behavior: "instant"})
    })

    setupDeleteButton({
      containerSelector: "#academic-map-info-table-body",
      buttonSelector: ".delete-btn",
      idAttribute: "data-id",
      deleteFunction: deletePlannedCourse,
      reloadFunction: loadCourses,
      itemName: "academic-map",
    });
});

/* assets/js/degreePlanController.js */
let planners = [];
let courses = [];
let departments = [];
const courseLevels = ['1xxx', '2xxx', '3xxx', '4xxx', '5xxx']

async function loadCourses() {
  try {
    const deptData = await fetchDepartment();
    departments = deptData
      .filter((category) => category.isActive)
      .map((category) => category.categoryName);
    courseData = await fetchAllCourses();
    courses = []
    courseData.forEach((course) => {
      const category = course.category;
      const courseLevel = course.courseLevel;
      courses.push({
        courseId: course.courseId,
        department: category.categoryName,
        courseCode: course.courseCode,
        courseNumber: course.courseNo,
        courseName: course.courseName,
        description: course.description || "",
        creditHours: course.creditHours,
        isCoreCurriculum: course.isCoreCurriculum,
        isActive: course.isActive,
        sortOrder: course.sortOrder,
        courseLevel: courseLevel.levelName,
      });
    });
    // planners.forEach((planner) => {
    //   planner.plannedCourses.forEach((plannedCourse) => {
    //     const course = plannedCourse.course;
    //     const category = plannedCourse.course.category;
    //     const courseLevel = plannedCourse.course.courseLevel;
    //     courses.push({
    //       courseId: course.courseId,
    //       department: category.categoryName,
    //       courseCode: course.courseCode,
    //       courseNumber: course.courseNo,
    //       courseName: course.courseName,
    //       description: course.description || "",
    //       creditHours: course.creditHours,
    //       isCoreCurriculum: course.isCoreCurriculum,
    //       isActive: course.isActive,
    //       sortOrder: course.sortOrder,
    //       courseLevel: courseLevel.levelName,
    //     });
    //   });
    // });


    courses.sort((a, b) => a.courseId - b.courseId);
    displayCourses();
  } catch (error) {
    console.error("Error loading courses:", error);
  }
}

const validateCreditHours = (value) => {
  const num = parseInt(value, 10);
  return !isNaN(num) && num > 0;
}


function displayCourses() {
  const tableBody = document.getElementById("course-table-body");
  tableBody.innerHTML = "";

  courses.forEach((course, index) => {
    const isValidDepartment = departments.includes(course.department);
    const isValidCourseLevel = courseLevels.includes(course.courseLevel);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${course.courseId}</td>
      <td data-field="department" data-index="${index}" data-initial-value="${course.department}" ${!isValidDepartment ? 'class="invalid-deparment"' : ""}>
        <select class="editable required" aria-label="Select Department" required>
          <option value="">Select...</option>
            ${departments.map((dept) =>{
              const isSelected = dept === course.department ? 'selected' : '';
              return `<option value="${dept}" ${isSelected}>${dept}</option>`;
            }).join("")}
            ${!isValidDepartment && course.department ? `<option value="${course.department}" disabled selected>${course.department} (Inactive)</option>` : ""}
        </select> 
      </td>
      <td contenteditable="true" class="editable required" data-field="courseCode" data-index="${index}" data-initial-value="${course.courseCode}">${course.courseCode}</td>
      <td contenteditable="true" class="editable required" data-field="courseNumber" data-index="${index}" data-initial-value="${course.courseNumber}">${course.courseNumber}</td>
      <td contenteditable="true" class="editable required" data-field="courseName" data-index="${index}" data-initial-value="${course.courseName}">${course.courseName}</td>
      <td data-field="courseLevel" data-index="${index}" data-initial-value="${course.courseLevel}" ${!isValidCourseLevel ? 'class="invalid-courseLevel"' : ""}>
        <select class="editable required" aria-label="Select Course Level" required>
          <option value="">Select...</option>
          ${courseLevels.map((level) => {
            const isSelected = level === course.courseLevel ? 'selected' : '';
            return `<option value="${level}" ${isSelected}>${level}</option>`;
          }).join("")}
          ${!isValidCourseLevel && course.courseLevel ? `<option value="${course.courseLevel}" disabled selected>${course.courseLevel} (Inactive)</option>` : ""}
        </select>
      </td>
      <td contenteditable="true" class="editable" data-field="description" data-index="${index}" data-initial-value="${course.description}">${course.description}</td>
      <td data-field="creditHours" data-index="${index}" data-initial-value="${course.creditHours}">
        <input type="number" class="editable number-input credit-hours required" min="1" step="1" value="${course.creditHours}" required aria-label="Credit Hours">
      </td>
      <td data-field="sortOrder" data-index="${index}" data-initial-value="${course.sortOrder}">
        <input type="number" class="editable number-input sort-order required" min="0" step="1" value="${course.sortOrder}" required aria-label="Sort Order">
      </td>
      <td contenteditable="false" data-field="isCoreCurriculum" data-index="${index}" data-initial-value="${course.isCoreCurriculum}">
        <input type="checkbox" ${course.isCoreCurriculum ? "checked" : ""} class="editable">
      </td>
      <td contenteditable="false" data-field="isActive" data-index="${index}" data-initial-value="${course.isActive}">
        <input type="checkbox" ${course.isActive ? "checked" : ""} class="editable">
      </td>
    `;
    tableBody.appendChild(row);
  });

  const requiredFieldValidator = createRequiredFieldValidator('#course-table-body');
  requiredFieldValidator.initialize();

  const editableCells = document.querySelectorAll('td[contenteditable="true"]');
  editableCells.forEach((cell) => {
    cell.addEventListener("input", () => {
      const initialValue = cell.getAttribute("data-initial-value");
      const currentValue = cell.innerText;
      const isRequired = cell.classList.contains("required")
      if (currentValue !== initialValue) {
        cell.classList.add("modified");
      } else {
        cell.classList.remove("modified");
      }
      updateSaveButton({saveButton: "save-btn"});
    });
  });

  const creditHoursInputs = document.querySelectorAll('input.credit-hours');
  for(let i = 0; i < creditHoursInputs.length; i++) {
    const input = creditHoursInputs[i];
    input.addEventListener("input", function () {
      const cell = this.closest("td");
      const initialValue = cell.getAttribute("data-initial-value");
      let currentValue = this.value;

      if(currentValue === "" || parseInt(currentValue, 10) <= 0) {
        this.value = 1;
        currentValue = "1";
        alert("Credit Hours must be greater than 0.");
      }

      if(currentValue !== initialValue) {
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

      if (currentValue === "" || parseInt(currentValue, 10) <= 0) {
        this.value = 1;
        currentValue = "1";
        alert("Credit Hours must be greater than 0.");
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

  const sortOrderInputs = document.querySelectorAll('input.sort-order');
  for(let i = 0; i < sortOrderInputs.length; i++) {
    const input = sortOrderInputs[i];
    input.addEventListener("input", function () {
      const cell = this.closest("td");
      const initialValue = cell.getAttribute("data-initial-value");
      let currentValue = this.value;

      if(currentValue === "" || parseInt(currentValue, 10) < 0) {
        this.value = 0;
        currentValue = "0";
        alert("Sort Order must be 0 or greater");
      }

      if(currentValue !== initialValue) {
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


  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"].editable'
  );
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const cell = checkbox.closest("td");
      const initialValue = cell.getAttribute("data-initial-value") === "true";
      const currentValue = checkbox.checked;
      if (currentValue !== initialValue) {
        cell.classList.add("modified");
      } else {
        cell.classList.remove("modified");
      }
      updateSaveButton({ saveButton: "save-btn" });
    });
  });

  const dropboxes = document.querySelectorAll('select[class~="editable"]')
  console.log("number of dropboxes found: ", dropboxes.length)
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
}

function revertChanges() {
  const modifiedCells = document.querySelectorAll("td.modified");
  modifiedCells.forEach((cell) => {
    const field = cell.getAttribute("data-field");
    const initialValue = cell.getAttribute("data-initial-value");
    if (field === "isCoreCurriculum" || field === "isActive") {
      const checkbox = cell.querySelector('input[type="checkbox"]');
      checkbox.checked = initialValue === "true";
    } else {
      cell.innerText = initialValue;
    }
    cell.classList.remove("modified");
  });

  const requiredFieldValidator = createRequiredFieldValidator("#course-table-body");
  requiredFieldValidator.clearHighLights();
  requiredFieldValidator.initialize();

  updateSaveButton({ saveButton: "save-btn" });
  alert("All changes have been reverted.");
}

async function handleSaveCourses(tableBodySelector) {

  const requiredFieldValidator = createRequiredFieldValidator(tableBodySelector);
  if (!requiredFieldValidator.validateAll()) {
      return;
  }

  let invalidDepartments = [];
  const departmentSelects = document.querySelectorAll('td[data-field="department"] select');
  for (let i = 0; i < departmentSelects.length; i++) {
    const select = departmentSelects[i];
    if(select.value && departments.indexOf(select.value) === -1) {
      invalidDepartments.push(select)
    }
  }
  if(invalidDepartments.length > 0) {
    alert("Please select a valid department.");
    return;
  }

  //Validate credit hours
  let invalidCreditHours = [];
  const creditHoursInputs = document.querySelectorAll('td[data-field="creditHours"] input');
  for (let i = 0; i < creditHoursInputs.length; i++) {
    const input = creditHoursInputs[i];
    const value = parseInt(input.value, 10);
    if(!validateCreditHours(value)) {
      invalidCreditHours.push(input);
    }
  }
  if(invalidCreditHours.length > 0) {
    alert("Please ensure all credit hours are positive and greater than 0.");
    for (let i = 0; i < invalidCreditHours.length; i++) {
      invalidCreditHours[i].value = 1;
      alert("Credit hours must be greater than 0")
    }
    return;
  }

  const updateCourses = [];
  const rows = document.querySelectorAll(tableBodySelector + " tr");

  rows.forEach((row, index) => {
    const course = courses[index];
    const modifiedCells = row.querySelectorAll("td.modified");
    if (modifiedCells.length === 0) return;

    const description = row.querySelector(
      'td[data-field="description"]'
    ).innerText;
    const updatedCourse = {
      courseId: course.courseId,
      courseCode: row.querySelector('td[data-field="courseCode"]').innerText,
      courseNo: row.querySelector('td[data-field="courseNumber"]').innerText,
      courseName: row.querySelector('td[data-field="courseName"]').innerText,
      creditHours: parseInt(
        row.querySelector('td[data-field="creditHours"]').innerText
      ),
      description: description === "" ? null : description,
      isCoreCurriculum: row.querySelector(
        'td[data-field="isCoreCurriculum"] input[type="checkbox"]'
      ).checked,
      isActive: row.querySelector(
        'td[data-field="isActive"] input[type="checkbox"]'
      ).checked,
      sortOrder: parseInt(
        row.querySelector('td[data-field="sortOrder"]').innerText
      ),
      courseLevel: row.querySelector('td[data-field="courseLevel"]').innerText,
      courseCategory: row.querySelector('td[data-field="department"]')
        .innerText,
    };

    const courseFields = [
      "department",
      "courseCode",
      "courseNumber",
      "creditHours",
      "description",
      "isCoreCurriculum",
      "isActive",
      "sortOrder",
      "courseLevel",
    ];
    const hasCourseModified = Array.from(modifiedCells).some((cell) => {
      const field = cell.getAttribute("data-field");
      return courseFields.includes(field);
    });

    if (hasCourseModified) {
      const modifiedCourse = {
        courseId: updatedCourse.courseId,
      };
      if (
        row
          .querySelector('td[data-field="courseCode"]')
          .classList.contains("modified")
      ) {
        modifiedCourse.courseCode = updatedCourse.courseCode;
      }
      if (
        row
          .querySelector('td[data-field="courseNumber"]')
          .classList.contains("modified")
      ) {
        modifiedCourse.courseNo = updatedCourse.courseNo;
      }
      if (
        row
          .querySelector('td[data-field="courseName"]')
          .classList.contains("modified")
      ) {
        modifiedCourse.courseName = updatedCourse.courseName;
      }
      if (
        row
          .querySelector('td[data-field="creditHours"]')
          .classList.contains("modified")
      ) {
        modifiedCourse.creditHours = updatedCourse.creditHours;
      }
      if (
        row
          .querySelector('td[data-field="description"]')
          .classList.contains("modified")
      ) {
        modifiedCourse.description = updatedCourse.description;
      }
      if (
        row
          .querySelector('td[data-field="isCoreCurriculum"]')
          .classList.contains("modified")
      ) {
        modifiedCourse.isCoreCurriculum = updatedCourse.isCoreCurriculum;
      }
      if (
        row
          .querySelector('td[data-field="isActive"]')
          .classList.contains("modified")
      ) {
        modifiedCourse.isActive = updatedCourse.isActive;
      }
      if (
        row
          .querySelector('td[data-field="sortOrder"]')
          .classList.contains("modified")
      ) {
        modifiedCourse.sortOrder = updatedCourse.sortOrder;
      }
      if (
        row
          .querySelector('td[data-field="courseLevel"]')
          .classList.contains("modified")
      ) {
        modifiedCourse.courseLevel = updatedCourse.courseLevel;
      }
      if (
        row
          .querySelector('td[data-field="department"]')
          .classList.contains("modified")
      ) {
        modifiedCourse.courseCategory = updatedCourse.courseCategory;
      }
      updateCourses.push(modifiedCourse);
    }
  });

  const payload = {
    payload: {
      updateCourses: updateCourses,
    },
  };

  try {
    const response = await fetch(
      "http://localhost:3000/api/sample/modify-degree-plan",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      }
    );
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      await loadCourses();
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Error saving data: " + error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadCourses();
  initSaveCancelButtons("save-btn", "cancel-btn", function () {
    handleSaveCourses("#course-table-body");
  }, function () {
    revertChanges();
    window.scrollTo({ top: 0, behavior: "instant" });
  });
});

document.addEventListener("DOMContentLoaded", async function () {
    initModal("add-course-modal", "cancel-modal");

    const deptData = await fetchDepartment();
    const departments = deptData
    .filter((category) => category.isActive)
    .map((category) => category.categoryName);
    console.log(departments);
    const departmentSelect = document.getElementById("course-department");

    if(departments && Array.isArray(departments)) {
        departments.forEach(department => {
            const option = document.createElement("option");
            option.value = department;
            option.textContent = department;
            departmentSelect.appendChild(option);
        });
    } else {
        console.error("Failed to load departments")
    }

    if(!departments.includes("Core Curriculum")) {
        const option = document.createElement("option");
        option.value = "Core Curriculum";
        option.textContent = "Core Curriculum";
        departmentSelect.appendChild(option)
    }

    const addNewCourseBtn = document.getElementById("add-new");
    const modal = document.getElementById("add-course-modal");
    const addCourseForm = document.getElementById("add-course-form");
    const courseCodeInput = document.getElementById("course-code");
    const courseNumberInput = document.getElementById("course-number");
    const courseNumberContainer = document.getElementById("course-number-container");

    addNewCourseBtn.addEventListener("click", function() {
        modal.style.display = "block";
    })

    departmentSelect.addEventListener("change", function() {
        if(departmentSelect.value === "Core Curriculum") {
            courseNumberContainer.classList.add("hidden");
            courseNumberInput.removeAttribute("required");
            courseNumberInput.value = "";
        } else {
            courseNumberContainer.classList.remove("hidden");
            courseCodeInput.setAttribute("required", "required");
        }
    });

    courseCodeInput.addEventListener("input", function() {
        courseCodeInput.value = courseCodeInput.value.toUpperCase()
    })

    courseNumberInput.addEventListener("input", function() {
        courseNumberInput.value = courseNumberInput.value.replace(/[^0-9]/g, "");
    });

    addCourseForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const courseCode = document.getElementById("course-code").value;
        const courseNo = document.getElementById("course-number").value;
        const courseName = document.getElementById("course-name").value;
        const courseLevel = document.getElementById("course-level").value;
        const department = document.getElementById("course-department").value;
        const description = document.getElementById("course-description").value;
        let creditHours = parseInt(document.getElementById("credit-hours").value);
        let sortOrder = parseInt(document.getElementById("sort-order").value);
        const isCoreCurriculum = document.getElementById("is-core-curriculum").checked;

        if(!department) {
            alert("Please select a department")
            return;
        }

        if(!courseCode) {
            alert("Please enter a course code");
            return;
        }

        if(department !== "Core Curriculum" && (!courseNo || !/^\d+$/.test(courseNo))) {
            alert("Course Number must be a number when Department is not Core Curriculum");
            return;
        }

        if(!courseLevel) {
            alert("Please select a course level.");
            return;
        }

        if(isNaN(creditHours) || creditHours < 1){
            alert("Credit Hours must be a number greater than or equal to 1.");
            return;
        }

        if(isNaN(sortOrder) || sortOrder < 0) {
            alert("Sort Order must be a number greater than or equal to 0.");
            return;
        }

        const payload = {
          payload: {
            courseCode: courseCode,
            courseNo: department === "Core Curriculum" ? null : courseNo,
            courseName: courseName,
            creditHours: creditHours,
            description: description || null,
            isCoreCurriculum: isCoreCurriculum,
            courseLevel: courseLevel,
            courseCategory: department,
            sortOrder: sortOrder,
          },
        };

        try {
            const response = await fetch("http://localhost:3000/api/sample/create-new-course", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if(!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create new course")
            }

            alert("Course created successfully!");
            modal.style.display = "none";
            addCourseForm.reset();
            courseNumberContainer.classList.remove("hidden");
            courseNumberInput.setAttribute("required", "required");
            location.reload()
        } catch (error) {
            alert(`Failed to create course: ${error.message}`);
        }
    });
});
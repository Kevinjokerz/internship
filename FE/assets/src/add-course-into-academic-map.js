document.addEventListener("DOMContentLoaded", async function () {
  initModal("add-course-in-academic-map-modal", "cancel-modal");

  const courseData = await fetchAllCourses();
  const addCourseBtn = document.getElementById("add-new");
  const addCourseInAcademicMapForm = document.getElementById(
    "add-course-into-academic-map-form"
  );
  const modal = document.getElementById("add-course-in-academic-map-modal");
  const courseSelect = document.getElementById("course");

  addCourseBtn.addEventListener("click", function () {
    modal.style.display = "block";
  });

  if (courseData && Array.isArray(courseData)) {
    courseData.forEach((course) => {
      const option = document.createElement("option");
      option.value = course.courseId;
      option.textContent = `${course.courseCode} ${course.courseNo} - ${course.courseName}`;
      courseSelect.appendChild(option);
    });
  } else {
    console.error("Failed to load courses");
  }

  addCourseInAcademicMapForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const year = document.getElementById("year").value;
    const semesterSeason = document.getElementById("semesterSeason").value;
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
    let sortOrder = parseInt(document.getElementById("sort-order").value);
    const courseId = document.getElementById("course").value;
    const isActive = document.getElementById("is-active").checked;

    if (!year) {
      alert("Please enter a year number");
      return;
    }
    if (!semesterSeason) {
      alert("Plaese select a Semester");
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const academicMapId = urlParams.get("id");
    if (!academicMapId) {
      alert("Academic Map ID is missing");
      return;
    }
    const payload = {
      payload: {
        academicMapId: Number(academicMapId),
        year: Number(year),
        semester: `Semester ${semester}`,
        season: season,
        sortOrder: sortOrder,
        courseId: Number(courseId),
        isActive: isActive,
      },
    };

    try {
        const response = await fetch(
          `http://localhost:3000/api/sample/add-course-into-academic-map`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to add course into academic map");
        }

        alert("Course added into Academic Map successfully!");
        modal.style.display = "none";
        addCourseInAcademicMapForm.reset();
        location.reload()
    } catch (error) {
        alert(`Failed to create course: ${error.message}`);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  loadDegreePlan();

  document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("courseModal").style.display = "none";
  });

  window.addEventListener("click", (event) => {
    const modal = document.getElementById("courseModal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

async function loadDegreePlan() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/sample/degree-plan"
    );
    const planner = await response.json();

    renderDegreePlan(planner);
  } catch (error) {
    console.error("Error fetching degree plan:", error);
  }
}

function groupByYear(planners) {
  return planners.reduce((acc, planner) => {
    const year = planner.yearNumber;

    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(planner);
    return acc;
  }, {});
}

function showModal(description) {
  const modal = document.getElementById("courseModal");
  const descriptionPara = document.getElementById("courseDescription");
  descriptionPara.textContent = description;
  modal.style.display = "block";
}

function renderDegreePlan(planners) {
  const plannerByYear = groupByYear(planners);

  const container = document.getElementById("app");
  container.innerHTML = "";

  let totalCredit4Years = 0;

  for (const year in plannerByYear) {
    const yearPlanners = plannerByYear[year];

    const fallPlanner = yearPlanners.find((p) => p.season === "Fall");
    const springPlanner = yearPlanners.find((p) => p.season === "Spring");

    const fallCourses = fallPlanner ? fallPlanner.plannedCourses : [];
    const springCourses = springPlanner ? springPlanner.plannedCourses : [];

    fallCourses.sort((a, b) => a.course.sortOrder - b.course.sortOrder);
    springCourses.sort((a, b) => a.course.sortOrder - b.course.sortOrder);

    const maxRow = Math.max(fallCourses.length, springCourses.length);
    const totalRow = maxRow + 2;

    const table = document.createElement("table");
    const colgroupHTML = `
    <colgroup>
        <col class="col-year" />
        <col class="col-fall-code" />
        <col class="col-fall-name" />
        <col class="col-fall-credit" />
        <col class="col-spring-code" />
        <col class="col-spring-name" />
        <col class="col-spring-credit" />
        <col class="col-total" />
    </colgroup>
    `;
    table.insertAdjacentHTML("afterbegin", colgroupHTML);
    const tbody = document.createElement("tbody");

    const headerRow = document.createElement("tr");

    const yearTh = document.createElement("th");
    yearTh.classList.add("year-col");
    yearTh.rowSpan = Number(year) === 4 ? totalRow + 1 : totalRow;
    yearTh.textContent = `Year ${year}`;
    headerRow.appendChild(yearTh);

    const fallHeader = document.createElement("th");
    fallHeader.textContent = `${fallPlanner.semester.semesterName} ${fallPlanner.season}`;
    fallHeader.colSpan = 3;
    headerRow.appendChild(fallHeader);

    const springHeader = document.createElement("th");
    springHeader.textContent = `${springPlanner.semester.semesterName} ${springPlanner.season}`;
    springHeader.colSpan = 3;
    headerRow.appendChild(springHeader);

    const totalHeader = document.createElement("th");
    totalHeader.textContent = "Total";
    headerRow.appendChild(totalHeader);

    tbody.appendChild(headerRow);

    let fallTotal = 0;
    let springTotal = 0;

    for (let i = 0; i < maxRow; i++) {
      const row = document.createElement("tr");
      const fallCourseCodeCell = document.createElement("td");
      const fallCourseNameCell = document.createElement("td");
      const fallCourseCreditCell = document.createElement("td");

      const springCourseCodeCell = document.createElement("td");
      const springCourseNameCell = document.createElement("td");
      const springCourseCreditCell = document.createElement("td");

      if (fallCourses[i]) {
        const c = fallCourses[i].course;

        if (c.description) {
          console.log(c.description);
          fallCourseCodeCell.textContent = `${c.courseCode}`;
          fallCourseCodeCell.classList.add("clickable");
          fallCourseCodeCell.addEventListener("click", () => {
            showModal(c.description);
          });
        } else {
          fallCourseCodeCell.textContent = `${c.courseCode}`;
        }

        fallCourseNameCell.textContent = c.isCoreCurriculum
          ? `${c.courseName}*`
          : `${c.courseName}`;
        fallCourseCreditCell.textContent = `${c.creditHours}`;
        fallTotal += c.creditHours;
      }
      row.appendChild(fallCourseCodeCell);
      row.appendChild(fallCourseNameCell);
      row.appendChild(fallCourseCreditCell);

      if (springCourses[i]) {
        const c = springCourses[i].course;
        if (c.description) {
          console.log(c.description);
          springCourseCodeCell.textContent = `${c.courseCode}`;
          springCourseCodeCell.classList.add("clickable");
          springCourseCodeCell.addEventListener("click", () => {
            showModal(c.description);
          });
        } else {
          springCourseCodeCell.textContent = `${c.courseCode}`;
        }
        springCourseNameCell.textContent = c.isCoreCurriculum
          ? `${c.courseName}*`
          : `${c.courseName}`;
        springCourseCreditCell.textContent = `${c.creditHours}`;
        springTotal += c.creditHours;
      }
      row.appendChild(springCourseCodeCell);
      row.appendChild(springCourseNameCell);
      row.appendChild(springCourseCreditCell);

      const totalCell = document.createElement("td");
      totalCell.textContent = "";

      row.appendChild(totalCell);

      tbody.appendChild(row);
    }

    const footerRow = document.createElement("tr");

    const fallFooter = document.createElement("td");
    const totalFallCredit = document.createElement("td");
    fallFooter.innerHTML = `<strong>Semester Hours:</strong>`;
    fallFooter.colSpan = 2;
    totalFallCredit.textContent = `${fallTotal}`;
    footerRow.appendChild(fallFooter);
    footerRow.appendChild(totalFallCredit);

    const springFooter = document.createElement("td");
    const totalSpringCredit = document.createElement("td");
    springFooter.innerHTML = `<strong>Semester Hours:</strong>`;
    springFooter.colSpan = 2;
    totalSpringCredit.textContent = `${springTotal}`;
    footerRow.appendChild(springFooter);
    footerRow.appendChild(totalSpringCredit);

    const grandFooter = document.createElement("td");
    grandFooter.innerHTML = `<strong>${fallTotal + springTotal}</strong>`;
    footerRow.appendChild(grandFooter);

    tbody.appendChild(footerRow);

    totalCredit4Years += fallTotal + springTotal;

    if (Number(year) === 4) {
      const extraRow = document.createElement("tr");
      const blankCell1 = document.createElement("td");
      const blankCell2 = document.createElement("td");
      const totalIn4Years = document.createElement("td");
      blankCell1.colSpan = 3;
      blankCell2.colSpan = 3;
      blankCell1.textContent = "";
      blankCell2.textContent = "";
      totalIn4Years.textContent = `${totalCredit4Years}`;

      extraRow.appendChild(blankCell1);
      extraRow.appendChild(blankCell2);
      extraRow.appendChild(totalIn4Years);
      tbody.appendChild(extraRow);
    }

    table.appendChild(tbody);
    container.appendChild(table);
  }
  const noteParagraph = document.createElement("p");
  noteParagraph.innerHTML = `<b>*State of Texas Core Curriculum</b>`;
  container.appendChild(noteParagraph);
}

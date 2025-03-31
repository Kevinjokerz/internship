document.addEventListener("DOMContentLoaded", () => {
  const sampleAcademicMapId = 1;
  loadDegreePlan(sampleAcademicMapId);
  initModal("courseModal", "closeModal");
});

async function loadDegreePlan(academicMapId) {
  try {
    planner = await fetchCourseForSampleAM(academicMapId);
    renderDegreePlan(planner);
  } catch (error) {
    console.error("Error fetching degree plan:", error);
  }
}

function groupByYear(planners) {
  return planners.reduce((acc, planner) => {
    const year = planner.yearNumber;
    if(!year) return acc;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(planner);
    return acc;
  }, {});
}

function showModal(course) {
  const modal = document.getElementById("courseModal");

  const titleEl = document.getElementById("courseTitle");
  const prereqEl = document.getElementById("coursePrereqs");
  const descriptionPara = document.getElementById("courseDescription");

  const codeTitle = course.courseNo
    ? `${course.courseCode} ${course.courseNo}`
    : course.courseCode;
  titleEl.textContent = `${codeTitle} - ${course.courseName}`;

  if (course.prerequisites && course.prerequisites.length > 0) {
    const prereqCodes = course.prerequisites.map((p) => {
      const pc = p.prereqCourse;
      if (!pc) return "";
      const pcTitle = pc.courseNo ? `${pc.courseCode} ${pc.courseNo}` : pc.courseCode;

      if(p.description) {
        return `${p.description} ${pcTitle}`;
      } else {
        return pcTitle;
      }
    });

    const prereqLine = prereqCodes.join(" and ");
    prereqEl.innerHTML = `<strong>Prerequisite:</strong> ${prereqLine}`;
  } else {
    prereqEl.innerHTML = "";
  }
  descriptionPara.textContent = course.description || "";
  modal.style.display = "block";
}

function renderDegreePlan(planners) {
  const plannerByYear = groupByYear(planners);

  const container = document.getElementById("app");
  container.innerHTML = "";

  let totalCreditAllYears = 0;

  const years = Object.keys(plannerByYear).sort((a, b) => a - b);
  const lastYear = years[years.length -1];
  for (const year of years) {
    const yearPlanners = plannerByYear[year] || [];

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
    yearTh.rowSpan = year === lastYear ? totalRow + 1 : totalRow;
    yearTh.textContent = `Year ${year}`;
    headerRow.appendChild(yearTh);

    const fallHeader = document.createElement("th");
    fallHeader.textContent = fallPlanner && fallPlanner.semester && fallPlanner.semester.semesterName ? `${fallPlanner.semester.semesterName} ${fallPlanner.season}` : `Semester 1 Fall`;
    fallHeader.colSpan = 3;
    headerRow.appendChild(fallHeader);

    const springHeader = document.createElement("th");
    springHeader.textContent = springPlanner && springPlanner.semester && springPlanner.semesterName ? `${springPlanner.semester.semesterName} ${springPlanner.season}` : `Semester 2 Spring`;
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
        fallCourseCodeCell.textContent =
          c.courseNo == null
            ? `${c.courseCode}`
            : `${c.courseCode} ${c.courseNo}`;
        if (c.description || (c.prerequisites && c.prerequisites.length > 0)) {
          fallCourseCodeCell.classList.add("clickable");
          fallCourseCodeCell.addEventListener("click", () => {
            showModal(c);
          });
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
        springCourseCodeCell.textContent =
          c.courseNo == null
            ? `${c.courseCode}`
            : `${c.courseCode} ${c.courseNo}`;
        if (c.description || (c.prerequisites && c.prerequisites.length > 0)) {
          springCourseCodeCell.classList.add("clickable");
          springCourseCodeCell.addEventListener("click", () => {
            showModal(c);
          });
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

    totalCreditAllYears += fallTotal + springTotal;

    if (year === lastYear) {
      const extraRow = document.createElement("tr");
      const blankCell1 = document.createElement("td");
      const blankCell2 = document.createElement("td");
      const totalIn4Years = document.createElement("td");
      blankCell1.colSpan = 3;
      blankCell2.colSpan = 3;
      blankCell1.textContent = "";
      blankCell2.textContent = "";
      totalIn4Years.textContent = `${totalCreditAllYears}`;

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

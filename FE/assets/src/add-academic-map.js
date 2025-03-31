document.addEventListener("DOMContentLoaded", async function () {
    initModal("add-academic-map-modal", "cancel-modal");

    const collegeData = await fetchCollege();
    const colleges = collegeData
    .filter((college) => college.isActive)
    .map((college) => college.collegeName);

    const addNewAcademicMap = document.getElementById("add-new");
    const modal = document.getElementById("add-academic-map-modal");
    const collegeSelect = document.getElementById("college");
    const addAcademicMapForm = document.getElementById("add-academic-map-form");

    if(colleges && Array.isArray(colleges)) {
        colleges.forEach(college => {
            const option = document.createElement("option");
            option.value = college;
            option.textContent = college;
            collegeSelect.appendChild(option);
        });
    } else {
        console.error("Failed to load colleges")
    }

    addNewAcademicMap.addEventListener("click", () => {
        modal.style.display = "block";
    });

    addAcademicMapForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const degreeType = document.getElementById("degree-type").value;
        const major = document.getElementById("major").value;
        const college = document.getElementById("college").value;
        const sortOrder = parseInt(document.getElementById("sort-order").value);
        const isActive = document.getElementById("is-active").checked;

        if(!degreeType) {
            alert("Please select a degree type");
            return;
        }
        if(!major) {
            alert("Please enter a major");
            return;
        }
        if(!college) {
            alert("Please select a college");
            return;
        }
        if(isNaN(sortOrder) || sortOrder < 0) {
            alert("Sort Order myst be a number greater than or equal to 0.");
            return;
        }


        const payload = {
            payload: {
                degreeType: degreeType,
                major: major,
                college: college,
                sortOrder: sortOrder,
                isActive: isActive,
            },
        };

        try {
            const response = await fetch(
              "http://localhost:3000/api/sample/add-new-academic-map", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
              });

              if(response.ok) {
                alert("Academic Map created successfully");
                modal.style.display = "none";
                addAcademicMapForm.reset();
                location.reload();
              } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add new academic map.")
              }
        } catch (error) {
            console.error("Error saving data: ", error);
            alert("Error saving data: " + error);
        }
    });
})
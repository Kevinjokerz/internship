document.addEventListener("DOMContentLoaded", async () => {
    initModal("add-department-modal", "cancel-modal");

    const addNewDepartmentBtn = document.getElementById("add-new");
    const modal = document.getElementById("add-department-modal");
    const addDepartmentForm = document.getElementById("add-department-form")


    addNewDepartmentBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    addDepartmentForm.addEventListener("submit", async (event) => {
        event.preventDefault();


        const departmentName = document.getElementById("department-name").value;
        const isActive = document.getElementById("is-active").checked;

        if(!departmentName) {
            alert("Please enter a department name")
            return;
        }

        const payload = {
            payload : {
                categoryName: departmentName,
                isActive: isActive
            }
        };

        try {
            const response = await fetch(
              "http://localhost:3000/api/sample/create-new-department", {
                method:'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
              });

              if(!response.ok) {
                const errorData = await response.json();
                addDepartmentForm.reset();
                throw new Error(errorData.error || "Failed to create new department")
              }

              alert("Department created successfully");
              modal.style.display = "none";
              addDepartmentForm.reset();
              location.reload()
        } catch (error) {
            alert(`Failed to create department: ${error.message}`)
        }
    })
})
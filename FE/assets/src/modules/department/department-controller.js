import {Table}  from "../../components/table.js";
import { Modal } from "../../components/modal.js";
import {Form} from "../../components/form.js";
import DepartmentService from "../../api/services/department.service.js";

// Khởi tạo Modal và Form cho việc thêm mới department
const addDepartmentModal = new Modal("add-department-modal", "cancel-modal", () => addDepartmentForm.reset());
const addDepartmentForm = new Form("add-department-form", handleAddDepartment);

// Biến lưu trữ dữ liệu departments
let departments = [];

// Hàm tải danh sách departments từ API
async function loadDepartments() {
  try {
    const response = await DepartmentService.getAllDepartment();
    departments = response.map((dept) => ({
      departmentId: dept.categoryId,
      departmentName: dept.categoryName,
      isActive: dept.isActive,
    }));
    table.setData(departments);
  } catch (error) {
    console.error("Error loading departments:", error);
    alert("Failed to load departments. Please try again.");
  }
}

// Khởi tạo Table để quản lý bảng departments
const table = new Table({
  containerId: "department-table-body",
  data: departments,
  rowClass: "department-row",
  columns: [
    {
      name: "departmentName",
      type: "text",
      required: true,
      apiName: "categoryName",
    },
    { name: "isActive", type: "checkbox", apiName: "isActive" },
  ],
  idField: "departmentId",
  rowActions: ["delete"],
  actionHandlers: {
    delete: async (id) => {
        try {
          await DepartmentService.deleteDepartment(id);
          alert("Department deleted successfully.");
          await loadDepartments();
        } catch (error) {
          console.error("Error deleting department:", error);
        }
    },
  },
  onSave: async (modifiedData) => {
    console.log(modifiedData)
    const updatePayload = modifiedData.map((item) => ({
      categoryId: item.id,
      categoryName: item.categoryName,
      isActive: item.isActive,
    }));
    try {
        console.log(updatePayload);
      await DepartmentService.updateDepartments({
        updateDepartment: updatePayload,
      });
      alert("Departments updated successfully.");
      await loadDepartments();
    } catch (error) {
      console.error("Error updating departments:", error);
      alert("Failed to update departments.");
    }
  },
  onRevert: () => {
    alert("Changes reverted.");
  },
});

// Xử lý khi thêm mới department
async function handleAddDepartment(formData) {
  const newDepartment = {
    payload: {
        categoryName: formData["department-name"],
        isActive: formData["is-active"] === "on",
    }
  };
  try {
    await DepartmentService.createDepartments(newDepartment);
    alert("Department added successfully.");
    addDepartmentModal.hide();
    addDepartmentForm.reset();
    await loadDepartments();
  } catch (error) {
    console.error("Error adding department:", error);
  }
}

// Gắn sự kiện cho các nút
document.getElementById("add-new").addEventListener("click", () => {
  addDepartmentModal.show();
});

document.getElementById("save-btn").addEventListener("click", () => {
  table.handleSave();
});

document.getElementById("cancel-btn").addEventListener("click", () => {
  table.revert();
});

document.addEventListener("DOMContentLoaded", async () => {
  await loadDepartments();
});

import { createRequiredFieldValidator } from "../utils/validators.js";
import { attachEventListeners } from "../utils/event.util.js"
import { updateSaveButton } from "../utils/dom.util.js"



class Table {
    constructor({
        containerId,
        data,
        columns,
        idField = "id",
        rowActions = [],
        actionHandlers = {},
        onSave,
        onRevert,
        rowClass,
        validatorOptions = {}
    }) {
        this.container = document.getElementById(containerId);
        this.data = data;
        this.columns = columns;
        this.idField = idField;
        this.rowActions = rowActions;
        this.actionHandlers = actionHandlers;
        this.onSave = onSave;
        this.onRevert = onRevert;
        this.rowClass = rowClass
        this.validator = createRequiredFieldValidator(`#${containerId}`, validatorOptions);
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = this.data
        .map((item, index) => this.renderRow(item, index))
        .join("");

        this.validator.initialize();
        updateSaveButton({ saveButton: "save-btn" });
    }

    renderRow(item, index) {
        const hasDeleteAction = this.rowActions.includes("delete");
        const actionsClass = hasDeleteAction ? "actions no-border-white-bg" : "actions";
        return `
        <tr class="${this.rowClass}">
            <td>${item[this.idField]}</td>
            ${this.columns.map((col) => this.renderField(col, item, index)).join("")}
            <td class="$${actionsClass}">
                ${this.rowActions.map((action) => {
                    let actionClass = "";
                    if (action === "delete") actionClass = "delete-btn";
                    else if (action === "edit") actionClass = "edit-btn";
                    else if (action === "view") actionClass = "view-btn";
                    return `<button class="${actionClass} action-btn" data-action="${action}" data-id="${item[this.idField]}">
                        <i class="fa-solid fa-${action === "delete" ? "trash" : action === "edit" ? "pen-to-square" : "eye"}"></i>
                    </button>`;
                }).join("")}
            </td>
        </tr>`;
    }

    renderField(col, item, index) {
        const value = item[col.name] ?? "";
        let html = "";
        if(col.type === "text"){
            html = `<td contenteditable="true" class="editable ${col.required ? "required" : ""} ${col.class || ""}" data-field="${col.name}" data-index="${index}" data-initial-value="${value}">${value}</td>`;
        } else if (col.type === "checkbox") {
            html = `<td data-field="${col.name}" data-index="${index}" data-initial-value="${value}" ><input type="checkbox" class="editable ${col.class || ""}" ${value ? "checked" : ""}></td>`
        } else if(col.type === "select") {
            html = `<td  data-field="${col.name}" data-index="${index}" data-initial-value="${value}"><select class="editable ${col.required ? "required" : ""} ${col.class || ""}">`;
            html += `<option value="">Select...</option>`;
            const options = col.options || [];
            const isInActive = col.handleInactive && value && !options.includes(value);
            if(isInActive) {
                html += `<option value="${value}" selected disabled>${value} (Inactive)</option>`;
            }
            html += col.options.map((opt) => `<option value="${opt}" ${opt === value && !isInActive ? "selected" : ""}>${opt}</option>`).join("");
            html += `</select></td>`;
        } else if (col.type === "number") {
            html = `<td data-field="${col.name}" data-index="${index}" data-initial-value="${value}"><input type="number" class="editable ${col.required ? "required" : ""} ${col.class || ""}" value="${value}"`;
            if(col.attributes) {
                for (const [key, val] of Object.entries(col.attributes)) {
                    html += `${key}="${val}"`;
                }
            }
            html += `></td>`;
        }
        return html;
    }

    setupEventListeners() {
        const handlers = {
            "input:td[contenteditable='true'].editable": (target) => {
                const initialValue = target.dataset.initialValue;
                const currentValue = target.innerText.trim();
                target.classList.toggle("modified", currentValue !== initialValue);
                updateSaveButton({ saveButton: "save-btn"});
            },
            "change:.editable" : (target) => {
                const cell = target.closest("td");
                const initialValue = target.dataset.initialValue;
                let currentValue;
                if(target.type === "checkbox") {
                    currentValue = target.checked.toString();
                } else if (target.tagName === "SELECT") {
                    currentValue = target.value;
                } else if (target.type === "number") {
                    currentValue = target.value;
                }
                cell.classList.toggle("modified", currentValue !== initialValue);
                updateSaveButton({ saveButton: "save-btn" });
            },
            "click:.action-btn": (target) => {
                const action = target.dataset.action;
                const id = target.dataset.id;
                if(action === "delete") {
                    if (confirm("Are you sure you want to delete this item?")) {
                        this.actionHandlers.delete(id);
                    }
                } else if (this.actionHandlers[action]) {
                    this.actionHandlers[action](id);
                }
            },
        };
        attachEventListeners(this.container, handlers)
    }

    async handleSave() {
        if(!this.validator.validateAll()) return;
        const modifiedData = this.getModifiedData();
        await this.onSave(modifiedData);
        this.render();
    }

    revert() {
        const row = this.container.querySelectorAll("tr");
        row.forEach((row) => {
            this.columns.forEach((col) => {
                const cell = row.querySelector(`td[data-field="${col.name}"]`);
                if(cell) {
                    const initialValue = cell.dataset.initialValue;
                    if(col.type === "text") {
                        cell.innerText = initialValue;
                    } else if (col.type === "checkbox") {
                        cell.querySelector("input").checked = initialValue === "true";
                    } else if (col.type === "number") {
                        cell.querySelector("input").value = initialValue;
                    }
                    cell.classList.remove("modified")
                }
            });
        });
        this.validator.clearHighLights();
        this.validator.initialize();
        updateSaveButton({ saveButton: "save-btn" });
        if(this.onRevert) this.onRevert();
    }

    getModifiedData() {
        const modifiedRows = [];
        const rows = this.container.querySelectorAll("tr");
        rows.forEach((row, index) => {
            const modifiedCells = row.querySelectorAll("td.modified");
            if(modifiedCells.length > 0) {
                const item = this.data[index];
                const modifiedFields = {};
                this.columns.forEach((col) => {
                    const cell = row.querySelector(`td[data-field="${col.name}"]`);
                    if( cell && cell.classList.contains("modified")) {
                        let value;
                        if( col.type === "text" ) {
                            value = cell.innerText.trim();
                        } else if (col.type === "checkbox") {
                            value = cell.querySelector("input").checked;
                        } else if (col.type === "select") {
                            value = cell.querySelector("select").value;
                        } else if (col.type === "number") {
                            value = parseInt(cell.querySelector("input").value, 10);
                        }
                        modifiedFields[col.apiName || col.name] = value;
                    }
                });
                modifiedRows.push({ id: item[this.idField], ...modifiedFields});
            }
        })
        return modifiedRows;
    }

    setData(newData) {
        this.data = newData;
        this.render();
    }
}

export { Table };
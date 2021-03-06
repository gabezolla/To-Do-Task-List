"use strict";
var View;
(function (View) {
    var ToDoItem = Model.ToDoItem;
    /**
     * A Tab component
     */
    class TabView {
        constructor(tabEl, contentEl) {
            this.tabEl = tabEl;
            this.contentEl = contentEl;
        }
        /**
         * Remove all lines from list
         */
        clearContainer() {
            var _a;
            while ((_a = this.contentEl) === null || _a === void 0 ? void 0 : _a.lastChild) {
                this.contentEl.removeChild(this.contentEl.lastChild);
            }
        }
        /**
         * Whether the current is active (i.e. being shown)
         * @returns true if active, false otherwise
         */
        isActive() {
            var _a;
            return ((_a = this.tabEl) === null || _a === void 0 ? void 0 : _a.classList.contains("active")) || false;
        }
        /**
         * Returns the ids of all checked items
         * @returns a list of ids (as numbers)
         */
        getCheckedIds() {
            var _a;
            const checks = (_a = this.contentEl) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".form-check-input:checked");
            const ids = [];
            checks === null || checks === void 0 ? void 0 : checks.forEach(check => {
                const id = parseInt(check.getAttribute("data-id") || "");
                if (id)
                    ids.push(id);
            });
            return ids;
        }
    }
    View.TabView = TabView;
    /**
     * A Tab component that lists items in reverse chronological order
     */
    class NewestView extends TabView {
        /**
         * Comparable to sort items in descending date order
         * @param a
         * @param b
         * @returns
         */
        compare(a, b) {
            const dateA = Date.parse(a.deadline || "");
            const dateB = Date.parse(b.deadline || "");
            /**
             * Criteria for descending date order
             * a?.deadline < b?.deadline -> 1
             * a.deadline > b.deadline -> -1
             * a.deadline = b.deadline = 0
             * We should also account for null values
             */
            if (dateA && dateB) {
                if (dateA < dateB) {
                    return 1;
                }
                else if (dateA > dateB) {
                    return -1;
                }
                return 0;
            }
            else if (!dateA && dateB) {
                return 1;
            }
            else if (dateA && !dateB) {
                return -1;
            }
            return 0;
        }
        /**
         * Fill the container with a list of todo items
         * @param items a list of todo items
         */
        render(items) {
            var _a, _b, _c;
            items.sort(this.compare);
            this.clearContainer();
            for (const item of items) {
                const template = document.querySelector("#list-item-template");
                const clone = template.content.cloneNode(true);
                const listItem = clone.querySelector(".list-group-item");
                const checkBox = clone.querySelector(".form-check-input");
                const description = clone.querySelector(".list-item-desc");
                const badgeContainer = clone.querySelector(".badge-container");
                const deadline = clone.querySelector(".list-item-deadline");
                const badgeTemplate = badgeContainer === null || badgeContainer === void 0 ? void 0 : badgeContainer.querySelector(".list-item-badge");
                checkBox === null || checkBox === void 0 ? void 0 : checkBox.setAttribute("data-id", ((_a = item.id) === null || _a === void 0 ? void 0 : _a.toString()) || "");
                if (description) {
                    description.textContent = item.description;
                }
                if (item.tags) {
                    for (const tag of item.tags) {
                        const newBadge = badgeTemplate === null || badgeTemplate === void 0 ? void 0 : badgeTemplate.cloneNode();
                        newBadge.textContent = tag;
                        badgeContainer === null || badgeContainer === void 0 ? void 0 : badgeContainer.append(newBadge);
                    }
                }
                (_b = badgeTemplate === null || badgeTemplate === void 0 ? void 0 : badgeTemplate.parentElement) === null || _b === void 0 ? void 0 : _b.removeChild(badgeTemplate);
                if (deadline) {
                    const date = Date.parse(item.deadline || "");
                    deadline.textContent = (date) ? new Date(date).toUTCString().slice(0, 16) : "";
                }
                if (listItem) {
                    (_c = this.contentEl) === null || _c === void 0 ? void 0 : _c.append(listItem);
                }
            }
        }
    }
    View.NewestView = NewestView;
    /**
     * List items by oldest chronological order
     */
    class OldestView extends TabView {
        // TODO: implement oldest list
        /**
         * Comparable to sort items in ascending date order
         * @param a
         * @param b
         * @returns
         */
        compare(a, b) {
            const dateA = Date.parse(a.deadline || "");
            const dateB = Date.parse(b.deadline || "");
            if (dateA && dateB) {
                if (dateA > dateB) {
                    return 1;
                }
                else if (dateA < dateB) {
                    return -1;
                }
                return 0;
            }
            else if (!dateA && dateB) {
                return 1;
            }
            else if (dateA && !dateB) {
                return -1;
            }
            return 0;
        }
        render(items) {
            var _a, _b, _c;
            items.sort(this.compare);
            this.clearContainer();
            for (const item of items) {
                const template = document.querySelector("#list-item-template");
                const clone = template.content.cloneNode(true);
                const listItem = clone.querySelector(".list-group-item");
                const checkBox = clone.querySelector(".form-check-input");
                const description = clone.querySelector(".list-item-desc");
                const badgeContainer = clone.querySelector(".badge-container");
                const deadline = clone.querySelector(".list-item-deadline");
                const badgeTemplate = badgeContainer === null || badgeContainer === void 0 ? void 0 : badgeContainer.querySelector(".list-item-badge");
                checkBox === null || checkBox === void 0 ? void 0 : checkBox.setAttribute("data-id", ((_a = item.id) === null || _a === void 0 ? void 0 : _a.toString()) || "");
                if (description) {
                    description.textContent = item.description;
                }
                if (item.tags) {
                    for (const tag of item.tags) {
                        const newBadge = badgeTemplate === null || badgeTemplate === void 0 ? void 0 : badgeTemplate.cloneNode();
                        newBadge.textContent = tag;
                        badgeContainer === null || badgeContainer === void 0 ? void 0 : badgeContainer.append(newBadge);
                    }
                }
                (_b = badgeTemplate === null || badgeTemplate === void 0 ? void 0 : badgeTemplate.parentElement) === null || _b === void 0 ? void 0 : _b.removeChild(badgeTemplate);
                if (deadline) {
                    const date = Date.parse(item.deadline || "");
                    deadline.textContent = (date) ? new Date(date).toUTCString().slice(0, 16) : "";
                }
                if (listItem) {
                    (_c = this.contentEl) === null || _c === void 0 ? void 0 : _c.append(listItem);
                }
            }
        }
    }
    View.OldestView = OldestView;
    /**
     * List items grouped by tags
    */
    class TagsView extends TabView {
        constructor() {
            super(...arguments);
            this.tagsArray = [];
        }
        compare(a, b) {
            const dateA = Date.parse(a.deadline || "");
            const dateB = Date.parse(b.deadline || "");
            if (dateA && dateB) {
                if (dateA < dateB) {
                    return 1;
                }
                else if (dateA > dateB) {
                    return -1;
                }
                return 0;
            }
            else if (!dateA && dateB) {
                return 1;
            }
            else if (dateA && !dateB) {
                return -1;
            }
            return 0;
        }
        storeInArray(items) {
            var _a, _b;
            for (const item of items) {
                if (((_a = item.tags) === null || _a === void 0 ? void 0 : _a.length) == 0 && (this.tagsArray.some((value, index, array) => value == 'untagged')) == false) {
                    this.tagsArray.push('untagged');
                }
                if (((_b = item.tags) === null || _b === void 0 ? void 0 : _b.length) == 0) {
                    item.tags[0] = 'untagged';
                }
                if (item.tags) {
                    for (const tag of item.tags) {
                        if ((this.tagsArray.some((value, index, array) => value == tag)) == false) {
                            this.tagsArray.push(tag);
                        }
                    }
                }
            }
        }
        appendItems(items) {
            var _a;
            const insertContainer = document.querySelector(".complete-container");
            items.sort(this.compare);
            for (let item of items) {
                if (item.tags) {
                    for (const tag of item.tags) {
                        const template = document.querySelector("#list-item-by-tag-template");
                        const clone = template.content.cloneNode(true);
                        const listItem = clone.querySelector(".list-group-item");
                        const checkBox = clone.querySelector(".form-check-input");
                        const description = clone.querySelector(".list-item-desc");
                        const deadline = clone.querySelector(".list-item-deadline");
                        checkBox === null || checkBox === void 0 ? void 0 : checkBox.setAttribute("data-id", ((_a = item.id) === null || _a === void 0 ? void 0 : _a.toString()) || "");
                        if (description) {
                            description.textContent = item.description;
                        }
                        if (deadline) {
                            const date = Date.parse(item.deadline || "");
                            deadline.textContent = (date) ? new Date(date).toUTCString().slice(0, 16) : "";
                        }
                        if (listItem) {
                            const divTag = insertContainer.querySelector(`.${tag}`);
                            if (divTag) {
                                divTag.appendChild(listItem);
                            }
                        }
                    }
                }
            }
        }
        // todo: implement tags group list
        render(items) {
            var _a;
            this.tagsArray = [];
            this.clearContainer();
            this.storeInArray(items);
            const template = document.querySelector("#list-by-tag-template");
            const clone = template.content.cloneNode(true);
            const completeContainer = clone.querySelector(".complete-container");
            this.tagsArray.sort(function (a, b) {
                if (a < b) {
                    return -1;
                }
                if (a > b) {
                    return 1;
                }
                return 0;
            });
            for (let tag of this.tagsArray) {
                let template = document.querySelector("#list-by-tag-template");
                let clone = template.content.cloneNode(true);
                let badgeContainer = clone.querySelector(".badge-container");
                let badgeTemplate = badgeContainer === null || badgeContainer === void 0 ? void 0 : badgeContainer.querySelector(".list-item-badge");
                let temporaryContainer = document.createElement('div');
                if (temporaryContainer)
                    temporaryContainer.classList.add(`${tag}`);
                if (badgeTemplate) {
                    if (badgeContainer) {
                        badgeContainer.appendChild(badgeTemplate);
                        badgeTemplate.textContent = `${tag}`;
                        temporaryContainer.appendChild(badgeContainer);
                    }
                }
                completeContainer === null || completeContainer === void 0 ? void 0 : completeContainer.append(temporaryContainer);
            }
            if (completeContainer)
                (_a = this.contentEl) === null || _a === void 0 ? void 0 : _a.append(completeContainer);
            this.appendItems(items);
        }
    }
    View.TagsView = TagsView;
    /**
     * A Component representing the insertion form
     */
    class AddView {
        constructor(container) {
            var _a, _b;
            this.container = container;
            this.form = (_a = this.container) === null || _a === void 0 ? void 0 : _a.querySelector("#item-form");
            this.modalRef = new bootstrap.Modal(this.container);
            (_b = this.container) === null || _b === void 0 ? void 0 : _b.addEventListener("hidden.bs.modal", () => this.form.reset());
        }
        /**
         * Convert the form fields to a domain object
         * @returns a todo item
         */
        parse() {
            const descriptionEl = this.form.querySelector("#description");
            const tagsEl = this.form.querySelector("#tags");
            const deadlineEl = this.form.querySelector("#deadline");
            const newItem = new ToDoItem(descriptionEl.value);
            newItem.tags = tagsEl.value.split(",")
                .map(s => s.trim()).filter(s => s.length > 0);
            newItem.deadline = deadlineEl.value || "";
            return newItem;
        }
        /**
         *
         * @param args Shows the form
         */
        render(args) {
            this.modalRef.show();
        }
        /**
         * Hides the form
         */
        dismiss() {
            this.modalRef.hide();
        }
        /**
         * Enable the form
         */
        enable() {
            var _a;
            (_a = this.container) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".item-form-field").forEach(field => field.removeAttribute("disabled"));
        }
        /**
         * Disable the form
         */
        disable() {
            var _a;
            (_a = this.container) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".item-form-field").forEach(field => field.setAttribute("disabled", ""));
        }
    }
    View.AddView = AddView;
    /**
     * A component representing the edit form.
     */
    class EditView {
        constructor(container) {
            var _a, _b;
            this.container = container;
            this.form = (_a = this.container) === null || _a === void 0 ? void 0 : _a.querySelector("#item-form-edit");
            this.modalRef = new bootstrap.Modal(this.container);
            (_b = this.container) === null || _b === void 0 ? void 0 : _b.addEventListener("hidden.bs.modal", () => this.form.reset());
        }
        /**
         * Convert the form fields to a domain object
         * @returns a todo item
         */
        parse(id) {
            const descriptionEl = this.form.querySelector("#description-edit");
            const tagsEl = this.form.querySelector("#tags-edit");
            const deadlineEl = this.form.querySelector("#deadline-edit");
            const newItem = new ToDoItem(descriptionEl.value);
            newItem.id = id;
            newItem.tags = tagsEl.value.split(",")
                .map(s => s.trim()).filter(s => s.length > 0);
            newItem.deadline = deadlineEl.value || "";
            return newItem;
        }
        fill(item) {
            var _a, _b, _c;
            const formModal = document.querySelector('#form-modal-edit');
            if (formModal) {
                (_a = (formModal.querySelector('#description-edit'))) === null || _a === void 0 ? void 0 : _a.setAttribute('value', item.description);
                if (item.tags != null)
                    (_b = (formModal.querySelector('#tags-edit'))) === null || _b === void 0 ? void 0 : _b.setAttribute('value', item.tags.toString());
                else
                    (_c = (formModal.querySelector('#tags-edit'))) === null || _c === void 0 ? void 0 : _c.setAttribute('value', '');
                if (item.deadline) {
                    let deadlineDate = formModal.querySelector('#deadline-edit');
                    let date = new Date(item.deadline);
                    deadlineDate.valueAsDate = date;
                }
            }
            this.container = formModal;
            return formModal;
        }
        /**
         *
         * @param args Shows the form
         */
        render(args) {
            this.modalRef.show();
        }
        /**
         * Hides the form
         */
        dismiss() {
            this.modalRef.hide();
        }
        /**
         * Enable the form
         */
        enable() {
            var _a;
            (_a = this.container) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".item-form-field").forEach(field => field.removeAttribute("disabled"));
        }
        /**
         * Disable the form
         */
        disable() {
            var _a;
            (_a = this.container) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".item-form-field").forEach(field => field.setAttribute("disabled", ""));
        }
    }
    View.EditView = EditView;
    /**
     * A view that represents an action button
     */
    class ActionButtonView {
        constructor(container) {
            this.container = container;
        }
        render(args) { }
        /**
         * Put the button in enabled state
         */
        enable() {
            var _a;
            (_a = this.container) === null || _a === void 0 ? void 0 : _a.classList.remove("disabled");
        }
        /**
         * Put the button in disabled state
         */
        disable() {
            var _a;
            (_a = this.container) === null || _a === void 0 ? void 0 : _a.classList.add("disabled");
        }
    }
    View.ActionButtonView = ActionButtonView;
    /**
     * Enumeration of notification styles
     */
    let NotificationStyle;
    (function (NotificationStyle) {
        NotificationStyle["success"] = "bg-success";
        NotificationStyle["error"] = "bg-danger";
        NotificationStyle["info"] = "bg-primary";
    })(NotificationStyle || (NotificationStyle = {}));
    /**
     * A component that shows a notification for various types of messages
     */
    class NotificationView {
        constructor() {
            var _a;
            this.toastEl = document.querySelector("#toast");
            this.toast = new bootstrap.Toast(this.toastEl);
            this.messageNode = ((_a = this.toastEl) === null || _a === void 0 ? void 0 : _a.querySelector(".toast-body")) || null;
        }
        /**
         * Renders a message
         * @param message the text message to render
         */
        render(message) {
            if (this.messageNode) {
                this.messageNode.textContent = message;
                this.toast.show();
            }
        }
        /**
         * Set the message style
         * @param style a possible style
         */
        setStyle(style) {
            var _a, _b, _c, _d;
            (_a = this.toastEl) === null || _a === void 0 ? void 0 : _a.classList.remove(NotificationStyle.error);
            (_b = this.toastEl) === null || _b === void 0 ? void 0 : _b.classList.remove(NotificationStyle.success);
            (_c = this.toastEl) === null || _c === void 0 ? void 0 : _c.classList.remove(NotificationStyle.info);
            (_d = this.toastEl) === null || _d === void 0 ? void 0 : _d.classList.add(style);
        }
        /**
         * Shows a success message
         * @param message the text message
         */
        success(message) {
            this.setStyle(NotificationStyle.success);
            this.render(message);
        }
        /**
         * Shows an error message
         * @param message the text message
         */
        error(message) {
            this.setStyle(NotificationStyle.error);
            this.render(message);
        }
        /**
         * Shows an informational message
         * @param message the text message
         */
        info(message) {
            this.setStyle(NotificationStyle.info);
            this.render(message);
        }
    }
    View.NotificationView = NotificationView;
})(View || (View = {}));

namespace View {
    /**
     * Global reference to the bootstrap object
     */
    declare var bootstrap: any

    /**
     * Custom helper types
     */
    type NElement = Element | null
    import ToDoItem = Model.ToDoItem

    /**
     * The root of the view hierarchy
     */
    export interface View {
        /**
         * Renders the dynamic (or static) content of a view component
         * @param args anything
         */
        render(args: any): void
    }

    /**
     * A Tab component
     */
    export abstract class TabView implements View { // implementa o View.
        tabEl: NElement
        contentEl: NElement

        constructor(tabEl: NElement, contentEl: NElement) {
            this.tabEl = tabEl
            this.contentEl = contentEl
        }

        /**
         * Remove all lines from list
         */
        protected clearContainer() {
            while (this.contentEl?.lastChild) {
                this.contentEl.removeChild(this.contentEl.lastChild)
            }
        }

        /**
         * Whether the current is active (i.e. being shown)
         * @returns true if active, false otherwise
         */
        isActive(): boolean {
            return this.tabEl?.classList.contains("active") || false
        }

        /**
         * Returns the ids of all checked items
         * @returns a list of ids (as numbers)
         */
        getCheckedIds(): number[] {
            const checks = this.contentEl?.querySelectorAll(".form-check-input:checked")
            const ids: number[] = []

            checks?.forEach(check => {
                const id = parseInt(check.getAttribute("data-id") || "")
                if (id) ids.push(id)
            })

            return ids
        }

        abstract render(items: ToDoItem[]): void
    }

    /**
     * A Tab component that lists items in reverse chronological order
     */
    export class NewestView extends TabView {

        /**
         * Comparable to sort items in descending date order
         * @param a 
         * @param b 
         * @returns 
         */
        private compare(a: ToDoItem, b: ToDoItem) {
            const dateA = Date.parse(a.deadline || "")
            const dateB = Date.parse(b.deadline || "")

            /**
             * Criteria for descending date order
             * a?.deadline < b?.deadline -> 1
             * a.deadline > b.deadline -> -1
             * a.deadline = b.deadline = 0
             * We should also account for null values
             */
            if (dateA && dateB) {
                if (dateA < dateB) {
                    return 1
                } else if (dateA > dateB) {
                    return -1
                }
                return 0
            } else if (!dateA && dateB) {
                return 1
            } else if (dateA && !dateB) {
                return -1
            }

            return 0
        }        

        /**
         * Fill the container with a list of todo items
         * @param items a list of todo items
         */
        render(items: ToDoItem[]): void {
            items.sort(this.compare)
            this.clearContainer()
            for (const item of items) {
                const template = document.querySelector("#list-item-template") as HTMLTemplateElement
                const clone = template.content.cloneNode(true) as DocumentFragment
                const listItem = clone.querySelector(".list-group-item")
                const checkBox = clone.querySelector(".form-check-input")
                const description = clone.querySelector(".list-item-desc")
                const badgeContainer = clone.querySelector(".badge-container")
                const deadline = clone.querySelector(".list-item-deadline")
                const badgeTemplate = badgeContainer?.querySelector(".list-item-badge")

                checkBox?.setAttribute("data-id", item.id?.toString() || "")
                if (description) {
                    description.textContent = item.description
                }
                if (item.tags) {
                    for (const tag of item.tags) {
                        const newBadge = badgeTemplate?.cloneNode() as Element

                        newBadge.textContent = tag
                        badgeContainer?.append(newBadge)
                    }
                }
                badgeTemplate?.parentElement?.removeChild(badgeTemplate)
                if (deadline) {
                    const date = Date.parse(item.deadline || "")
                    deadline.textContent = (date) ? new Date(date).toUTCString().slice(0,16) : ""
                }
                if (listItem) {
                    this.contentEl?.append(listItem)
                }
            }
        }

    }

    /**
     * List items by oldest chronological order
     */
    export class OldestView extends TabView {
        // TODO: implement oldest list
        /**
         * Comparable to sort items in ascending date order
         * @param a 
         * @param b 
         * @returns 
         */
        private compare(a: ToDoItem, b: ToDoItem) {
            const dateA = Date.parse(a.deadline || "")
            const dateB = Date.parse(b.deadline || "")
            
            if (dateA && dateB) {
                if (dateA > dateB) {
                    return 1
                } else if (dateA < dateB) {
                    return -1
                }
                return 0
            } else if (!dateA && dateB) {
                return 1
            } else if (dateA && !dateB) {
                return -1
            }

            return 0
        }

        render(items: ToDoItem[]): void {
                items.sort(this.compare)
                this.clearContainer()
                for (const item of items) {
                    const template = document.querySelector("#list-item-template") as HTMLTemplateElement
                    const clone = template.content.cloneNode(true) as DocumentFragment
                    const listItem = clone.querySelector(".list-group-item")
                    const checkBox = clone.querySelector(".form-check-input")
                    const description = clone.querySelector(".list-item-desc")
                    const badgeContainer = clone.querySelector(".badge-container")
                    const deadline = clone.querySelector(".list-item-deadline")
                    const badgeTemplate = badgeContainer?.querySelector(".list-item-badge")
    
                    checkBox?.setAttribute("data-id", item.id?.toString() || "")
                    if (description) {
                        description.textContent = item.description
                    }
                    if (item.tags) {
                        for (const tag of item.tags) {
                            const newBadge = badgeTemplate?.cloneNode() as Element
    
                            newBadge.textContent = tag
                            badgeContainer?.append(newBadge)
                        }
                    }
                    badgeTemplate?.parentElement?.removeChild(badgeTemplate)
                    if (deadline) {
                        const date = Date.parse(item.deadline || "")
                        deadline.textContent = (date) ? new Date(date).toUTCString().slice(0,16) : ""
                    }
                    if (listItem) {
                        this.contentEl?.append(listItem)
                    }
                }
            }
    }

    /**
     * List items grouped by tags
    */         
    export class TagsView extends TabView {

        private tagsArray : string[] = [];

        private compare(a: ToDoItem, b: ToDoItem) {
            const dateA = Date.parse(a.deadline || "")
            const dateB = Date.parse(b.deadline || "")

            if (dateA && dateB) {
                if (dateA < dateB) {
                    return 1
                } else if (dateA > dateB) {
                    return -1
                }
                return 0
            } else if (!dateA && dateB) {
                return 1
            } else if (dateA && !dateB) {
                return -1
            }
            return 0
        }
        
        private storeInArray(items : ToDoItem[]) {
            for (const item of items) {
                if (item.tags?.length == 0 && (this.tagsArray.some((value, index, array) => value == 'untagged')) == false) {
                    this.tagsArray.push('untagged');
                }

                if (item.tags?.length == 0) {
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
        
        private appendItems(items : ToDoItem[]) {
            const insertContainer = document.querySelector(".complete-container");
            items.sort(this.compare);
            
            for (let item of items) {
                if (item.tags) {
                    for (const tag of item.tags) {
                        const template = document.querySelector("#list-item-by-tag-template") as HTMLTemplateElement
                        const clone = template.content.cloneNode(true) as DocumentFragment
                        const listItem = clone.querySelector(".list-group-item")
                        const checkBox = clone.querySelector(".form-check-input")
                        const description = clone.querySelector(".list-item-desc")
                        const deadline = clone.querySelector(".list-item-deadline")

                        checkBox?.setAttribute("data-id", item.id?.toString() || "")

                        if (description) {
                            description.textContent = item.description
                        }

                        if (deadline) {
                            const date = Date.parse(item.deadline || "")
                            deadline.textContent = (date) ? new Date(date).toUTCString().slice(0, 16) : ""
                        }

                        if (listItem) {
                            const divTag = insertContainer!.querySelector(`.${tag}`);

                            if (divTag) {
                                divTag.appendChild(listItem);
                            }
                        }    
                    }
                } 
            }
        }

        // todo: implement tags group list
        render(items: ToDoItem[]): void {
            this.tagsArray = [];
            this.clearContainer();                
            this.storeInArray(items);
            const template = document.querySelector("#list-by-tag-template") as HTMLTemplateElement
            const clone = template.content.cloneNode(true) as DocumentFragment
            const completeContainer = clone.querySelector(".complete-container")

            this.tagsArray.sort(function(a, b){
                if(a < b) { return -1; }
                if(a > b) { return 1; }
                return 0;
            });

            for (let tag of this.tagsArray) {
                let template = document.querySelector("#list-by-tag-template") as HTMLTemplateElement
                let clone = template.content.cloneNode(true) as DocumentFragment
                let badgeContainer = clone.querySelector(".badge-container")
                let badgeTemplate = badgeContainer?.querySelector(".list-item-badge")
                
                let temporaryContainer = document.createElement('div');
                if (temporaryContainer) temporaryContainer.classList.add(`${tag}`);                

                if (badgeTemplate) {
                    if (badgeContainer) {
                        badgeContainer.appendChild(badgeTemplate);
                        badgeTemplate.textContent = `${tag}`;
                        temporaryContainer.appendChild(badgeContainer);
                    }
                }

                completeContainer?.append(temporaryContainer);
            }
            
            if (completeContainer) this.contentEl?.append(completeContainer);
            this.appendItems(items);
        }
    }

    /**
     * A Component representing the insertion form
     */
    export class AddView implements View {
        container: NElement
        modalRef: any
        form: HTMLFormElement

        constructor(container: NElement) {
            this.container = container
            this.form = this.container?.querySelector("#item-form") as HTMLFormElement
            this.modalRef = new bootstrap.Modal(this.container)

            this.container?.addEventListener("hidden.bs.modal", 
                () => this.form.reset())
        }

        /**
         * Convert the form fields to a domain object
         * @returns a todo item
         */
        parse(): ToDoItem {
            const descriptionEl = this.form.querySelector("#description") as HTMLInputElement
            const tagsEl = this.form.querySelector("#tags") as HTMLInputElement
            const deadlineEl = this.form.querySelector("#deadline") as HTMLInputElement
            const newItem = new ToDoItem(descriptionEl.value)

            newItem.tags = tagsEl.value.split(",")
                .map(s => s.trim()).filter(s => s.length > 0)
            newItem.deadline = deadlineEl.value || ""

            return newItem
        }

        /**
         * 
         * @param args Shows the form
         */
        render(args: any): void {
            this.modalRef.show()
        }
        
        /**
         * Hides the form
         */
        dismiss() {
            this.modalRef.hide()
        }

        /**
         * Enable the form
         */
        enable() {
            this.container?.querySelectorAll(".item-form-field")
                .forEach(field => field.removeAttribute("disabled"))
        }

        /**
         * Disable the form
         */
        disable() {
            this.container?.querySelectorAll(".item-form-field")
                .forEach(field => field.setAttribute("disabled", ""))
        }

    }

    /**
     * A component representing the edit form.
     */
    export class EditView implements View {

        container: NElement
        modalRef: any
        form: HTMLFormElement

        constructor(container: NElement) {
            this.container = container
            this.form = this.container?.querySelector("#item-form-edit") as HTMLFormElement
            this.modalRef = new bootstrap.Modal(this.container)

            this.container?.addEventListener("hidden.bs.modal", 
                () => this.form.reset())
        }

        /**
         * Convert the form fields to a domain object
         * @returns a todo item
         */

        parse(id: number): ToDoItem {
            const descriptionEl = this.form.querySelector("#description-edit") as HTMLInputElement
            const tagsEl = this.form.querySelector("#tags-edit") as HTMLInputElement
            const deadlineEl = this.form.querySelector("#deadline-edit") as HTMLInputElement
            const newItem = new ToDoItem(descriptionEl.value)
            newItem.id = id;

            newItem.tags = tagsEl.value.split(",")
                .map(s => s.trim()).filter(s => s.length > 0)
            newItem.deadline = deadlineEl.value || ""

            return newItem
        }

        fill(item: ToDoItem): NElement {
            const formModal = document.querySelector('#form-modal-edit');

            if(formModal) {
                (formModal.querySelector('#description-edit'))?.setAttribute('value', item.description);

                if (item.tags != null) (formModal.querySelector('#tags-edit'))?.setAttribute('value', item.tags.toString());
                else (formModal.querySelector('#tags-edit'))?.setAttribute('value', '')

                if (item.deadline) {
                    let deadlineDate = formModal.querySelector('#deadline-edit') as HTMLInputElement;
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
        render(args: any): void {
            this.modalRef.show()
        }
        
        /**
         * Hides the form
         */
        dismiss() {
            this.modalRef.hide()
        }

        /**
         * Enable the form
         */
        enable() {
            this.container?.querySelectorAll(".item-form-field")
                .forEach(field => field.removeAttribute("disabled"))
        }

        /**
         * Disable the form
         */
        disable() {
            this.container?.querySelectorAll(".item-form-field")
                .forEach(field => field.setAttribute("disabled", ""))
        }
    }

    /**
     * A view that represents an action button
     */
    export class ActionButtonView implements View {
        container: NElement

        constructor(container: NElement) {
            this.container = container
        }

        render(args: any): void {}

        /**
         * Put the button in enabled state
         */
        enable() {
            this.container?.classList.remove("disabled")
        }

        /**
         * Put the button in disabled state
         */
        disable() {
            this.container?.classList.add("disabled")
        }
    }

    /**
     * Enumeration of notification styles
     */
    enum NotificationStyle {
        success = "bg-success",
        error = "bg-danger",
        info = "bg-primary"
    }

    /**
     * A component that shows a notification for various types of messages
     */
    export class NotificationView implements View {
        private toastEl: NElement
        private toast: any
        private messageNode: NElement

        constructor() {
            this.toastEl = document.querySelector("#toast")
            this.toast = new bootstrap.Toast(this.toastEl)
            this.messageNode = this.toastEl?.querySelector(".toast-body") || null
        }

        /**
         * Renders a message
         * @param message the text message to render
         */
        render(message: string): void {
            if (this.messageNode) {
                this.messageNode.textContent = message
                this.toast.show()
            }
        }

        /**
         * Set the message style
         * @param style a possible style
         */
        private setStyle(style: NotificationStyle) {
            this.toastEl?.classList.remove(NotificationStyle.error)
            this.toastEl?.classList.remove(NotificationStyle.success)
            this.toastEl?.classList.remove(NotificationStyle.info)
            this.toastEl?.classList.add(style)
        }

        /**
         * Shows a success message
         * @param message the text message
         */
        success(message: string) {
            this.setStyle(NotificationStyle.success)
            this.render(message)
        }

        /**
         * Shows an error message
         * @param message the text message
         */
        error(message: string) {
            this.setStyle(NotificationStyle.error)
            this.render(message)
        }

        /**
         * Shows an informational message
         * @param message the text message
         */
        info(message: string) {
            this.setStyle(NotificationStyle.info)
            this.render(message)
        }

    }
    
}
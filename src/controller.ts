namespace Controller {
    let newestView: View.NewestView
    let oldestView: View.OldestView
    let tagsView: View.TagsView
    let addView: View.AddView
    let addButton: View.ActionButtonView
    let removeButton: View.ActionButtonView
    let editButton : View.ActionButtonView
    let editView: View.EditView
    let notification: View.NotificationView
    const dynamicViews: View.TabView[] = []
    const dao = new Model.ToDoItemDAO()

    /**
     * Determines which view component is being shown currently
     * @returns the active view
     */
    const getActiveView = () => dynamicViews.find(el => el.isActive())

    /**
     * Instantiate all UI components
     */
    function createComponents() {
        newestView = new View.NewestView(
            document.querySelector("#newest-tab"),
            document.querySelector("#newest-content"))

        oldestView = new View.OldestView(document.querySelector("#oldest-tab"), document.querySelector("#oldest-content"))
        tagsView = new View.TagsView(document.querySelector('#tags-tab'), document.querySelector('#tags-pane'))
        
        addView = new View.AddView(document.querySelector("#form-modal"))    
        addButton = new View.ActionButtonView(document.querySelector("#btn-add"))
        removeButton = new View.ActionButtonView(document.querySelector("#btn-remove"))
        editButton = new View.ActionButtonView(document.querySelector("#btn-edit"))
        notification = new View.NotificationView()
        editView = new View.EditView(document.querySelector("#form-modal-edit"))

        dynamicViews.push(newestView, oldestView, tagsView) // TODO: add "oldest" and "tags" components here too 
    }

    /**
     * Refresh the list of tasks (currently we have only one implemented)
     */
    function refreshActiveView() {
        dao.listAll()
            .then(items => getActiveView()?.render(items))
            .catch(error => {
                console.error(error)
                notification.error("Failed to load data from the server")
            })
    }

    /**
     * Process the batch removal of items
     */
    async function handleRemoval() {
        const checkedIds = getActiveView()?.getCheckedIds() || []
        const status: boolean[] = []

        try {
            for (const id of checkedIds) {
                status.push(await dao.removeById(id))
            }
        } catch(error) {
            console.error("Failed to perform removal operation")
            console.error(error)
        }

        if (status.length < 1) {
            notification.info("Please, select an element to remove")
        }
        else if (status.reduce((acc, s) => acc && s)) {
            notification.success("ToDo item(s) removed successfully")
        } else {
            notification.error("Failed to remove ToDo item(s)")
        }
        refreshActiveView()
    }

    /**
     * Function that updates calling the update method (from Model) the content of items.
    */
    async function handleEdit() {        
        let checkedId = getActiveView()?.getCheckedIds() || []

        try {
            let oldItem: Model.ToDoItem = await dao.getItem(checkedId[0]);
            let newItem: Model.ToDoItem;
            newItem = editView.parse((oldItem.id as number));
            await dao.update(newItem);
            refreshActiveView();
            notification.success("ToDo item edited successfully")
            editView.dismiss();
        } catch (error) {
            notification.error("Failed to edit ToDo item.")
            console.error("Failed to perform edit operation")
            console.error(error)
        }
    } 

    /**
     * Configure the toolbar components
     */
    function initToolbar() {
        addButton.container?.addEventListener("click", () =>
            addView.render(null))

        removeButton.container?.addEventListener("click", async () => {
            removeButton.disable()
            await handleRemoval()
            removeButton.enable()
        })

        editButton.container?.addEventListener("click", async () => {
            let checkedId = getActiveView()?.getCheckedIds() || []
            
            if(checkedId.length == 0) {
                notification.info("Please select an element.");
                return;
            }
            
            else {            
                let oldItem: Model.ToDoItem = await dao.getItem(checkedId[0]);
                editView.fill(oldItem);
                editView.render(null);
            }
        })
    }

    /**
     * Handle the insert operation
     */
    async function handleInsert() {
        try {
            const status = await dao.insert(addView.parse())
            refreshActiveView()
            notification.success("Element added successfully")
        } catch(error) {
            console.error("Failed to process update operation")
            notification.error("Failed to add element")
        }
        addView.dismiss()
    }

    /**
     * Configure the AddView component
     */
    function initAddView() {
        addView.form.addEventListener("submit", async (ev) => {
            ev.preventDefault()
            addView.disable()
            await handleInsert()
            addView.enable()
        })
    }
    
    /**
     * Call handleEdit when form is submitted
     */
    function initEditView() {
        editView.form.addEventListener("submit", async (ev) => {
            ev.preventDefault()
            editView.disable()
            await handleEdit()
            editView.enable()
        })
    }

    /**
     * Refresh the active tab when a tab change occurs
     */
     const initDynamicViews = () => dynamicViews.forEach(
        view => view.tabEl?.addEventListener("show.bs.tab", refreshActiveView))

    /**
     * "Main" code, launch and configure the SPA
     */
    window.addEventListener("load", function () {
        createComponents()
        initToolbar()
        initDynamicViews()
        initAddView()
        initEditView()
        refreshActiveView()        
    })
}
const app = Vue.createApp({
    data() {
        return {
            title: 'To-Do-Liste',
            message: 'Willkommen zu meiner Vue.js Website!',
        }
    }
});

app.component('todo-list', {
    data() {
        return {
            newTodo: '',
            todos: JSON.parse(localStorage.getItem('todos')) || [],
            filter: 'all',
            showFilters: false
        }
    },
    methods: {
        reloadPage() {
            window.location.reload();
        },
        addTodo() {
            if (this.newTodo.trim() !== '') {
                const newTodo = {
                    id: Date.now(),
                    text: this.newTodo.trim(),
                    completed: false,
                    favorite: false,
                    editing: false
                };
                this.todos.push(newTodo);
                this.newTodo = '';
                this.saveTodos();
            }
        },
        removeTodo(todo) {
            const index = this.todos.findIndex(t => t.id === todo.id);
            if (index !== -1) {
                this.todos.splice(index, 1);
                this.saveTodos();
            }
                const audio = document.getElementById('taskTrashSound');
                audio.play();

        },
        toggleCompleted(todo) {
            todo.completed = !todo.completed;
            this.saveTodos();

            if (todo.completed) {
                const audio = document.getElementById('taskCompletedSound');
                audio.play();
            }
        },
        toggleFavorite(todo) {
            todo.favorite = !todo.favorite;
            this.saveTodos();

            if (todo.favorite) {
                const audio = document.getElementById('taskFavoriteSound');
                audio.play();
            }
        },
        editTodo(todo) {
            todo.editing = true;
        },
        saveEdit(todo) {
            todo.editing = false;
            this.saveTodos();
        },
        saveTodos() {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        },
        showAll() {
            this.filter = 'all';
        },
        showCompleted() {
            this.filter = 'completed';
        },
        showUncompleted() {
            this.filter = 'uncompleted';
        },
        getFavoriteTooltip(todo) {
            return todo.favorite ? 'Favorit entfernen' : 'Favorisieren';
        },
        toggleFilterVisibility() {
            this.showFilters = !this.showFilters;
        },
        editTodo(todo) {
            todo.editing = true;
            this.editedTodoText = todo.text;
        },
        saveEdit(todo) {
            if (this.editedTodoText.trim() !== '') {
                todo.text = this.editedTodoText.trim();
                todo.editing = false;
                this.saveTodos();
            } else {
                alert('Das Feld darf nicht leer sein.');
            }
        },
        cancelEdit(todo) {
            todo.editing = false;
        },
    },
    computed: {
        filteredTodos() {
            if (this.filter === 'completed') {
                console.log("complete tasks");
                return this.todos.filter(todo => todo.completed);
            } else if (this.filter === 'uncompleted') {
                console.log("uncomplete tasks");
                return this.todos.filter(todo => !todo.completed);
            } else {
                console.log("all tasks");
                return this.todos;
            }
        },
        tasksTitle() {
            if (this.filter === 'completed') {
                return 'Erledigte Aufgaben';
            } else if (this.filter === 'uncompleted') {
                return 'Nicht Erledigte Aufgaben';
            } else {
                return 'Alle Aufgaben';
            }
        }
    },
    template: `
    <div v-cloak>
        <input class="addNewTask" v-model="newTodo" @keyup.enter="addTodo" placeholder="Neue Aufgabe hinzufügen">
        <button class="btnAdd" @click="addTodo">Hinzufügen</button>
        <hr>
        <div class="sortByContainer">
            <i class="fas fa-filter" @click="toggleFilterVisibility" title="Filter anzeigen"></i>
            <div v-if="showFilters">
                <button @click="showAll">Alle anzeigen</button>
                <button @click="showCompleted">Nur Erledigte anzeigen</button>
                <button @click="showUncompleted">Nur Nicht-Erledigte anzeigen</button>
            </div>
        </div>
        <div class="tasksTitle" ><h2>{{ tasksTitle }}</h2></div>
        <ul>
            <li v-for="(todo, index) in filteredTodos" :key="todo.id" class="todo-item">
                <div class="todo-content">
                    <span :class="{ 'completed': todo.completed }">{{ todo.text }}</span>
                    <div v-if="todo.editing" class="edit-mode">
                        <input type="text" class="editTextField" v-model="editedTodoText">
                        <div class="edit-icons">
                            <i class="fas fa-check" @click="saveEdit(todo)" :title="'Speichern'"></i>
                            <i class="fas fa-times" @click="cancelEdit(todo)" :title="'Abbrechen'"></i>
                        </div>
                    </div>
                </div>
                <div class="todo-icons">
                    <i v-if="!todo.completed" class="fas fa-check"
                       @click="toggleCompleted(todo)"
                       :title="'Erledigt'"></i>
                    <i v-else class="fas fa-times"
                       @click="toggleCompleted(todo)"
                       :title="'Nicht erledigt'"></i>
                    <i class="fas fa-star"
                       @click="toggleFavorite(todo)"
                       :class="{ 'favorited': todo.favorite }"
                       :title="getFavoriteTooltip(todo)"></i>
                    <i class="fas fa-pen" @click="editTodo(todo)" title="Bearbeiten"></i>
                    <i class="fas fa-trash-can" @click="removeTodo(todo)" title="Löschen"></i>
                </div>
            </li>
        </ul>
    </div>
    `
});

app.mount('#app');
import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'

Vue.component('Loader', {
    template: `
        <div class="d-flex justify-content-center align-items-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
        </div>
            
    `
})

new Vue({
    el: '#app',
    data() {
        return {
            loading: false,
            form: {
                name: '',
                value: ''
            },
            contacts: []
        }
    },
    computed: {
        canCreate() {
            return this.form.name.trim() && this.form.value.trim()
        }
    },
    methods: {
        async createContact() {
            const {...contact} = this.form
            const newContact = await request('/api/contacts', 'POST', contact)

            this.contacts.push(newContact)
            this.form.name = this.form.value = ''
        },
        async markContact(id) {
            const contact = this.contacts.find(c => c.id === id) // находим текущий контакт
            const updated = await request(`api/contacts/${id}`, 'PUT', {
                ...contact,
                marked: true
            }) // ждем когда выполнится
            contact.marked = updated.marked
        },
        async removeContact(id) {
            /* делаем запрос */ await request(`/api/contacts/${id}`, 'DELETE') // ждем пока выполнится
            this.contacts = this.contacts.filter(c => c.id !== id) // если всё ок, удаляем
        }
    },
    async mounted() { // асинхронный метод, когда приложение готово к работе
        this.loading = true
        const data = await request('/api/contacts') // ждём когда эта ф-я выполнится -> получим data
                                    // т.к. запускаем клиент на том же порте, на котором работает сервер,
                                    // то можно не писать http://localhost:3011, а просто написать '/'
                                    // чтоюы подчеркнуть что работаем с api, пишем '/api'
                                    // обозначаем с какой сущностью работаем '/contacts'
        /* console.log(data) */ // в ответ приходит undefined, потому что в express обрабатываем любые GET запросы
                              // и в ответ получаем index.html (app.js app.get(...))
                              // после создания эндпоинта всё ок
        // получили контактов, обновляем их на клиенте
        this.contacts = data
        this.loading = false
    }
})

async function request(url, method = 'GET', data = null) { // ф-я для асинхронных запросов
    try {
        // если нам нужно передать данные, обрабатываем их и обозначаем что мы с ними взаимодействуем
        const headers = {} // метаданные запроса, говорящие что вообще с ним происходит
        let body // создали чтобы обработать данные

        if (data) { // если что то передаем
            headers['Content-Type'] = 'application/json',
            body = JSON.stringify(data) // сериализуем body для передачи
        }

        const response = await fetch(url, { // встроенный в браузер метод для аякс запросов
            method,
            headers,
            body
        })
        return await response.json() // читать тело ответа в формате JSON

        /*
        Параметры ответа:

        response.status – HTTP-код ответа,
        response.ok – true, если статус ответа в диапазоне 200-299.
        response.headers – похожий на Map объект с HTTP-заголовками.
        Методы для получения тела ответа:

        response.text() – возвращает ответ как обычный текст,
        response.json() – преобразовывает ответ в JSON-объект,
        response.formData() – возвращает ответ как объект FormData (кодировка form/multipart
         */

    } catch (e) {
        // debugger
        console.warn('Error', e)
    }
}
const express = require('express')
const path = require('path') // модуль для работы с путями
const {v4} = require('uuid') // v4 - генерирует id
const app = express()
// npm run dev - start nodemon. You can open localhost:3011

let CONTACTS = [  // типа база данных
     {id: v4(), /* генерируется id */ name: 'dima', value: '777', marked: false} // начальное значение
]

app.use(express.json()) // чтобы можно было работать с реквестами (req)

// создаем эндпоинт, по которому хотим получать данные
// GET
app.get('/api/contacts', (req, res) => {
     res.status(200).json(CONTACTS) // добавляем статус для этого http запроса 200 - всё ок
                                    // json() для того чтобы вернуть данные
})

// POST
app.post('/api/contacts', (req, res) => {
     // npm i uuid - библиотека для генерации id
     // console.log(req.data)
     const contact = {...req.body, id: v4(), marked: false} // пришел с фронта, при создании, (в норм приложениях на этом этапе еще
                                   // происходит серверная валидация)
     // добавляем в нашу "базу"
     CONTACTS.push(contact)
     /* отправляем ответ */ res.status(201 /* элемент создан */).json(contact)
})

// DELETE
app.delete('/api/contacts/:id', (req, res) => {
     console.log(res)
     console.log(`requestt: ${req}`)
     CONTACTS = CONTACTS.filter(c => c.id !== req.params.id)
     res.status(200 /* можно не писать, он по умолчанию в express = 200 */).json({message: 'Контакт удалён'})
})

// PUT
app.put('/api/contacts/:id', (req, res) => {
     // в PUT передаём полностью данные модели, которую изменяем (объект contact)
     const idx = CONTACTS.findIndex(c => c.id === req.params.id)
     CONTACTS[idx] = req.body
     res.json(CONTACTS[idx])
})

// PATCH - то же что и PUT, только обновляет не всю модель (можно было использовать)

// ---------------------------------------------------------
// хранить внизу, потому что должны отрабатывать последними

// чтобы корректно отдавать статические файлы из клиента (обозначаем данную папку как статическую
// добавляем middleware находящийся в express.static
// передаем путь до папки, которую хотим сделать статической (client)
// dirname - текущая директория
// в index.html подключаем frontend.js по относительному пути, бей этой строчки он бы не нашелся
app.use(express.static(path.resolve(__dirname, 'client')))

// когда выполняем метод get по любому роуту (*)
// отправляем файл в ответ на ГЕТ
app.get('*', (req, res) => {
     res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

// запуск сервера га порту 3011, когда запустится выполняется функция и показывается сообщение в консоли
app.listen(3011, () => console.log('Server started'))
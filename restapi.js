import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

//Inicialización de express
const app = express()

//Settings
app.set('case sensitive routing', true)
app.set('appName', 'Rest Api Express')
app.set('port', 3000)

// Definición de __dirname y config de ruta de data.json
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pathFileData = path.join(__dirname, 'data.json')

//Middleware que procesa los contenidos antes de pasarlos a las rutas como text, json, etc...
app.use(express.json())
app.use(express.static('public'))

//Routes
app.get('/api/equipos', async(req, res)=>{
    const data = await fs.readFile(pathFileData, 'utf-8')
    const dataJS = JSON.parse(data)
    res.json(dataJS)
})

app.get('/api/equipos/:id', async(req, res)=>{    
    const data = await fs.readFile(pathFileData, 'utf-8')    
    const dataJS = JSON.parse(data)
    const id = parseInt(req.params.id)    
    const objectId = dataJS.find(i => i.id === id)
    return objectId ? res.json(objectId) : res.status(404).json({"Message":'Id no encontrado'})
})

app.post('/api/equipos', async(req, res)=>{
    const data = await fs.readFile(pathFileData, 'utf-8')
    const dataJS = JSON.parse(data)
    const objectAdd = req.body
    dataJS.push(objectAdd)
    await fs.writeFile(pathFileData, JSON.stringify(dataJS, null, 2))
    res.status(201).json(objectAdd)
})

app.put('/api/equipos/:id', async(req, res)=>{
    const data = await fs.readFile(pathFileData, 'utf-8')
    const dataJS = JSON.parse(data)
    const objectModified = req.body
    const id = parseInt(req.params.id)    
    const index = dataJS.findIndex(i => i.id === id)
    dataJS[index] = objectModified
    await fs.writeFile(pathFileData, JSON.stringify(dataJS, null, 2))
    res.json(dataJS)
})

app.patch('/api/equipos/:id', async(req, res)=>{
    const data = await fs.readFile(pathFileData, 'utf-8')
    const dataJS = JSON.parse(data)
    const objectModified = req.body
    const id = parseInt(req.params.id)    
    const index = dataJS.findIndex(i => i.id === id)
    dataJS[index] = {...dataJS[index], ...objectModified}
    await fs.writeFile(pathFileData, JSON.stringify(dataJS, null, 2))
    res.json(dataJS)
})

app.delete('/api/equipos/:id', async(req, res)=>{
    const data = await fs.readFile(pathFileData, 'utf-8')
    const dataJS = JSON.parse(data)    
    const id = parseInt(req.params.id)    
    const index = dataJS.findIndex(i => i.id === id)
    dataJS.splice(index,1)
    await fs.writeFile(pathFileData, JSON.stringify(dataJS, null, 2))
    res.json(dataJS)
})


app.listen(app.get('port'))
console.log(`Server ${app.get('appName')} run on port ${app.get('port')}`)



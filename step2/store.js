import fs from 'node:fs/promises'
import path from 'node:path'

const filename = path.join(process.cwd(), 'db.json')

const saveChanges = data => fs.writeFile(filename, JSON.stringify(data))
const readData = () => fs.readFile(filename, 'utf-8').then(data => JSON.parse(data))

const getAll = readData
const getById = id => readData().then(data => data.find(item => item.id === id))
const create = async (message) => {
  const data = await readData()
  const newItem = { message, id: data.length + 1 }
  await saveChanges(data.concat([newItem]))
  return newItem
}
const updateById = (id, message) => readData().then(data => saveChanges(data.map(current => {
  if (current.id === id) {
    return { ...current, message }
  }
  return current
})))
const deleteById = id => readData().then(data => saveChanges(data.filter(current => current.id !== id)))

export { getAll, getById, create, updateById, deleteById }

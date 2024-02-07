import { getAll, getById, create, updateById, deleteById } from '../store.js'
import { restoreDb, populateDb } from './utils.js'
import { whispers, inventedId, existingId } from './fixtures.js'

describe('store', () => {
  beforeEach(() => populateDb(whispers))
  afterAll(restoreDb)
  describe('getAll', () => {
    it("Should return an empty array when there's no data", async () => {
      restoreDb()
      const data = await getAll()
      expect(data).toEqual([])
    })
    it('Should return an array with one item when there is one item', async () => {
      const data = await getAll()
      expect(data).toEqual(whispers)
    })
  })
  describe('getById', () => {
    it('Should return undefined when there is no item with the given id', async () => {
      const item = await getById(inventedId)
      expect(item).toBeUndefined()
    })
    it('Should return the item with the given id', async () => {
      const item = await getById(whispers[0].id)
      expect(item).toEqual(whispers[0])
    })
  })
  describe('create', () => {
    it('Should return the created item', async () => {
      const newItem = { id: whispers.length + 1, message: 'test 3' }
      const item = await create(newItem.message)
      expect(item).toEqual(newItem)
    })
    it('Should add the item to the db', async () => {
      const newItem = { id: whispers.length + 1, message: 'test 3' }
      const { id } = await create(newItem.message)
      const item = await getById(id)
      expect(item).toEqual(newItem)
    })
  })
  describe('updateById', () => {
    it('Should return undefined when there is no item with the given id', async () => {
      const item = await updateById(inventedId)
      expect(item).toBeUndefined()
    })
    it('Should not return the updated item', async () => {
      const updatedItem = { id: existingId, message: 'updated' }
      const item = await updateById(updatedItem.id, updatedItem.message)
      expect(item).toBeUndefined()
    })
    it('Should update the item in the db', async () => {
      const updatedItem = { id: existingId, message: 'updated' }
      await updateById(updatedItem.id, updatedItem.message)
      const item = await getById(existingId)
      expect(item).toEqual(updatedItem)
    })
  })
  describe('deleteById', () => {
    it('Should return undefined when there is no item with the given id', async () => {
      const item = await deleteById(inventedId)
      expect(item).toBeUndefined()
    })
    it('Should not return the deleted item', async () => {
      const item = await deleteById(existingId)
      expect(item).toBeUndefined()
    })
    it('Should delete the item from the db', async () => {
      await deleteById(existingId)
      const items = await getAll()
      expect(items).toEqual(whispers.filter(item => item.id !== existingId))
    })
  })
})

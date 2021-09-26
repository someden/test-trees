function generateLeafs(): [LeafId, ILeaf][] {
  let id = 1

  const iter = (levels = 4, parentId = `${id}`): [LeafId, ILeaf][] => {
    const arr = Array.from({ length: levels }).map(() =>
      [`${++id}`, { id: `${id}`, parentId, value: `Node${id}`, deleted: false }] as [LeafId, ILeaf]
    )
    return levels - 1 ? arr.concat(...arr.map(([id]) => iter(levels - 1, `${id}`))) : arr
  }

  return [[`${id}`, { id: `${id}`, parentId: null, value: `Node${id}`, deleted: false }], ...iter()]
}

let db: Map<LeafId, ILeaf> = new Map(generateLeafs())
let updateView = () => {}

function reset() {
  db = new Map(generateLeafs())
  updateView()
}

function generateId(): LeafId {
  return `${db.size + 1}`
}

function updateDeleted() {
  db.forEach(leaf => {
    if (!leaf.deleted && hasDeletedParent(leaf.parentId)) {
      leaf.deleted = true
    }
  })
}

function hasDeletedParent(parentId: LeafId | null): boolean {
  const parent = db.get(parentId || '')

  if (!parent) {
    return false
  }

  return parent.deleted || hasDeletedParent(parent.parentId)
}

function connect(updater: (leafs: ILeaf[]) => void): void {
  updateView = () => updater(Array.from(db.values()))
  updateView()
}

const dbTreeApi = {
  connect,
  reset,
}

function randomTroubles(message: string) {
  if (Math.random() < 0.1) {
    throw new Error(message);
  }
}

function getLeafById(id: LeafId) {
  randomTroubles("Error on Load. Try again.")
  return { ...db.get(id) } as ILeaf
}

function updateLeafs(leafs: ILeaf[]) {
  randomTroubles("Error on Save. Try again.")

  const newIds: { [key: LeafId]: LeafId } = {}

  const updatedLeafs = leafs.map(leaf => {
    const newLeaf = { ...leaf }

    if (!db.has(newLeaf.id)) {
      const newId = generateId()
      newIds[newLeaf.id] = newId
      newLeaf.id = newId
    }

    if (newLeaf.parentId && newIds[newLeaf.parentId]) {
      newLeaf.parentId = newIds[newLeaf.parentId]
    }

    db.set(newLeaf.id, newLeaf)

    return newLeaf
  })

  updateDeleted()
  updateView()

  return updatedLeafs
}

const cachedTreeApi = {
  getLeafById,
  updateLeafs,
}

export { cachedTreeApi, dbTreeApi }

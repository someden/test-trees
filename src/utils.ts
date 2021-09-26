export function getTree(leafs: ILeaf[]): ITree[] {
  const tree: ITree[] = []
  const leafsObj: { [key: LeafId]: ITree } = leafs.reduce(
    (acc, leaf) => ({ ...acc, [leaf.id]: { ...leaf, children: [] } }),
    {}
  )

  leafs.forEach(leaf => {
    if (leaf.parentId && leafsObj[leaf.parentId]) {
      leafsObj[leaf.parentId].children.push(leafsObj[leaf.id])
    } else {
      tree.push(leafsObj[leaf.id])
    }
  })

  return tree
}

export function updateDeleted(leafs: ILeaf[]): ILeaf[] {
  const leafsObj: { [key: LeafId]: ILeaf } = leafs.reduce(
    (acc, leaf) => ({ ...acc, [leaf.id]: leaf }),
    {}
  )

  return leafs.map(leaf =>
    !leaf.deleted && hasDeletedParent(leafsObj, leaf.parentId)
      ? { ...leaf, deleted: true }
      : leaf
  )
}

function hasDeletedParent(leafs: { [key: LeafId]: ILeaf }, parentId: LeafId | null): boolean {
  const parent = parentId && leafs[parentId]

  if (!parent) {
    return false
  }

  return parent.deleted || hasDeletedParent(leafs, parent.parentId)
}

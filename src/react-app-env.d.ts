/// <reference types="react-scripts" />

type LeafId = string

interface ILeaf {
  id: LeafId
  parentId: LeafId | null
  value: string
  deleted: boolean
}

interface ITree extends ILeaf {
  children: ITree[]
}

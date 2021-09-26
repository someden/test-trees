import { useCallback, useState } from 'react'
import { updateDeleted } from './utils'

export default function useLeafs() {
  const [leafs, setLeafs] = useState<ILeaf[]>([])
  const addLeaf = useCallback((leaf: ILeaf) => {
    setLeafs(state =>
      state.some(({ id }) => id === leaf.id) ? state :  updateDeleted([...state, leaf])
    )
  }, [setLeafs])
  const updateLeaf = useCallback((updatedLeaf: ILeaf) => {
    setLeafs(state => state.map(leaf =>
      leaf.id === updatedLeaf.id ? { ...leaf, ...updatedLeaf } : leaf)
    )
  }, [setLeafs])
  const deleteLeaf = useCallback((id: LeafId) => {
    setLeafs(state => updateDeleted(state.map(leaf =>
      leaf.id === id ? { ...leaf, deleted: true } : leaf)
    ))
  }, [setLeafs])

  return [leafs, addLeaf, updateLeaf, deleteLeaf, setLeafs] as const
}

import React, { useCallback, useMemo } from 'react'
import './App.css'
import { cachedTreeApi, dbTreeApi } from './db'
import CachedTreeColumn from './CachedTreeColumn'
import DBTree from './DBTree'
import { getTree } from './utils'
import useLeafs from './useLeafs'

export default function App() {
  const [leafs, addLeaf, updateLeaf, deleteLeaf, setLeafs] = useLeafs()
  const applyLeafs = useCallback(() => {
    try {
      const updatedLeafs = cachedTreeApi.updateLeafs(leafs)
      setLeafs(updatedLeafs)
    } catch (error: any) {
      alert(error.message)
    }
  }, [leafs, setLeafs])
  const resetLeafs = useCallback(() => {
    setLeafs([])
    dbTreeApi.reset()
  }, [setLeafs])
  const onLoadToCache = useCallback((id: LeafId) => {
    try {
      const leaf = cachedTreeApi.getLeafById(id)
      addLeaf(leaf)
    } catch (error: any) {
      alert(error.message)
    }
  }, [addLeaf])
  const cachedTree = useMemo(() => {
    return getTree(leafs)
  }, [leafs])

  return (
    <div className="app container py-5">
      <div className="row h-100">
        <div className="col h-100">
          <CachedTreeColumn
            tree={cachedTree}
            onAdd={addLeaf}
            onEdit={updateLeaf}
            onDelete={deleteLeaf}
            onApply={applyLeafs}
            onReset={resetLeafs}
          />
        </div>
        <div className="col h-100">
          <DBTree onLoadToCache={onLoadToCache} />
        </div>
      </div>
    </div>
  )
}

import React, { useEffect, useMemo, useState, useCallback } from 'react'
import './App.css'
import { dbTreeApi } from './db'
import Tree from './Tree'
import { getTree } from './utils'

interface IDBTreeProps {
  onLoadToCache(id: LeafId): void
}

interface IDBTreeActionsProps extends IDBTreeProps {
  leaf: ILeaf
}

function DBTreeActions({ leaf, onLoadToCache }: IDBTreeActionsProps) {
  const onLoadToCacheCallback = useCallback(() => {
    onLoadToCache(leaf.id)
  }, [leaf, onLoadToCache])

  return (
    <button type="button" className="btn btn-light" onClick={onLoadToCacheCallback}>
      Load
    </button>
  );
}

export default function DBTree({ onLoadToCache }: IDBTreeProps) {
  const [leafs, setLeafs] = useState<ILeaf[]>([])
  useEffect(() => {
    dbTreeApi.connect(setLeafs)
  }, [setLeafs])
  const actions = useCallback((leaf) => {
    return <DBTreeActions leaf={leaf} onLoadToCache={onLoadToCache} />
  }, [onLoadToCache])
  const dbTree = useMemo(() => {
    return getTree(leafs)
  }, [leafs])

  return (
    <div className="card h-100 overflow-auto">
      <Tree
        tree={dbTree}
        actions={actions}
      />
    </div>
  )
}

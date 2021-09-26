import React, { useCallback } from 'react';
import Tree from './Tree'

export interface ICachedTreeActions {
  onAdd(leaf: ILeaf): void
  onEdit(leaf: ILeaf): void
  onDelete(id: LeafId): void
}

interface ICachedTreeProps extends ICachedTreeActions {
  tree: ITree[]
}

interface ICachedTreeActionsProps extends ICachedTreeActions {
  leaf: ILeaf
}

function CachedTreeActions({ leaf, onAdd, onEdit, onDelete }: ICachedTreeActionsProps) {
  const onAddCallback = useCallback(() => {
    onAdd(leaf)
  }, [leaf, onAdd])
  const onEditCallback = useCallback(() => {
    onEdit(leaf)
  }, [leaf, onEdit])
  const onDeleteCallback = useCallback(() => {
    onDelete(leaf.id)
  }, [leaf, onDelete])

  return (
    <>
      <button type="button" className="btn btn-light" onClick={onAddCallback}>
        Add
      </button>
      <button type="button" className="btn btn-light" onClick={onEditCallback}>
        Edit
      </button>
      <button type="button" className="btn btn-light" onClick={onDeleteCallback}>
        Delete
      </button>
    </>
  );
}

export default function CachedTree({ tree, onAdd, onEdit, onDelete }: ICachedTreeProps) {
  const actions = useCallback((leaf) => {
    return (
      <CachedTreeActions
        leaf={leaf}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    )
  }, [onAdd, onEdit, onDelete])

  return (
    <Tree
      tree={tree}
      actions={actions}
    />
  )
}

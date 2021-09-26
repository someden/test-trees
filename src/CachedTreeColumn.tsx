import React, { useCallback, useState, useRef } from 'react'
import './App.css'
import CachedTree from './CachedTree'

interface ICachedTreeColumnProps  {
  tree: ITree[]
  onAdd(leaf: ILeaf): void
  onEdit(leaf: ILeaf): void
  onDelete(id: LeafId): void
  onApply(): void
  onReset(): void
}

export default function CachedTreeColumn({ tree, onAdd, onEdit, onDelete, onApply, onReset }: ICachedTreeColumnProps) {
  const [newLeafParent, setNewLeafParent] = useState<ILeaf | null>(null)
  const [leafToEdit, setLeafToEdit] = useState<ILeaf | null>(null)
  const inputEl = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')
  const resetForm = useCallback(() => {
    setNewLeafParent(null)
    setLeafToEdit(null)
    setValue('')
  }, [setNewLeafParent, setLeafToEdit, setValue])
  const initAdd = useCallback((parentLeaf: ILeaf) => {
    resetForm()
    setNewLeafParent(parentLeaf)
    setTimeout(() => { inputEl.current?.focus() }, 0)
  }, [resetForm, setNewLeafParent])
  const initEdit = useCallback((leaf: ILeaf) => {
    resetForm()
    setLeafToEdit(leaf)
    setValue(leaf.value)
    setTimeout(() => { inputEl.current?.focus() }, 0)
  }, [resetForm, setLeafToEdit, setValue])
  const onDeleteCallback = useCallback((id: LeafId) => {
    onDelete(id)
    resetForm()
  }, [resetForm, onDelete])
  const onChange = useCallback((e) => {
    setValue(e.target.value)
  }, [])
  const onSubmit = useCallback((e) => {
    e.preventDefault()
    if (newLeafParent) {
      onAdd({ id: `temp${Math.random()}${Date.now()}`, parentId: newLeafParent.id, value, deleted: false })
    }
    if (leafToEdit) {
      onEdit({ ...leafToEdit, value })
    }
    resetForm()
  }, [newLeafParent, leafToEdit, value, resetForm, onAdd, onEdit])
  const onApplyCallback = useCallback(() => {
    resetForm()
    onApply()
  }, [resetForm, onApply])
  const onResetCallback = useCallback(() => {
    resetForm()
    onReset()
  }, [resetForm, onReset])

  return (
    <div className="card h-100 d-flex flex-column">
      <CachedTree
        tree={tree}
        onAdd={initAdd}
        onEdit={initEdit}
        onDelete={onDeleteCallback}
      />
      <div className="card-body">
        <div className="btn-toolbar flex-nowrap">
          <form
            onSubmit={onSubmit}
            className="input-group input-group-sm me-4 flex-nowrap w-100"
          >
            <input
              ref={inputEl}
              type="text"
              className="form-control"
              value={value}
              onChange={onChange}
              disabled={!newLeafParent && !leafToEdit}
            />
            {newLeafParent
              ? <span className="input-group-text">Parent: {newLeafParent.value}</span>
              : null
            }
            <button
              type="submit"
              className="btn btn-outline-success"
              disabled={!newLeafParent && !leafToEdit}
            >
              Ok
            </button>
          </form>
          <div className="btn-group btn-group-sm me-2">
            <button type="button" className="btn btn-outline-success" onClick={onApplyCallback}>
              Apply
            </button>
          </div>
          <div className="btn-group btn-group-sm">
            <button type="button" className="btn btn-outline-danger" onClick={onResetCallback}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

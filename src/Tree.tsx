import React, { useMemo, ReactNode } from 'react'

type TreeAction = (leaf: ILeaf) => ReactNode

interface ITreeProps {
  tree: ITree[]
  actions: TreeAction
}

interface ILeafProps extends ITree {
  actions: TreeAction
}

function Leaf({ id, parentId, value, deleted, children, actions }: ILeafProps) {
  const actionsNode = useMemo(
    () => actions({ id, parentId, value, deleted }),
    [id, parentId, value, deleted, actions]
  )

  return (
    <li className="list-group-item">
      <div className="row">
        <div className="col align-self-center lh-lg">
          {deleted ? <del className="text-muted">{value}</del> : value}
        </div>
        {!deleted ? (
          <div className="col-auto align-self-center">
            <div className="btn-group btn-group-sm">
              {actionsNode}
            </div>
          </div>
        ) : null}
      </div>
      {children.length ? (
        <Tree
          tree={children}
          actions={actions}
        />
      ) : null}
    </li>
  )
}

export default function Tree({ tree, actions }: ITreeProps) {
  return (
    <ul className="list-group list-group-flush h-100 overflow-auto">
      {tree.map((leaf) => (
        <Leaf
          key={leaf.id}
          {...leaf}
          actions={actions}
        />
      ))}
    </ul>
  )
}

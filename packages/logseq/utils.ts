interface Tree {
  id: number,
  left: Tree,
  parent: {
    id: number
  },
}

export const distanceFromParent = (tree: Tree, parent: Tree['parent'], count: number): number => {
  if (tree.id === parent.id) return count;
  return distanceFromParent(tree.left, parent, count + 1);
}

export const sortByDistanceFromParent = (a: Tree, b: Tree) => distanceFromParent(a, a.parent, 0) - distanceFromParent(b, b.parent, 0)
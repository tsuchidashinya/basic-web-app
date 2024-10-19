import cloneDeep from "lodash.clonedeep";
import { ComponentData } from "../parser/ComponentData";

type ComponentTreeNode = ComponentData & {
  parent: string | undefined;
  ancestors: string[];
};

const appendParentAncestors = (
  componentTree: ComponentTreeNode[],
  targetNodeName: string
): ComponentTreeNode[] => {
  const newComponentTree = cloneDeep(componentTree);
  const updatedNode = newComponentTree.find(
    (node) => node.name === targetNodeName
  );

  if (updatedNode?.parent !== undefined) {
    const newParentNode = appendParentAncestors(
      newComponentTree,
      updatedNode.parent
    ).find((item) => item.name === updatedNode.parent);
    if (newParentNode !== undefined) {
      updatedNode.ancestors = [
        ...updatedNode.ancestors,
        ...newParentNode.ancestors,
      ];
    }
  }
  return newComponentTree;
};

const appendAncestors = (
  componentList: ComponentData[]
): (ComponentData & { ancestors: string[] })[] => {
  let componentTree: ComponentTreeNode[] = componentList.map((component) => {
    return {
      ...component,
      parent: undefined,
      ancestors: [],
    };
  });
  componentList.forEach((component) => {
    component.children.forEach((children) => {
      const childNode = componentTree.find((tree) => tree.name === children);
      if (childNode !== undefined) {
        childNode.parent = component.name;
        childNode.ancestors = [component.name];
      }
    });
  });
  for (const node of componentTree) {
    componentTree = appendParentAncestors(componentTree, node.name);
  }
  return componentTree.map(
    ({ name, children, events, props, states, types, ancestors }) => {
      return {
        name,
        children,
        events,
        props,
        states,
        types,
        ancestors,
      };
    }
  );
};

export { appendAncestors };

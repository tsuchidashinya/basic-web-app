import fs from "fs";
import { ComponentData } from "../parser/ComponentData";
import { mkdir } from "../utils/mkdir";
import { appendAncestors } from "./appendAncestors";
import { makeComponentCode } from "./code/component/makeComponentCode";
import { makeStorybookCode } from "./code/storybook/makeStorybookCode";

const generate = (destPath: string, componentList: ComponentData[]) => {
  const newComponentList = appendAncestors(componentList);
  for (const component of newComponentList) {
    const dirPath = `${destPath}/${component.ancestors.length > 0 ? component.ancestors.reverse().join("/") + "/" : ""}${component.name}`;
    mkdir(dirPath);

    const componentCode = makeComponentCode(component);
    fs.writeFileSync(`${dirPath}/index.tsx`, componentCode);
    if (component.ancestors.length === 0) {
      const storybookCode = makeStorybookCode(component);
      fs.writeFileSync(`${dirPath}/index.stories.tsx`, storybookCode);
    }
  }
};

export { generate };

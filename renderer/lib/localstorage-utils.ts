const projectSpacesKey = "project-spaces";
type ProjectSpace = {
  projectId: string;
  spacePath: string;
};

export function getAllProjectSpaces(): ProjectSpace[] | null {
  return JSON.parse(localStorage.getItem(projectSpacesKey));
}

export function getProjectSpace(projectId: string): ProjectSpace {
  const spaces = getAllProjectSpaces();

  if (!spaces) {
    return {
      projectId,
      spacePath: "",
    };
  }

  const matches = spaces.filter((it) => it.projectId === projectId);

  if (!matches || matches.length === 0) {
    return {
      projectId,
      spacePath: "",
    };
  }

  return matches[0];
}

export function saveProjectSpace(projectId: string, path: string) {
  let spaces = getAllProjectSpaces();

  const newSpace: ProjectSpace = {
    projectId,
    spacePath: path,
  };

  if (!spaces) {
    // create new spaces
    spaces = [];
    spaces.push(newSpace);

    localStorage.setItem(projectSpacesKey, JSON.stringify(spaces));
  } else {
    // ^ instead of doing that, do this:
    const newSpaces = spaces.filter((it) => it.projectId !== projectId);

    newSpaces.push(newSpace);

    // Save this
    localStorage.setItem(projectSpacesKey, JSON.stringify(spaces));
  }
  console.log("hello", path);
}

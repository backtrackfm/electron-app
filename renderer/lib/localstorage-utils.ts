const projectWorkspaceKey = "project-workspace";
type ProjectWorkspace = {
  projectId: string;
  workspacePath: string;
};

export function getAllProjectWorkspaces(): ProjectWorkspace[] | null {
  return JSON.parse(localStorage.getItem(projectWorkspaceKey));
}

export function getProjectWorkspace(
  projectId: string
): ProjectWorkspace | null {
  const workspaces = getAllProjectWorkspaces();

  const matches = workspaces.filter((it) => it.projectId === projectId);

  if (!matches || matches.length === 0) {
    return null;
  }

  return matches[0];
}

export function saveProjectWorkspace(projectId: string, path: string) {
  let workspaces = getAllProjectWorkspaces();

  const newWorkspace: ProjectWorkspace = {
    projectId,
    workspacePath: path,
  };

  if (!workspaces) {
    // create new workspaces
    workspaces = [];
    workspaces.push(newWorkspace);

    localStorage.setItem(projectWorkspaceKey, JSON.stringify(workspaces));
  } else {
    // ^ instead of doing that, do this:
    const newWorkspaces = workspaces.filter((it) => it.projectId !== projectId);

    newWorkspaces.push(newWorkspace);

    // Save this
    localStorage.setItem(projectWorkspaceKey, JSON.stringify(newWorkspaces));
  }
}

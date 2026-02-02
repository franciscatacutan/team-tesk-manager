/*
 * Represents a project owner.
 */
export type ProjectOwner = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

/*
 * Represents a project.
 */
export type Project = {
  id: number;
  name: string;
  description?: string;
  owner: ProjectOwner;
};

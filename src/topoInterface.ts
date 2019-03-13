export default class TopoInterface {
  host: string;

  constructor(host: string) {
    this.host = host;
  }

  createBox = (
    id: string,
    name: string,
    boxType: string,
    options?: {parentId?: string},
  ) => {
    // stub for creating box
  };

  createSystem = (
    id: string,
    name: string,
    technologies: string[],
    parentId: string,
  ) => {
    // stub for creating box
  };

  createTechnology = (id: string, name: string) => {
    // stub for creating box
  };
}

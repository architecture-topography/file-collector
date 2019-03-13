import {request} from 'graphql-request';

export default class TopoInterface {
  host: string;

  constructor(host: string) {
    this.host = host;
  }

  createBox = async (
    id: string,
    name: string,
    boxType: string,
    options: {parentId?: string} = {},
  ) => {
    const query = `
      mutation create($name: String! $id: String! $boxType: BoxType! $parentId: String){
        createBox(name: $name, id: $id, boxType: $boxType, parentId: $parentId) {
          name
          id
        }
      }
    `;

    const variables = {
      id,
      name,
      boxType,
      parentId: options.parentId,
    };

    try {
      const data = await request(this.host, query, variables);
      console.log('Created box: ', data);
    } catch (error) {
      console.error('Could not create box: ', error);
    }
  };

  createSystem = async (
    id: string,
    name: string,
    technologies: string[],
    parentId: string,
  ) => {
    const query = `
      mutation create($name: String! $id: String! $parentBoxId: String! $technologies: [String!]){
        createSystem(
          name: $name
          id: $id
          parentBoxId: $parentBoxId
          technologies: $technologies
        ) {
          name
          id
        }
      }
    `;

    const variables = {
      id,
      name,
      technologies,
      parentBoxId: parentId,
    };

    try {
      const data = await request(this.host, query, variables);
      console.log('Created box: ', data);
    } catch (error) {
      console.error('Could not create box: ', error);
    }
  };

  createTechnology = async (id: string, name: string) => {
    const query = `
      mutation create($name: String! $id: String!){
        createTechnology(
          name: $name
          id: $id
        ) {
          name
          id
        }
      }
    `;

    const variables = {
      id,
      name
    };

    try {
      const data = await request(this.host, query, variables);
      console.log('Created technology: ', data);
    } catch (error) {
      console.error('Could not create technology: ', error);
    }
  };

  deleteAll = async () => {
    const query = `
      mutation delete {
        deleteAll {result}
      }
    `;

    try {
      await request(this.host, query);
      console.log("Deleted existing data");
    } catch (error) {
      console.error('Could not delete existing data: ', error);
    }
  };
}

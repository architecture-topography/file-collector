import {request} from 'graphql-request';
import {createLogger} from './logger';
const log = createLogger('topoConnector');

export default class TopoConnector {
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
      log.info('Created box:', (data as any).createBox.name);
    } catch (error) {
      log.error('Error creating box:', error.toString());
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
      log.info('Created System:', (data as any).createSystem.name);
    } catch (error) {
      log.error('Error creating system: ', error.toString());
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
      log.info('Created technology:', (data as any).createTechnology.name);
    } catch (error) {
      log.error('Error creating technology:', error.toString());
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
      log.warn("Deleted existing data");
    } catch (error) {
      log.error('Error deleting existing data:', error.toString());
    }
  };
}

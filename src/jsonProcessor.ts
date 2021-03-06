import Ajv from 'ajv';
import {createLogger} from './logger';
import schema from './schema/jsonSchema.json';
import TopoConnector from './topoConnector';

const log = createLogger('jsonProcessor');
const ajv = new Ajv();
const validate = ajv.compile(schema);

interface IBox {
  id: string;
  name: string;
  boxType: string;
  boxes?: IBox[];
  systems?: ISystem[];
}

interface ISystem {
  id: string;
  name: string;
  technologies: string[];
}

export default class JsonProcessor {
  topoConnector: TopoConnector;
  constructor(topoConnector: TopoConnector) {
    this.topoConnector = topoConnector;
  }

  process = async (json: any) => {
    const valid = validate(json);
    if (!valid) {
      log.error('JSON does not match schema')
      log.warn(JSON.stringify(validate.errors))
      throw new Error(`Schema not valid: ${validate.errors}`);
    }

    await this.topoConnector.deleteAll();

    if (json.technologies) {
      await this.createTechnologies(json.technologies);
    }

    await this.createBoxes(json.boxes);
  };

  private createTechnologies = async (
    technologies: Array<{id: string; name: string}>,
  ) => {
    const technologyQueries = technologies.map(tech =>
      this.topoConnector.createTechnology(tech.id, tech.name),
    );
    return Promise.all(technologyQueries);
  };

  private createBoxes = async (
    boxes: IBox[],
    parentId: string | undefined = undefined,
  ) => {
    const boxQueries = boxes.map(async box => {
      await this.topoConnector.createBox(box.id, box.name, box.boxType, {
        parentId,
      });

      if (box.systems) {
        await this.createSystems(box.systems, box.id);
      }

      if (box.boxes) {
        // recusively create child boxes
        await this.createBoxes(box.boxes, box.id);
      }
    });
    return Promise.all(boxQueries);
  };

  private createSystems = async (systems: ISystem[], parentId: string) => {
    const systemQueries = systems.map(async system => {
      await this.topoConnector.createSystem(
        system.id,
        system.name,
        system.technologies,
        parentId,
      );
    });
    return Promise.all(systemQueries);
  };
}

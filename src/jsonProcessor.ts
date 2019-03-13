import Ajv from 'ajv';
import schema from './schema/jsonSchema.json';
import TopoInterface from './topoInterface';

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
  topoInterface: TopoInterface;
  constructor(topoInterface: TopoInterface) {
    this.topoInterface = topoInterface;
  }

  process = (json: any) => {
    const valid = validate(json);
    if (!valid) {
      throw new Error(`Schema not valid: ${validate.errors}`);
    }

    if (json.technologies) {
      this.createTechnologies(json.technologies);
    }

    this.createBoxes(json.boxes);
  };

  private createTechnologies = async (
    technologies: Array<{id: string; name: string}>,
  ) => {
    const technologyQueries = technologies.map(tech =>
      this.topoInterface.createTechnology(tech.id, tech.name)
    );
    return Promise.all(technologyQueries);
  };

  private createBoxes = async (
    boxes: IBox[],
    parentId: string | undefined = undefined,
  ) => {
    const boxQueries = boxes.map(async box => {
      await this.topoInterface.createBox(box.id, box.name, box.boxType, {
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
      await this.topoInterface.createSystem(system.id, system.name, system.technologies, parentId);
    });
    return Promise.all(systemQueries);
  };
}

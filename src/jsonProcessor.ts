import Ajv from 'ajv';
import schema from './schema/jsonSchema.json';
import {createBox, createSystem, createTechnology} from './topoInterface';

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

export const process = (json: any) => {
  const valid = validate(json);
  if (!valid) {
    console.error(validate.errors);
    throw new Error('Schema not valid');
  }

  if (json.technologies) {
    createTechnologies(json.technologies);
  }

  createBoxes(json.boxes);
};

const createTechnologies = async (
  technologies: Array<{id: string; name: string}>,
) => {
  const technologyQueries = technologies.map(tech =>
    createTechnology(tech.id, tech.name),
  );
  return Promise.all(technologyQueries);
};

const createBoxes = async (
  boxes: IBox[],
  parentId: string | undefined = undefined,
) => {
  const boxQueries = boxes.map(async box => {
    await createBox(box.id, box.name, box.boxType, {
      parentId,
    });

    if (box.systems) {
      await createSystems(box.systems, box.id);
    }

    if (box.boxes) {
      // recusively create child boxes
      await createBoxes(box.boxes, box.id);
    }
  });
  return Promise.all(boxQueries);
};

const createSystems = async (systems: ISystem[], parentId: string) => {
  const systemQueries = systems.map(async system => {
    await createSystem(system.id, system.name, system.technologies, parentId);
  });
  return Promise.all(systemQueries);
};

export default {
  process,
};

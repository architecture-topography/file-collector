import Ajv from 'ajv';
import schema from './schema/jsonSchema.json';
import {createTechnology, createBox} from './topoInterface';

const ajv = new Ajv();
const validate = ajv.compile(schema);

interface IBox {
  id: string;
  name: string;
  boxType: string;
  boxes?: IBox[];
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

    if (box.boxes) {
      // recusively create child boxes
      await createBoxes(box.boxes, box.id);
    }
  });
  return Promise.all(boxQueries);
};

export default {
  process,
};

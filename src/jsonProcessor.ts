import Ajv from 'ajv';
import schema from './schema/jsonSchema.json';
import {createTechnology} from './topoInterface';

const ajv = new Ajv();
const validate = ajv.compile(schema);

export const process = (json: any) => {
  const valid = validate(json);
  if (!valid) {
    console.error(validate.errors);
    throw new Error('Schema not valid');
  }

  if (json.technologies) {
    createTechnologies(json.technologies);
  }
};

const createTechnologies = async (technologies: Array<{id: string, name: string}>) => {
  const newTechnologies = technologies.map(tech => createTechnology(tech.id, tech.name));
  return Promise.all(newTechnologies);
}

export default {
  process,
};

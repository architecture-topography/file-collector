import {request} from 'graphql-request';
import TopoConnector from './topoConnector';
jest.mock('graphql-request');

const HOST = 'http://FAKEHOST/';

describe('topoConnector', () => {
  let topoConnector: TopoConnector;

  beforeEach(() => {
    topoConnector = new TopoConnector(HOST);
    (request as any).mockClear();
  });

  it('Call correct mutation for createBox', async () => {
    const MUTATION = `
      mutation create($name: String! $id: String! $boxType: BoxType! $parentId: String){
        createBox(name: $name, id: $id, boxType: $boxType, parentId: $parentId) {
          name
          id
        }
      }
    `;

    await topoConnector.createBox('test-001', 'Test Box', 'Platform');

    expect(request).toBeCalledWith(HOST, MUTATION, {
      boxType: 'Platform',
      id: 'test-001',
      name: 'Test Box',
    });
  });

  it('Call correct mutation for createTechnology', async () => {
    const MUTATION = `
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

    await topoConnector.createTechnology('tech-react', 'React');

    expect(request).toBeCalledWith(HOST, MUTATION, {
      id: 'tech-react',
      name: 'React',
    });
  });

  it('Call correct mutation for createSystem', async () => {
    const MUTATION = `
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

    await topoConnector.createSystem('sys-001', 'Cool System', ['react'], 'parent-id');

    expect(request).toBeCalledWith(HOST, MUTATION, {
      id: 'sys-001',
      name: 'Cool System',
      technologies: ['react'],
      parentBoxId: 'parent-id',
    });
  });
});

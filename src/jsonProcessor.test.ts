import JsonProcessor from './jsonProcessor';
import TopoConnector from './topoConnector';

jest.mock('./topoConnector');

describe('Json validation', () => {
  let jsonProcessor: JsonProcessor;
  const createTechnology = jest.fn();
  const createBox = jest.fn();
  const createSystem = jest.fn();

  beforeEach(() => {
    (TopoConnector as any).mockImplementation(() => ({
      createTechnology,
      createBox,
      createSystem,
      deleteAll: jest.fn(),
    }));
    createTechnology.mockClear();
    createBox.mockClear();
    createSystem.mockClear();
    jsonProcessor = new JsonProcessor(new TopoConnector('fakehost'));
  });

  it('expect empty json to throw error', async () => {
    const json = {};
    let error: any;
    try {
      await jsonProcessor.process(json);
    } catch (e) {
      error = e;
    }
    expect(error.toString()).toContain('Schema not valid');
  });

  it('expect to create technologies', async () => {
    const json = {
      boxes: [],
      technologies: [
        {
          id: 'tech_ruby',
          name: 'Ruby on Rails',
        },
        {
          id: 'tech_elixir',
          name: 'Elixir',
        },
      ],
    };

    await jsonProcessor.process(json);

    expect(createTechnology).toHaveBeenCalledWith('tech_ruby', 'Ruby on Rails');
    expect(createTechnology).toHaveBeenCalledWith('tech_elixir', 'Elixir');
  });

  it('expect to create box', async () => {
    const json = {
      boxes: [
        {
          boxType: 'Platform',
          id: 'thoughtworks',
          name: 'ThoughtWorks',
        },
      ],
      technologies: [],
    };

    await jsonProcessor.process(json);

    expect(createBox).toHaveBeenCalledWith(
      'thoughtworks',
      'ThoughtWorks',
      'Platform',
      {parentId: undefined},
    );
  });

  it('create a box and child', async () => {
    const json = {
      boxes: [
        {
          id: 'thoughtworks',
          boxType: 'Platform',
          name: 'ThoughtWorks',
          boxes: [
            {
              boxType: 'Domain',
              id: 'child',
              name: 'Child Box',
            },
          ],
        },
      ],
      technologies: [],
    };
    await jsonProcessor.process(json);
    expect((createBox as any).mock.calls.length).toBe(2);
    expect(createBox).toHaveBeenCalledWith(
      'thoughtworks',
      'ThoughtWorks',
      'Platform',
      {
        parentId: undefined,
      },
    );
    expect(createBox).toHaveBeenCalledWith('child', 'Child Box', 'Domain', {
      parentId: 'thoughtworks',
    });
  });

  it('create a box with system and technology', async () => {
    const json = {
      boxes: [
        {
          id: 'thoughtworks',
          boxType: 'Platform',
          name: 'ThoughtWorks',
          systems: [
            {
              id: 'system_001',
              name: 'Cool System',
              technologies: ['react'],
            },
          ],
        },
      ],
      technologies: [
        {
          id: 'react',
          name: 'React',
        },
      ],
    };
    await jsonProcessor.process(json);
    expect(createBox).toHaveBeenCalledWith(
      'thoughtworks',
      'ThoughtWorks',
      'Platform',
      {
        parentId: undefined,
      },
    );
    expect(createTechnology).toHaveBeenCalledWith('react', 'React');
    expect(createBox).toHaveBeenCalledWith(
      'thoughtworks',
      'ThoughtWorks',
      'Platform',
      {
        parentId: undefined,
      },
    );
    expect(createSystem).toHaveBeenCalledWith(
      'system_001',
      'Cool System',
      ['react'],
      'thoughtworks',
    );
  });
});

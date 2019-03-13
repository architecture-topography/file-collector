import JsonProcessor from './jsonProcessor';
import TopoInterface from './topoInterface';

jest.mock('./topoInterface');

describe('Json validation', () => {
  let jsonProcessor: JsonProcessor;
  const createTechnology = jest.fn();
  const createBox = jest.fn();
  const createSystem = jest.fn();

  beforeEach(() => {
    (TopoInterface as any).mockImplementation(() => ({
      createTechnology,
      createBox,
      createSystem,
    }));
    createTechnology.mockClear();
    createBox.mockClear();
    createSystem.mockClear();
    jsonProcessor = new JsonProcessor(new TopoInterface('fakehost'));
  });

  it('expect empty json to throw error', () => {
    const json = {};
    expect(() => {
      jsonProcessor.process(json);
    }).toThrowError();
  });

  it('expect to create technologies', () => {
    const json = {
      boxes: [ ],
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
    jsonProcessor.process(json);
    expect(createTechnology).toHaveBeenCalledWith('tech_ruby', 'Ruby on Rails');
    expect(createTechnology).toHaveBeenCalledWith('tech_elixir', 'Elixir');
  });

  it('expect to create box', () => {
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
    jsonProcessor.process(json);
    expect(createBox).toHaveBeenCalledWith(
      'thoughtworks',
      'ThoughtWorks',
      'Platform',
      {parentId: undefined}
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

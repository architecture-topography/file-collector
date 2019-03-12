import jsonProcessor from './jsonProcessor';
import {createBox, createSystem, createTechnology} from './topoInterface';
jest.mock('./topoInterface');

describe('Json validation', () => {
  // beforeEach(() => { });
  it('expect empty json to throw error', () => {
    const json = {};
    expect(() => {
      jsonProcessor.process(json);
    }).toThrowError();
  });

  it('expect to create technologies', () => {
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
        {
          id: 'tech_react',
          name: 'React',
        },
      ],
    };
    jsonProcessor.process(json);
    expect(createTechnology).toHaveBeenCalledWith('tech_ruby', 'Ruby on Rails');
    expect(createTechnology).toHaveBeenCalledWith('tech_elixir', 'Elixir');
    expect(createTechnology).toHaveBeenCalledWith('tech_react', 'React');
  });
});

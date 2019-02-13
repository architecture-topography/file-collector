import cli from './cli';

class MockedConsole {
  output: string;
  constructor(){
    this.output = '';
  }
  log(message: string) {
    this.output += message;
  }
  toString() {
    return this.output;
  }
}

describe('cli', () => {
  it('Startup text matches snapshot', () => {
    const mockedConsole = new MockedConsole();

    cli(mockedConsole);
    expect(mockedConsole.toString()).toMatchSnapshot();
  })
});
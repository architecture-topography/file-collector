import cli from "./cli";
import { mockProcessStdout } from "jest-mock-process";
const CLIOUTPUT_INDEX = 2;

describe("cli", () => {
  let mockStdout: any;
  afterEach(() => {
    mockStdout.mockRestore();
  });

  beforeEach(() => {
    mockStdout = mockProcessStdout();
  });

  // commented out because of issues updating snapshots
  xit("startup text should match snapshot", () => {
    cli();
    expect((mockStdout as any).mock.calls).toMatchSnapshot();
  });

  it("check that options are shown when no arguments are given", () => {
    cli();
    expect(JSON.stringify((mockStdout as any).mock.calls)).toContain('Usage:');
    expect(JSON.stringify((mockStdout as any).mock.calls)).toContain('Options:');
  })

  it("get upset if no file is provided", () => {
    const args = ['--host', 'http://fakeurl', '--port', '2000'];
    cli(args);
    expect(JSON.stringify((mockStdout as any).mock.calls)).toContain('ERROR: Please provide a file');
  });
});

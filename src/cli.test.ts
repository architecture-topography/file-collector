import cli, {checkFile, parseJsonFileContent} from "./cli";
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
    expect(JSON.stringify((mockStdout as any).mock.calls)).toContain('Error: Please provide a file');
  });

  describe("checkFile functionality", () => {
    it("if valid json file provided, no error thrown", () => {
      const filename = "hey/its/me/te.st.json";
      expect(() => checkFile(filename)).not.toThrow();
    })

    it("if file is not .json format, throw an exception", () => {
      const filename = "test.text";
      expect(() => checkFile(filename)).toThrow();
    })

    it("if .json is in the path but it is not a valid json file, throw an exception", () => {
      const filename = ".json/test.text";
      expect(() => checkFile(filename)).toThrow();
    })

    it("if file does not have a filename, throw an exception", () => {
      const filename = "apples";
      expect(() => checkFile(filename)).toThrow();
    })
  });

  describe("parseJsonFileContent functionality", () => {
    it("if file content is invalid JSON, throw exception", () => {
      const badJson = `"data":{"type": "string"}`;
      expect(() => parseJsonFileContent(badJson)).toThrow();
    })

    it("if file content is valid JSON, return parsed json object", () => {
      const goodJson = `{"data":{"type": "string"}}`;
      const returnedJsonObj = parseJsonFileContent(goodJson);

      const expectedJsonObj = { data: {"type": "string"}};
      expect(returnedJsonObj).toEqual(expectedJsonObj);
    })
  })
});

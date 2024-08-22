import { generateVerificationToken } from "../../../src/utils/generateVerificationToken";
import { generateJwtAndSetCookie } from "../../../src/utils/generateJwtAndSetCookie";

describe("Generate Verification Token Test", () => {
  it("should generate a token", () => {
    const token = generateVerificationToken();
    expect(token).toBeDefined();
  });
  it("should generate a 6-digit token", () => {
    const token = generateVerificationToken();
    expect(token.toString().length).toBe(6);
  });
  it("should generate a random token", () => {
    const token1 = generateVerificationToken();
    const token2 = generateVerificationToken();
    expect(token1).not.toEqual(token2);
  });
});

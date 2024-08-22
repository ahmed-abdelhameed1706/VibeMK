import httpMocks from "node-mocks-http";
import { register } from "../../../src/controllers/auth.controller.js";
import User from "../../../src/models/user.model.js";
import bcrypt from "bcryptjs";

jest.mock("../../../src/models/user.model.js");
jest.mock("bcryptjs");

describe("Auth Controller", () => {
  describe("register - POST /api/auth/register", () => {
    let req, res;
    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
      req.body = {
        email: "test@gmail.com",
        password: "123456",
        confirmPassword: "123456",
        fullName: "Test User",
      };
    });

    it("should register a new user", async () => {
      User.prototype.save = jest.fn().mockResolvedValue({
        _id: "1asd",
        email: req.body.email,
        fullName: req.body.fullName,
        password: "hashedPassword",
        videos: [],
        groups: [],
      });

      User.findOne.mockResolvedValue(null);
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(User.prototype.save).toHaveBeenCalled();
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({
        success: true,
        message: "User registered successfully",
        user: {
          id: expect.any(String),
          email: req.body.email,
          fullName: req.body.fullName,
          videos: [],
          groups: [],
        },
      });
    });
    it("should return 400 if user already exists", async () => {
      User.findOne.mockResolvedValue({ email: "test@gmail.com" }); // Simulates existing user
      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(User.prototype.save).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        success: false,
        message: "User already exists",
      });
    });
  });
});

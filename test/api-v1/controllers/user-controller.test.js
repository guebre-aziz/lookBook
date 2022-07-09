const chai = require("chai");
const mongoose = require("mongoose");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");

const {
  findUserById,
} = require("../../../api-v1/controllers/users-controller");
const {
  findAllUsers,
} = require("../../../api-v1/controllers/users-controller");
const { create } = require("../../../api-v1/controllers/users-controller");
const { update } = require("../../../api-v1/controllers/users-controller");
const { remove } = require("../../../api-v1/controllers/users-controller");
const expect = chai.expect;
chai.use(sinonChai);

describe("Users controller functions tests", () => {
  describe("create", () => {
    const sandbox = sinon.createSandbox();
    afterEach(function () {
      sinon.restore();
    });
    const statusJsonSpy = sinon.spy();
    const res = {
      send: sinon.spy(),
      status: sinon.stub().returns({ json: statusJsonSpy }),
    };
    const req = {
      body: {
        surname: "surname",
        email: "new@email.com",
        name: "name",
      },
    };

    it("should return status 400 if body's empty", async () => {
      const req = {
        body: "",
      };
      await create(req, res);
      expect(res.status).to.have.been.calledWith(400);
    });

    it("should return status 201 if user's created", async () => {
      mongoose.Model.prototype.save = sandbox.stub().returns(Promise.resolve());

      await create(req, res);
      expect(res.status).to.have.been.calledWith(201);
    });

    // TODO: rechek here <<<<<<<<

    /* it("should return status 500 if error occurred", async () => {
      mongoose.Model.prototype.save = sandbox.stub().returns(Promise.reject());

      await create(req, res);
      expect(res.status).to.have.been.calledWith(500);
    }); */
  });

  //------------------------------------------------------------------

  describe("findUserById", () => {
    const sandbox = sinon.createSandbox();
    afterEach(function () {
      sinon.restore();
      sandbox.restore();
    });
    const req = {
      params: {
        id: new mongoose.Types.ObjectId(),
      },
    };
    const statusJsonSpy = sinon.spy();
    const res = {
      send: sinon.spy(),
      status: sinon.stub().returns({ json: statusJsonSpy }),
    };

    it("should return status 200 and user data if found", async () => {
      mongoose.Model.findById = sandbox
        .stub()
        .returns(Promise.resolve("user data"));

      await findUserById(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.send).to.have.been.calledWith("user data");
    });

    it("should return status 404 if user not found", async () => {
      mongoose.Model.findById = sandbox.stub().returns(Promise.resolve(""));

      await findUserById(req, res);

      expect(res.status).to.have.been.calledWith(404);
    });

    it("should return status 400 and send 'invalid id' if invalid id", async () => {
      mongoose.Model.findById = sandbox.stub().returns(Promise.resolve());

      findUserById({ params: { id: "invalid id" } }, res);

      expect(res.status).to.have.been.calledWith(400);
      expect(res.send).to.have.been.calledWith({ message: "invalid id" });
    });
  });

  //------------------------------------------------------------------

  describe("findAllUsers", () => {
    const sandbox = sinon.createSandbox();
    afterEach(function () {
      sinon.restore();
      sandbox.restore();
    });

    const req = {};
    const statusJsonSpy = sinon.spy();
    const res = {
      send: sinon.spy(),
      status: sinon.stub().returns({ json: statusJsonSpy }),
    };

    it("should return status 200 and all user data if found", async () => {
      mongoose.Model.find = sandbox
        .stub()
        .returns(Promise.resolve("user data"));

      await findAllUsers(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.send).to.have.been.calledWith("user data");
    });

    it("should return status 500 and error message if error occurred", async () => {
      mongoose.Model.find = sandbox
        .stub()
        .returns(Promise.reject(new Error("error message")));

      await findAllUsers(req, res);

      expect(res.status).to.have.been.calledWith(500);
      expect(res.send).to.have.been.calledWith({ message: "error message" });
    });
  });

  //------------------------------------------------------------------

  describe("update", () => {
    const sandbox = sinon.createSandbox();
    afterEach(function () {
      sinon.restore();
      sandbox.restore();
    });

    const statusJsonSpy = sinon.spy();
    const res = {
      send: sinon.spy(),
      status: sinon.stub().returns({ json: statusJsonSpy }),
    };

    it("sould return status 200 and data updated", async () => {
      mongoose.Model.findByIdAndUpdate = sandbox
        .stub()
        .returns(Promise.resolve("data updated"));
      const req = {
        params: { id: new mongoose.Types.ObjectId() },
        body: "body",
      };
      await update(req, res);
      expect(res.status).to.have.been.calledWith(200);
      expect(res.send).to.have.been.calledWith("data updated");
    });

    it("sould return status 400 and error message if invalid id", async () => {
      const req = {
        params: { id: "invalid id" },
      };
      await update(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.send).to.have.been.calledWith({ message: "not valid id" });
    });

    it("sould return status 400 and error message if empty body", async () => {
      const req = {
        params: { id: new mongoose.Types.ObjectId() },
        body: null,
      };
      await update(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.send).to.have.been.calledWith({
        message: "body can not be empty",
      });
    });
  });

  describe("delete", () => {
    const sandbox = sinon.createSandbox();
    afterEach(function () {
      sinon.restore();
      sandbox.restore();
    });

    const statusJsonSpy = sinon.spy();
    const res = {
      json: sinon.spy(),
      send: sinon.spy(),
      status: sinon.stub().returns({ json: statusJsonSpy }),
    };

    it("should return status 200 and success message", async () => {
      const req = {
        params: { id: new mongoose.Types.ObjectId() },
      };
      mongoose.Model.findByIdAndDelete = sandbox
        .stub()
        .returns(Promise.resolve("user deleted"));

      await remove(req, res);
      expect(res.status).to.be.calledWith(200);
      expect(res.send).to.be.calledWith({
        message: "user deleted successfully",
      });
    });

    it("should return status 404 if data not found", async () => {
      const req = {
        params: { id: new mongoose.Types.ObjectId() },
      };
      mongoose.Model.findByIdAndDelete = sandbox
        .stub()
        .returns(Promise.resolve(""));

      await remove(req, res);
      expect(res.status).to.be.calledWith(404);
    });

    it("should return status 400 if invalid id", async () => {
      const req = {
        params: { id: "invalid id" },
      };

      await remove(req, res);
      expect(res.status).to.be.calledWith(400);
    });
  });
});

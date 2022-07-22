const chai = require("chai");
const mongoose = require("mongoose");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const {
  findSwapById,
} = require("../../../api-v1/controllers/swap-orders-controller");
const {
  create,
} = require("../../../api-v1/controllers/swap-orders-controller");
const {
  update,
} = require("../../../api-v1/controllers/swap-orders-controller");
const {
  remove,
} = require("../../../api-v1/controllers/swap-orders-controller");
const expect = chai.expect;
chai.use(sinonChai);
const {
  dbConnect,
  dbDisconnect,
} = require("../../../utils/test-utils.js/dbHandler");

describe("Swap orders controller functions tests", () => {
  before(async (done) => {
    dbConnect();
    done();
  });
  after(async (done) => {
    dbDisconnect();
    done();
  });

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
      body: "body",
    };

    it("should return status 400 if body's empty", async () => {
      const req = {
        body: "",
      };
      await create(req, res);
      expect(res.status).to.have.been.calledWith(400);
    });

    it("should return status 201 if swap order's created", async () => {
      mongoose.Model.prototype.save = sandbox.stub().returns(Promise.resolve());

      await create(req, res);
      expect(res.status).to.have.been.calledWith(201);
    });
  });

  //------------------------------------------------------------------

  describe("findSwapById", () => {
    afterEach(function () {
      sinon.restore();
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

    const doc = { data: "user data" };
    const err = new Error("error");

    it("should return status 200 and swap order data if found", async () => {
      sinon.stub(mongoose.Model, "findById").yields(null, doc);
      await findSwapById(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.send).to.have.been.calledWith(doc);
    });

    it("should return status 404 if swap order not found", async () => {
      sinon.stub(mongoose.Model, "findById").yields(null, null);
      await findSwapById(req, res);

      expect(res.status).to.have.been.calledWith(404);
    });

    it("should return status 400 and error message if invalid id", async () => {
      findSwapById({ params: { id: "invalid id" } }, res);

      expect(res.status).to.have.been.calledWith(400);
      expect(res.send).to.have.been.calledWith({ message: "not valid id" });
    });

    it("should return status 500 and error message error occurred", async () => {
      sinon.stub(mongoose.Model, "findById").yields(err, null);

      findSwapById(req, res);

      expect(res.status).to.have.been.calledWith(500);
      expect(res.send).to.have.been.calledWith({ message: "error" });
    });
  });

  //------------------------------------------------------------------

  describe("update", () => {
    afterEach(function () {
      sinon.restore();
    });

    const statusJsonSpy = sinon.spy();
    const res = {
      send: sinon.spy(),
      status: sinon.stub().returns({ json: statusJsonSpy }),
    };
    const doc = { data: "swap order data updated" };
    const err = new Error("error");

    it("should return status 200 and data updated", async () => {
      sinon.stub(mongoose.Model, "findByIdAndUpdate").yields(null, doc);
      const req = {
        params: { id: new mongoose.Types.ObjectId() },
        body: "body",
      };
      await update(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.send).to.have.been.calledWith(doc);
    });

    it("should return status 400 and error message if invalid id", async () => {
      const req = {
        params: { id: "invalid id" },
      };
      await update(req, res);

      expect(res.status).to.have.been.calledWith(400);
      expect(res.send).to.have.been.calledWith({ message: "not valid id" });
    });

    it("should return status 400 and error message if empty body", async () => {
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

    it("should return status 404 if user not found", async () => {
      sinon.stub(mongoose.Model, "findByIdAndUpdate").yields(null, null);
      const req = {
        params: { id: new mongoose.Types.ObjectId() },
        body: "body",
      };
      await update(req, res);

      expect(res.status).to.have.been.calledWith(404);
    });

    it("should return status 500 and error message if error occurred", async () => {
      sinon.stub(mongoose.Model, "findByIdAndUpdate").yields(err, null);
      const req = {
        params: { id: new mongoose.Types.ObjectId() },
        body: "body",
      };
      await update(req, res);
      expect(res.status).to.have.been.calledWith(500);
      expect(res.send).to.have.been.calledWith({ message: "error" });
    });
  });

  //------------------------------------------------------------------------

  describe("delete", () => {
    afterEach(function () {
      sinon.restore();
    });

    const statusJsonSpy = sinon.spy();
    const res = {
      send: sinon.spy(),
      status: sinon.stub().returns({ json: statusJsonSpy }),
    };
    const doc = { data: "swap order deleted" };
    const err = new Error("error");

    it("should return status 200 and successfull message", async () => {
      sinon.stub(mongoose.Model, "findByIdAndDelete").yields(null, doc);
      const req = {
        params: { id: new mongoose.Types.ObjectId() },
      };
      await remove(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.send).to.have.been.calledWith({
        message: "swap order deleted successfully",
      });
    });

    it("should return status 400 and error message if invalid id", async () => {
      const req = {
        params: { id: "invalid id" },
      };
      await remove(req, res);

      expect(res.status).to.have.been.calledWith(400);
      expect(res.send).to.have.been.calledWith({ message: "not valid id" });
    });

    it("should return status 404 if swap order not found", async () => {
      sinon.stub(mongoose.Model, "findByIdAndDelete").yields(null, null);
      const req = {
        params: { id: new mongoose.Types.ObjectId() },
      };
      await remove(req, res);

      expect(res.status).to.have.been.calledWith(404);
    });

    it("should return status 500 and error message if error occurred", async () => {
      sinon.stub(mongoose.Model, "findByIdAndDelete").yields(err, null);
      const req = {
        params: { id: new mongoose.Types.ObjectId() },
      };
      await remove(req, res);

      expect(res.status).to.have.been.calledWith(500);
      expect(res.send).to.have.been.calledWith({ message: "error" });
    });
  });
});

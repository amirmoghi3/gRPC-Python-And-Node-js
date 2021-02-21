var PROTO_PATH = __dirname + "/../users.proto";

var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});
var users_proto = grpc.loadPackageDefinition(packageDefinition);
const { v4: uuidv4 } = require("uuid");
const server = new grpc.Server();
const users = [
  {
    id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
    name: "John Brad",
    age: 23,
    address: "Address 1",
  },
  {
    id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
    name: "Mary Anne",
    age: 45,
    address: "Address 2",
  },
];

server.addService(users_proto.UserService.service, {
  getAll: (_, callback) => {
    callback(null, { users });
  },

  get: (call, callback) => {
    let user = users.find((n) => n.id == call.request.id);

    if (user) {
      callback(null, user);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },

  insert: (call, callback) => {
    let user = call.request;

    user.id = uuidv4();
    users.push(user);
    callback(null, user);
  },

  update: (call, callback) => {
    let existinguser = users.find((n) => n.id == call.request.id);

    if (existinguser) {
      existinguser.name = call.request.name;
      existinguser.age = call.request.age;
      existinguser.address = call.request.address;
      callback(null, existinguser);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },

  remove: (call, callback) => {
    let existinguserIndex = users.findIndex((n) => n.id == call.request.id);

    if (existinguserIndex != -1) {
      users.splice(existinguserIndex, 1);
      callback(null, {});
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Not found",
      });
    }
  },
});

server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Server running at http://127.0.0.1:50051");
    server.start();
  }
);

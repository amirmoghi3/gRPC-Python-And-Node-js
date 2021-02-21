var PROTO_PATH = __dirname + "/../users.proto";

var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});
var UserService = grpc.loadPackageDefinition(packageDefinition).UserService;

const client = new UserService(
  "127.0.0.1:50051",
  grpc.credentials.createInsecure()
);
module.exports = client;

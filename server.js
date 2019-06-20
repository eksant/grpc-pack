const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

function createServer() {
  return new GrpcServer();
}

function handlePromise(handler) {
  return (call, callback) => {
    const result = handler(call, callback);
    if (result && result.then && result.catch) {
      return result.then(res => callback(null, res)).catch(err => callback(err));
    }
  };
}

class GrpcServer {
  constructor() {
    this.server = new grpc.Server();
  }

  use({ protoPath, protoName, serviceName, routes }) {
    const pkgDef = protoLoader.loadSync(`${protoPath}/${protoName}`, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
      includeDirs: [protoPath],
    });
    const proto = grpc.loadPackageDefinition(pkgDef);
    const router = Object.entries(routes).reduce((_router, [action, handler]) => {
      _router[action] = handlePromise(handler);
      return _router;
    }, {});
    this.server.addService(proto.service[serviceName].service, router);
    return this;
  }

  listen(host, creds = grpc.ServerCredentials.createInsecure()) {
    this.server.bind(host, creds);
    this.server.start();
    return this;
  }

  close(force = false, callback) {
    return force ? this.server.forceShutdown() : this.server.tryShutdown(callback);
  }
}

module.exports = createServer;

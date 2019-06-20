const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

function createClient(
  { protoPath, protoName, serviceName },
  host,
  creds = grpc.credentials.createInsecure()
) {
  const pkgDef = protoLoader.loadSync(`${protoPath}/${protoName}`, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [protoPath],
  });
  const proto = grpc.loadPackageDefinition(pkgDef);
  return new proto.service[serviceName](host, creds);
}

module.exports = createClient;

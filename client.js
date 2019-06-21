const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

function createClient(
  { protoPath, protoName, servicePath, serviceName },
  host,
  creds = grpc.credentials.createInsecure()
) {
  const path =
    typeof servicePath !== 'undefined'
      ? `${protoPath}/${servicePath}/${protoName}`
      : `${protoPath}/${protoName}`;
  const pkgDef = protoLoader.loadSync(path, {
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

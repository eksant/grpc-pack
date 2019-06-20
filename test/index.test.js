const path = require('path');
const assert = require('assert');
const { createServer, createClient } = require('../index');

const proto_path = path.resolve(__dirname, './protos');
const proto_host = '0.0.0.0:6969';

/** setup grpc-pack server test */
const server = createServer();
server.use({
  protoPath: proto_path,
  protoName: 'greeter.proto',
  serviceName: 'Greeter',
  routes: {
    hello: (call, callback) => {
      callback(null, { message: `Hello, ${call.request.name}` });
    },
  },
});

/** setup grpc-pack client test */
const client = createClient(
  {
    protoPath: proto_path,
    protoName: 'greeter.proto',
    serviceName: 'Greeter',
  },
  proto_host
);

/** starting testing */
describe('grpc-pack', () => {
  before(() => {
    server.listen(proto_host);
  });

  it('Say Hello', done => {
    client.hello({ name: 'Seorang Eksa' }, (err, res) => {
      if (err) {
        assert(err);
      } else {
        assert(res.message === 'Hello, Seorang Eksa');
      }
      done();
    });
  });

  after(done => {
    server.close(false, () => {
      done();
    });
  });
});

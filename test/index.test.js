const path = require('path');
const assert = require('assert');
const { createServer, createClient } = require('../index');

const proto_path = path.resolve(__dirname, './protos');
const proto_host = '0.0.0.0:6969';

/** setup grpc-pack server test version 1 */
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
describe('GRPC PACK TESTER - Proto V1', () => {
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

/** setup grpc-pack server test version 2 */
const proto_path_2 = path.resolve(__dirname, './protos-v2');
const mockup_2 = [
  {
    ID: '1',
    Height: 1,
    CumulativeDifficulty: 'Test 1',
    TotalCoinBase: 10000,
    Version: 1,
  },
  {
    ID: '2',
    Height: 2,
    CumulativeDifficulty: 'Test 2',
    TotalCoinBase: 20000,
    Version: 1,
  },
  {
    ID: '3',
    Height: 2,
    CumulativeDifficulty: 'Test 3',
    TotalCoinBase: 30000,
    Version: 1,
  },
];
const server_2 = createServer();
server_2.use({
  protoPath: proto_path_2,
  protoName: 'block.proto',
  servicePath: 'service',
  serviceName: 'BlockService',
  routes: {
    GetBlocks: (call, callback) => {
      const Height = call.request.Height;
      const Blocks = Height > 0 ? mockup_2.filter(f => f.Height === Height) : mockup_2;
      const Count = Blocks.length;
      const GetBlocksResponse = {
        Count,
        Height,
        Blocks,
      };
      callback(null, GetBlocksResponse);
    },
  },
});

/** setup grpc-pack client test */
const client_2 = createClient(
  {
    protoPath: proto_path_2,
    protoName: 'block.proto',
    servicePath: 'service',
    serviceName: 'BlockService',
  },
  proto_host
);

/** starting testing */
describe('GRPC PACK TESTER - Proto V2', () => {
  before(() => {
    server_2.listen(proto_host);
  });

  it('Get Blocks with param Height = 1 should be return 1 record', done => {
    const params = { Height: 1 };
    client_2.GetBlocks(params, (err, res) => {
      if (err) {
        assert(err);
      } else {
        assert(res.Blocks.length === 1);
      }
      done();
    });
  });

  it('Get Blocks with param Height = 2 should be return greather then 1 record', done => {
    const params = { Height: 2 };
    client_2.GetBlocks(params, (err, res) => {
      if (err) {
        assert(err);
      } else {
        assert(res.Count > 1);
      }
      done();
    });
  });

  it('Get Blocks without param should be return all records', done => {
    const params = {};
    client_2.GetBlocks(params, (err, res) => {
      if (err) {
        assert(err);
      } else {
        assert(res.Count > 2);
      }
      done();
    });
  });

  after(done => {
    server_2.close(false, () => {
      done();
    });
  });
});

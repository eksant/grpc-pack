# gRPC Pack

[![Version](https://img.shields.io/npm/v/grpc-pack.svg)](https://img.shields.io/npm/v/grpc-pack.svg)
[![License](https://img.shields.io/npm/l/grpc-pack.svg)](https://img.shields.io/npm/l/grpc-pack.svg)
[![Forks](https://img.shields.io/github/forks/eksant/grpc-pack.svg?style=social)](https://img.shields.io/github/forks/eksant/grpc-pack.svg?style=social)
[![Stars](https://img.shields.io/github/stars/eksant/grpc-pack.svg?style=social)](https://img.shields.io/github/stars/eksant/grpc-pack.svg?style=social)
[![Watchers](https://img.shields.io/github/watchers/eksant/grpc-pack.svg?style=social)](https://img.shields.io/github/watchers/eksant/grpc-pack.svg?style=social)

Simpler use of grpc in Node.js.

## Install

```bash
$ npm install grpc-pack or yarn add grpc-pack
```

## Usage

### Single Proto

- Model and Service

  ```bash
  syntax = "proto3";

  package service;

  service Greeter {
    rpc Hello (Name) returns (Message) {}
  }

  message Name {
    string name = 1;
  }

  message Message {
    string message = 1;
  }
  ```

### Server

```bash
const { createServer } = require('grpc-pack');
const server = createServer();

server.use({
  protoPath: 'path/to/directory_proto',
  protoName: 'greeter.proto',
  serviceName: 'Greeter',
  routes: {
    hello: (call, callback) => {
      callback(null, { message: `Hello, ${call.request.name}` });
    },
  },
});

server.listen('0.0.0.0:6969');
```

### Client

```bash
const { createClient } = require('grpc-pack');
const client = createClient(
  {
    protoPath: 'path/to/directory_proto',
    protoName: 'greeter.proto',
    serviceName: 'Greeter',
  },
  '0.0.0.0:6969'
);

client.hello({ name: 'Seorang Eksa' }, (err, { message }) => {
  if(err) throw err;
  console.log(message);
});
```

### Separate Proto Model and Service

- Service

  ```bash
  syntax="proto3";

  package service;

  option go_package = "github.com/zoobc/zoobc-core/common/service";

  import "model/block.proto";
  import "google/api/annotations.proto";

  // BlockService represent request on Blockchain's Block
  service BlockService {
      rpc GetBlocks(model.GetBlocksRequest) returns (model.GetBlocksResponse) {
          option (google.api.http) = {
              get: "/v1/block/GetBlocks"
          };
      }
  }
  ```

- Model

  ```bash
  // Block represent the block data structure stored in the database
  message Block {
    int64 ID = 1 [ jstype = JS_STRING ];
    uint32 Height = 2;
    string CumulativeDifficulty = 3;
    int64 TotalCoinBase = 4 [ jstype = JS_STRING ];
    uint32 Version = 5;
  }

  // BlockExtendedInfo represent the Block data plus part of block data not to be persisted to database
  message BlockExtendedInfo {
    Block Block = 1;
  }

  // GetBlocksRequest create request to get a list block
  message GetBlocksRequest {
    // Fetch block from `n` height
    uint32 Height = 1;
  }

  message GetBlocksResponse {
    // Number of block returned
    uint32 Count = 1;
    // Blocks height returned from
    uint32 Height = 2;
    // Blocks returned
    repeated Block Blocks = 3;
  }
  ```

### Server

```bash
const { createServer } = require('grpc-pack');
const server = createServer();
const mockup = [
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

server.use({
  protoPath: 'path/to/directory_proto',
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

server.listen('0.0.0.0:6969');
```

### Client

```bash
const { createClient } = require('grpc-pack');
const client = createClient(
  {
    protoPath: 'path/to/directory_proto',
    protoName: 'block.proto',
    servicePath: 'service',
    serviceName: 'BlockService',
  },
  '0.0.0.0:6969'
);

const params = { Height: 1 };
client.GetBlocks(params, (err, res) => {
  if(err) throw err;
  console.log(res);
});
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

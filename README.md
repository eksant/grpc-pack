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

### Proto

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

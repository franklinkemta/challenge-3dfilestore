
# 3D Filestore API

Thanks to  <u>[3dverse](https://github.com/3dverse/challenge-3dfilestore)</u> for this challenge 

This is an implementation of a REST API of a 3D file repository application

The API provides endpoints to manage and transform 3D object files

## Features for 3D Objects CRUD and Transformation Operations

- Upload 3D files
- Rename 3D files
- Delete 3D files
- Download original 3D files
- **Download transformed 3D files with dynamic scaling and translation**

## Getting Started

To get started with the 3D Filestore API follow these steps:

1. Clone the project repository:

```bash
  git clone https://github.com/franklinkemta/challenge-3dfilestore.git
```

2. Navigate, Install and Serve

```bash
  cd challenge-3dfilestore && npm install
```

3. Start the server

```bash
  npm run serve
```

Visit API docs UI: **[localhost:5000](http://localhost:5000)**

![App Screenshot](screenshot.png)

## API Reference

The API provides the following endpoints in openapi V3 specification:

- `GET /api/files`: List all 3D files
- `PUT /api/files/:fileId`: Rename a 3D file
- `DELETE /api/files/:fileId`: Delete a 3D file
- `GET /api/files/:fileId/download`: Download the original 3D file
- `GET /api/files/:fileId/download-transformed`: Download the transformed 3D file with dynamic scaling and translation

## Usage Examples

```bash
GET http://localhost:5000/api/files/buggy/download-transformed?scale=[2,2,2]&translation=[10,0,0]
```

This will download the source file using buggy as placeholder if it does not exists and progressively stream the transformed object as the response

## Constraints

- Added **memory usage monitoring** **< ~512Mb**, see src/server.ts file
- Supports **multiple clients** at the **same time**
- Can modify the constant **FILE_READ_CHUNK_SIZE** in src/constants.ts  to tweak and see the output memory variation

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Tech Stack

- Node.js
- Express.js
- TypeScript
- swagger-ui-express (for OpenAPI v3 docs UI)
- Jest (for testing)

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

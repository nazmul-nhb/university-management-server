# University Management Server with Persian Bhai

- [Live Server Link](https://university-management-server-nhb.vercel.app)

## TODO: Every places where ObjectId is used replaced that `id: string` with `id: ObjectId`

## Technologies (Packages) Used

- `TypeScript`
- `Node.js`
- `Express.js`
- `Mongoose`
- `cors`
- `dotenv`
- `bcrypt`

## Run the Server Locally

### Prerequisites

- Node.js (v20+)
- `pnpm` package manager
- If you prefer `npm` or `yarn`, delete `pnpm-lock.yaml` file and follow the following steps

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nazmul-nhb/university-management-server.git
   cd university-management-server
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

   for `npm`:

   ```bash
   npm install
   ```

   for `yarn`:

   ```bash
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following fields:

   ```env
   PORT=4242
   MONGO_URI=your_mongo_db_uri
   ```

4. Start the server:

   ```bash
   pnpm start
   ```

   for `npm`:

   ```bash
   npm start
   ```

   for `yarn`:

   ```bash
   yarn start
   ```

5. Access the API at:

   ```bash
   http://localhost:4242
   ```

---

## API Documentation

### Base URL

`http://localhost:4242`

### Endpoints

---

## Error Responses

All error responses follow this structured format:

```json
{
  "message": "Error message",
  "success": false,
  "error": {
    "name": "ErrorName",
    "errors": { ... }
  },
  "stack": "Error: Something went wrong\n    at..."
}
```

- Example:

```json
{
 "message": "BSONError: Invalid ObjectId",
 "success": false,
 "error": {
  "name": "MongoDBCastError",
  "errors": {
   "_id": {
    "message": "Invalid ObjectId: 6742c11a49c1956daec11abdb",
    "name": "CastError",
    "properties": {
     "message": "Invalid ObjectId: 6742c11a49c1956daec11abdb",
     "type": "ObjectId"
    },
    "kind": "ObjectId",
    "path": "_id",
    "value": "6742c11a49c1956daec11abdb"
   }
  }
 },
 "stack": "Error: Something went wrong\n    at path \"_id\" for model \"Product\"\n\n    at SchemaObjectId.cast..."
 }
```

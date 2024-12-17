# University Management Server with Persian Bhai

- [Live Server Link](https://university-management-server-nhb.vercel.app)

## Technologies (Packages) Used

- `TypeScript`
- `Node.js`
- `Express.js`
- `Mongoose`
- `cors`
- `dotenv`
- `bcrypt`
- `chalk`
- `progress-indicator`
- `execa`

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
  "success": false,
  "message": "Short error message",
  "errorSources": [
    "path": "Where error occurred",
    "message": "Exact error message"
  ],
  "stack": "Error stack if available..." // Only in development mode
}
```

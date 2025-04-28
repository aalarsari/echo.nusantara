const express = require("express");
const next = require("next");
const path = require("path");


const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
   const server = express();

   // Define the prefix and folder for static files
   const assetPrefix = "/static";
   const publicDir = path.join(__dirname, "public");

   // Serve static files with the defined prefix
   server.use(assetPrefix, express.static(publicDir));

   // Handle API routes and other requests with Next.js
   server.all("*", (req, res) => {
      return handle(req, res);
   });

   server.listen(process.env.PORT, (err) => {
      if (err) throw err;
      console.log(`>>>> Ready on http://localhost:${process.env.PORT}`);
   });
});

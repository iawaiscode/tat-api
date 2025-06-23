import http from "node:http";
import { getDataFromDb } from "./db/db.js";
import { sendJSON } from "./utils/sendJSON.js";
import { getDataByPathParams } from "./utils/getDataByPathParams.js";
import { getDataByQuery } from "./utils/getDataByQuery.js";

http
  .createServer(async (req, res) => {
    const destinations = await getDataFromDb();
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const queryParams = Object.fromEntries(urlObj.searchParams);

    if (urlObj.pathname === "/api" && req.method === "GET") {
      let data = getDataByQuery(queryParams, destinations);
      sendJSON(res, 200, data);
    } else if (req.url.startsWith("/api/country")) {
      const country = req.url.split("/").pop();
      const data = getDataByPathParams(destinations, "country", country);
      if (data.length === 0) {
        const data = {
          error: "Not found",
          message: "The requested resource was not found on this server.",
        };
        sendJSON(res, 404, data);
        return;
      }
      sendJSON(res, 200, data);
    } else if (req.url.startsWith("/api/continent")) {
      const continent = req.url.split("/").pop();

      const data = getDataByPathParams(destinations, "continent", continent);

      if (data.length === 0) {
        const data = {
          error: "Not found",
          message: "The requested resource was not found on this server.",
        };
        sendJSON(res, 404, data);
        return;
      }
      sendJSON(res, 200, data);
    } else {
      sendJSON(res, 404, {
        error: "Not found",
        message: "The requested resource was not found on this server.",
      });
    }
  })
  .listen(3000);

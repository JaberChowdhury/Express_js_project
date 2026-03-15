import { Router, type Request, type Response } from "express";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const homeRoute = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

homeRoute.get("/", (req: Request, res: Response) => {
  const systemInfo = {
    osType: os.type(),
    platform: os.platform(),
    architecture: os.arch(),
    hostname: os.hostname(),
    uptime: `${(os.uptime() / 3600).toFixed(2)} hours`,
    // cpuModel: os.cpus()[0].model,
    cpuCores: os.cpus().length,
    totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
    freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
    loadAverage: os.loadavg(),
  };

  const projectInfo = {
    projectRoot: process.cwd(),
    currentFile: __filename,
    currentDirectory: __dirname,
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || "development",
  };

  const pathInfo = {
    separator: path.sep,
    delimiter: path.delimiter,
    basename: path.basename(__filename),
    dirname: path.dirname(__filename),
    extname: path.extname(__filename),
  };

  res.json({
    message: "System & Project Information",
    system: systemInfo,
    project: projectInfo,
    path: pathInfo,
  });
});
export { homeRoute };

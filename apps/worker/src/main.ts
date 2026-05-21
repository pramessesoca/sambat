import { startWorkers } from "./workers.js";

export function getWorkerStatus() {
  return {
    service: "sambat-worker",
    status: "ready",
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(getWorkerStatus());
  startWorkers();
}


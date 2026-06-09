import { app } from "./app";
import { env } from "./lib/env";

app.listen({ port: env.PORT, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server running on port ${env.PORT}`);
  console.log(`Swagger UI: http://localhost:${env.PORT}/api/docs`);
});

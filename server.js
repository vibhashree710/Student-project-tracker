import { createApp } from './app.js';
import { db } from './database.js';

const app = createApp(db);

if (process.env.NODE_ENV !== 'production') {
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => {
    console.log(`Open http://localhost:${port}`);
  });
}

export default app;

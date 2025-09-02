import server from './server.js'
import colors from 'colors'

const port = process.env.PORT || 4000

export const startServer = () => {
  const httpServer = server.listen(port, () => {
    console.log(colors.cyan.bold(`REST API desde el puerto ${port}`));
  });
  return httpServer;
};

startServer();

export const stopServer = (httpServer) => {
    httpServer.close();
};
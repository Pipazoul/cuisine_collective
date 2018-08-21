'use strict';

module.exports = {
  apps: [
    {
      name: 'cuisine_collective',
      script: '/applis/cuisine_collective/server/server.js',
      env_production: {
        NODE_ENV: 'prod',
      },
    },
  ],
};

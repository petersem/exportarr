# exportarr
Export your Radarr list for others to import

```version: '3.4'
services:
  exportarr:
    container_name: petersem/exportarr
    image: exportarr
    environment:
      NODE_ENV: production
      TOKEN: "xyzzy"
      RADARR_URL: "http://x.x.x.x:7878"
      RADARR_TOKEN: "your-radarr-api-token"
    ports:
      - 1234:3000```

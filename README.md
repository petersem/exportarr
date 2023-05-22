# Exportarr
Allows you to share your Radarr lists with others, without having to give them your Radarr API key. :)

## Install
``` yaml
version: '3.4'

services:
  exportarr:
    container_name: exportarr
    image: exportarr
    build:
      context: .
      dockerfile: ./Dockerfile
    environment:
      NODE_ENV: development
      TOKEN: "xyzzy"
      RADARR_URL: "http://192.168.1.135:7878"
      RADARR_TOKEN: "yourradarrtokenhere"
    ports:
      - 1234:3000
```
# Run
Open a browser and go to http://hostIP:port?token=yourexportarrtokenhere

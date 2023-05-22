# Exportarr
Allows you to share your Radarr lists with others, without having to give them your Radarr API key, or open external ports to Radarr. :)

![image](https://github.com/petersem/exportarr/tree/master/public/images/exportarr.png "Exportarr main screen")

## Install
``` yaml

services:
  exportarr:
    container_name: exportarr
    image: petersem/exportarr
    environment:
      TOKEN: "xyzzy" #[Optional] if you want to have a token to limit access to exportarr
      RADARR_URL: "http://192.168.1.135:7878"
      RADARR_TOKEN: "yourradarrtokenhere"
    ports:
      - 1234:3000
```
# Run
 - Open a browser and go to http://hostIP:port?token=yourexportarrtokenhere
 - Open a port for exportarr or set it up in your reverse proxy
 - Open radarr - settings - lists - '+' - 'StevenLu Custom', then change the title and paste in the url from the exportarr list you want to use. 
![image](https://github.com/petersem/exportarr/tree/master/public/images/exportarrCSL.png "Radarr Steven Lu custom list")
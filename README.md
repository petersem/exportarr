# Exportarr
Allows you to share your Radarr/Sonarr lists with others, without having to give them your Radarr API key, or open external ports to Radarr/Sonarr. :)
 > *Only the 'development' branch of Sonarr has the capability of importing the Sonar links*

Possible uses 
 - You dont want to publish trakt lists
 - You know someone that wants to just copy your lists in Radarr/Sonarr for themselves. 
 - You want to get updates from a trusted source for a specific genre of movies or shows. 
 - You want to share your radarr/sonarrs lists, but dont want to open ports to these apps on your network, nor want to share API keys. 
![image](https://github.com/petersem/exportarr/blob/master/public/images/exportarr.png?raw=true "Exportarr main screen")

## Install
``` yaml

services:
  exportarr:
    container_name: exportarr
    image: petersem/exportarr
    environment:
      TOKEN: "xyzzy" #[Optional] if you want to have a token to limit access to exportarr
      RADARR_URL: "http://192.168.1.134:7878"
      RADARR_TOKEN: "yourradarrtokenhere"
      SONARR_URL: "http://192.168.1.134:8989"
      SONARR_TOKEN: "yoursonarrtokenhere"
      SONARR_BETA: "false" # optional. Set to true if reading from the development release of Sonarr
    ports:
      - 1234:3000
```
# Run
 - Open a browser and go to http://hostIP:port?token=yourexportarrtokenhere
 - Open a port for exportarr or set it up in your reverse proxy
 - Open radarr - settings - lists - '+' - 'StevenLu Custom', then change the title and paste in the url from the exportarr list you want to use. 
![image](https://github.com/petersem/exportarr/blob/master/public/images/exportarrCSL.png?raw=true "Radarr Steven Lu custom list")
 - Open sonarr (develop branch) - settings - lists - '+' - 'Custom List', then change the title and paste in the url from the exportarr list you want to use. 
 ![image](https://github.com/petersem/exportarr/blob/master/public/images/exportarrCL.png?raw=true "Sonarr Custom list")
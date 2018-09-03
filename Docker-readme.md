# Cuisine collective - Docker

Le projet contient 3 docker files : 
 - base/Dockerfile-prod
 - client/Dockerfile-prod
 - server/Dockerfile-prod

Les images docker sont construites à l'aide de circleci et ensuite déposée sur dockerhub à l'emplacement (temporaire) suivant : https://hub.docker.com/r/makeitici/cuisine_collective/tags/

Le fichier docker-compose se situe à la racine du projet.

Commandes utiles :

Récupérer les images depuis le serveur cible
Se placer à l'emplacement où se situe le docker-compose :
```
docker-compose pull lc-db
docker-compose pull lc-server
docker-compose pull lc-client
```

Monter les images dockers
```
docker-compose up lc-db
docker-compose up lc-server
docker-compose up lc-client
```

Erreur possible : les scripts d'init de bbd ne se sont pas exécutés, le serveur ne se lance pas.
Solution : Se connecter sur le conteneur actif pour les jouer à la main :
```
docker exec -it -u 0 [nom_conteneur] /bin/bash
psql -f /docker-entrypoint-initdb.d/1-create_user.sql
psql -f /docker-entrypoint-initdb.d/2-create-database.sql
psql -f /docker-entrypoint-initdb.d/3-create_schema.sql
```

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio.
2. Ejecutar 
```
npm install
```

3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```

4. Levantar la base de datos
```
docker-compose up -d
```
5. Clonar el archivo __.env.example__ y renombrar la copia __.env__

6. Llenar las variables definidas en el ```.env```

7. Ejecutar la aplicacion en modo dev:
```
npm run start:dev
```

6. Recontruir la base de datos con la semilla
```
http:localhost:3000/api/v2/seed
```
## Stack usado
* MongoDB
* Nest

# Production Build
1. Crear el archivo ```.env.prod```
2. Llenar las variables de entorno prod
3. Crear la nueva image
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
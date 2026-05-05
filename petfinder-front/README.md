# PetFinder

PetFinder és una aplicació web dissenyada per ajudar a trobar mascotes perdudes. Mitjançant un mapa interactiu, els usuaris poden publicar anuncis de mascotes perdudes o trobades, veure la ubicació aproximada, filtrar per espècie o estat i contactar amb els propietaris a través d'un sistema de xat integrat.

## Funcionalitats principals

- Registre i inici de sessió d'usuaris
- Crear, editar i eliminar anuncis de mascotes
- Mapa interactiu amb Leaflet i OpenStreetMap
- Filtres de cerca per espècie, estat i geolocalització
- Xat entre usuaris (només des del detall de l'anunci)
- Perfil d'usuari amb imatge i dades personals
- Geolocalització simulada per a mascotes amb microchip GPS
- Panell d'administració (gestió d'anuncis i usuaris)
- Disseny responsive (escriptori i mòbil)

## Tecnologies utilitzades

### Backend

- Java 17
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Docker

### Frontend

- React
- TypeScript
- Leaflet (mapes)
- Axios (peticions HTTP)

## Requisits previs

- Java 17 o superior
- Node.js 18 o superior
- Docker (recomanat per a la base de dades)

## Instal·lació i execució

### 1. Clonar el repositori

```bash
git clone https://github.com/aitorbauza/petfinder.git
cd petfinder
```

### 2. Configurar la base de dades amb Docker
```
docker run --name petfinder-db \
  -e POSTGRES_DB=petfinder \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Executar el backend
```
cd petfinder-api
./mvnw spring-boot:run
```

#### L'API estarà disponible a: http://localhost:9090

### 4. Executar el frontend
```
cd ../petfinder-front
npm install
npm run dev
```

#### L'aplicació estarà disponible a: http://localhost:5173


### 5. Estructura del projecte

```text
petfinder/
├── petfinder-api/          # Backend (Spring Boot)
│   ├── src/main/java/      # Codi font del backend
│   └── src/main/resources/ # Fitxers de configuració
├── petfinder-front/        # Frontend (React)
│   ├── src/                # Codi font del frontend
│   └── public/             # Recursos estàtics
└── README.md               # Aquest fitxer
```

## Autor

#### Aitor Bauzá Gómez
#### GitHub: @aitorbauza

##### Aquest projecte s'ha desenvolupat amb finalitats educatives com a part d'un Treball de Final de Grau.
# Twitter
Twitter homemade

Distribución del arbol del proyecto:
- Twitter
  - assets → Utilidades usadas en la aplicación
  - Backend → Carpeta contenedora de todo el Backend de la aplicación
    - Controllers
    - Models
    - app.js
    - index.js
  - Components → Carpeta que contiene las diferentes vistas
    - login.html
    - signin.html
    tweet.html
  - css
  - scripts → Carpeta que contiene los javascript para los diferentes ficheros y componentes.
    - jQuery
    - Moment
    - login.js
    - main.js
    - signin.js
    - tweet.js
  - index.html → Página inicial del proyecto.
  - READEm.md

Requerimientos para usar el proyecto y desarrollar con él:
npm install para cargar todas las dependencias del proyecto necesarias para el correcto funcionamiento.

- Base de datos: MongoDB
  - Para que funcione el programa en local, deberás crear una base de datos MongoDB en tu localhost llamada 'Twitter'.
  - En el fichero twitter/Backend/index.js y concretamente en la declaración "const uri = 'mongodb://localhost:27017/Twitter';" debes asignarle la ruta y el puerto que tengas conectado tu MongoDB.
  - El servidor debe estar corriendo en todo momento para que la aplicación web funcione. Bastará con ir al path ...Twitter\Backend y poner en el terminal "npm start".
  
  

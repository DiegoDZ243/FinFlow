FROM node:20.20.0
WORKDIR /app

# Primero copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos (Aquí es donde Docker debería detectar el nuevo react-router-dom)
RUN npm install

# DESPUÉS copiamos el resto del código
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
# Usamos una imagen oficial de Python ligera basada en Debian Slim
FROM python:3.11.9-slim

# Evita que Python escriba archivos .pyc en el disco y asegura que los logs salgan directos a la consola
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero el archivo de requerimientos para aprovechar la caché de capas de Docker
COPY requirements.txt .

# Instalamos las dependencias del proyecto sin guardar la caché de pip (reduce el tamaño de la imagen)
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copiamos todo el contenido de la carpeta backend al contenedor
COPY . .

# Comando para arrancar FastAPI. 
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
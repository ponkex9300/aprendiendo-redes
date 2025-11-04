#!/bin/bash

# Script para actualizar y reiniciar la aplicación en el servidor

echo "==================================="
echo "Actualizando aprendiendo-redes"
echo "==================================="

# Navegar al directorio de la aplicación
cd ~/aprendiendo-redes

# Backend
echo "Reiniciando Backend..."
cd backend
pm2 restart backend || pm2 start src/index.js --name backend
cd ..

# Frontend
echo "Reconstruyendo Frontend..."
cd frontend
npm run build
cd ..

echo "==================================="
echo "Actualización completada!"
echo "==================================="

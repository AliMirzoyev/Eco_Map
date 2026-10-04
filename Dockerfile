# Берём чистую Linux-среду с компилятором C++
FROM gcc:latest

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем все файлы проекта
COPY . .

# Компилируем C++ сервер под Linux
RUN g++ -O3 main.cpp -o server -pthread

# Открываем порт для сервиса
EXPOSE 8080

# Команда запуска сервера
CMD ["./server"]
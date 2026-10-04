#include <iostream>

#include <fstream>

#include <sstream>

#include <string>

#include <unistd.h>

#include <sys/socket.h>

#include <netinet/in.h>



// Чтение HTML файла

std::string read_file(const std::string& path) {

    std::ifstream file(path);

    if (!file.is_open()) return "";

    std::stringstream buffer;

    buffer << file.rdbuf();

    return buffer.str();

}



int main() {

    int server_fd = socket(AF_INET, SOCK_STREAM, 0);

    if (server_fd < 0) {

        std::cerr << "Ошибка создания сокета" << std::endl;

        return 1;

    }



    int opt = 1;

    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));



    sockaddr_in address{};

    address.sin_family = AF_INET;

    address.sin_addr.s_addr = INADDR_ANY;

    

    // В облаках порт передаётся через переменную окружения PORT

    char* port_env = std::getenv("PORT");

    int port = port_env ? std::stoi(port_env) : 8080;

    address.sin_port = htons(port);



    if (bind(server_fd, (struct sockaddr*)&address, sizeof(address)) < 0) {

        std::cerr << "Ошибка привязки к порту " << port << std::endl;

        return 1;

    }



    if (listen(server_fd, 10) < 0) {

        std::cerr << "Ошибка прослушивания" << std::endl;

        return 1;

    }



    std::cout << "C++ Eco-Server запущен на порту " << port << std::endl;



    while (true) {

        int client_fd = accept(server_fd, nullptr, nullptr);

        if (client_fd < 0) continue;



        char buffer[2048] = {0};

        read(client_fd, buffer, sizeof(buffer));

        std::string request(buffer);



        // Запрос карты

        if (request.find("GET / ") != std::string::npos || request.find("GET /index.html") != std::string::npos) {

            std::string html_content = read_file("index.html");

            if (html_content.empty()) {

                std::string not_found = "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nФайл index.html не найден!";

                write(client_fd, not_found.c_str(), not_found.length());

            } else {

                std::string response = "HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\nContent-Length: " +

                                       std::to_string(html_content.length()) + "\r\n\r\n" + html_content;

                write(client_fd, response.c_str(), response.length());

            }

        } 

        // Запрос данных Евразии

        else if (request.find("GET /api/sensors") != std::string::npos) {

            std::string json_data = R"([

                {"city": "Париж", "country": "Франция", "lat": 48.8566, "lon": 2.3522, "aqi": 35},

                {"city": "Берлин", "country": "Германия", "lat": 52.5200, "lon": 13.4050, "aqi": 42},

                {"city": "Астана", "country": "Казахстан", "lat": 51.1693, "lon": 71.4491, "aqi": 78},

                {"city": "Токио", "country": "Япония", "lat": 35.6762, "lon": 139.6503, "aqi": 25},

                {"city": "Пекин", "country": "Китай", "lat": 39.9042, "lon": 116.4074, "aqi": 145}

            ])";



            std::string response = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: " +

                                   std::to_string(json_data.length()) + "\r\n\r\n" + json_data;

            write(client_fd, response.c_str(), response.length());

        }



        close(client_fd);

    }



    close(server_fd);

    return 0;

} 

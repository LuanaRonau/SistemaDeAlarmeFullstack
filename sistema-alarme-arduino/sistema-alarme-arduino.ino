#include <Ultrasonic.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// Configurações dos pinos do Arduino
const int pino_trigger = 2;
const int pino_echo = 0;
const int buzzer = 12;

// Configurações do WiFi
const char* ssid = "TIM_ULTRAFIBRA_6810";
const char* password = "inserir_senha";

// Endereço do backend-
const char* serverName = "http://192.168.1.8:8000";

// Variáveis para o buzzer
unsigned long ultimoSom = 0;
const long intervaloSom = 500;

int distancia_minima = 10;
int distancia_maxima = 100;

// Inicializa o sensor nos pinos definidos
Ultrasonic ultrasonic(pino_trigger, pino_echo);

// WiFiClient necessário para HTTPClient
WiFiClient wifiClient;

void setup() {
  Serial.begin(9600);

  // Configura os pinos
  pinMode(pino_trigger, OUTPUT);
  pinMode(pino_echo, INPUT);
  pinMode(buzzer, OUTPUT);

  // Conecta ao WiFi
  connectWiFi();
  obterParametros();
}

void loop() {
  float distancia;
  long microsec = ultrasonic.timing();
  distancia = ultrasonic.convert(microsec, Ultrasonic::CM);

  enviarDados(distancia);

  if (distancia <= distancia_minima) {
    Serial.print("Atenção: ");
    Serial.print(distancia);
    Serial.println(" cm");
    tocaBuzzer();
  } else if (distancia > distancia_minima && distancia <= distancia_maxima) {
    Serial.print("Cuidado: ");
    Serial.print(distancia);
    Serial.println(" cm");
    noTone(buzzer);
  } else {
    Serial.print("Livre: ");
    Serial.print(distancia);
    Serial.println(" cm");
    noTone(buzzer);
  }
  delay(1000);
}

void tocaBuzzer() {
  unsigned long tempoAtual = millis();
  if (tempoAtual - ultimoSom >= intervaloSom) {
    tone(buzzer, 1000);
    delay(100);
    noTone(buzzer);
    ultimoSom = tempoAtual;
  }
}

void connectWiFi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando ao WiFi...");
  }
  Serial.println("Conectado ao WiFi");
}

void obterParametros() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(wifiClient, String(serverName) + "/Controle");
    int httpCode = http.GET();
    Serial.println(httpCode);
    if (httpCode > 0) {
      String payload = http.getString();
      Serial.println(payload);

      StaticJsonDocument<256> doc;
      DeserializationError error = deserializeJson(doc, payload);
      if (!error) {
        JsonArray array = doc.as<JsonArray>();
        distancia_minima = array[0]["distancia_minima"];
        Serial.print("Nova distância mínima: ");
        Serial.println(distancia_minima);
      } else {
        Serial.println("Erro ao parsear JSON");
      }
    } else {
      Serial.println("Erro ao obter parâmetros");
    }
    http.end();
  } else {
    Serial.println("WiFi não conectado");
  }
}

void enviarDados(float distancia) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(wifiClient, String(serverName) + "/Logging");
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    doc["distancia"] = distancia;

    String json;
    serializeJson(doc, json);

    int httpCode = http.POST(json);
    if (httpCode > 0) {
      String payload = http.getString();
      Serial.println(payload);
    } else {
      Serial.println("Erro ao enviar dados");
    }
    http.end();
  } else {
    Serial.println("WiFi não conectado");
  }
}

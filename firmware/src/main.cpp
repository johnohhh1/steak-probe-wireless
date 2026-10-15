/*
 * Wireless Steak Probe - nRF52840 Firmware
 * 100K NTC Thermistor Reader with BLE
 * 
 * Hardware:
 * - 100K resistor from 3.3V to A0
 * - 100K NTC thermistor from A0 to GND
 * - nRF52840 board (Adafruit Feather, etc)
 * 
 * Circuit:
 *   3.3V ──[100K]── A0 ──[Thermistor]── GND
 *                    ↑
 *              (ADC reading)
 */

#include <bluefruit.h>

// BLE Services
BLEService        tempService = BLEService(0x1809); // Health Thermometer Service UUID
BLECharacteristic tempChar    = BLECharacteristic(0x2A1C); // Temperature Measurement

// Thermistor constants
#define THERMISTOR_PIN A0
#define SERIES_RESISTOR 100000.0  // 100K ohm
#define NOMINAL_RESISTANCE 100000.0  // 100K at 25°C
#define NOMINAL_TEMPERATURE 25.0     // 25°C

// Steinhart-Hart coefficients for 100K NTC
// These are typical values - calibrate for your specific thermistor
#define STEINHART_A 0.001129148
#define STEINHART_B 0.000234125
#define STEINHART_C 0.0000000876741

// Sampling
#define SAMPLE_INTERVAL 2000  // 2 seconds between readings
#define NUM_SAMPLES 10        // Average 10 readings for stability

// Device info
#define DEVICE_NAME "SteakProbe-01"

void setup() {
  Serial.begin(115200);
  while (!Serial && millis() < 3000) delay(10); // Wait for serial or timeout
  
  Serial.println("Wireless Steak Probe - Starting...");
  
  // Configure ADC
  analogReadResolution(12); // 12-bit resolution (0-4095)
  pinMode(THERMISTOR_PIN, INPUT);
  
  // Initialize BLE
  Serial.println("Initializing BLE...");
  Bluefruit.begin();
  Bluefruit.setTxPower(4);  // -8dBm for power savings (range still >50ft)
  Bluefruit.setName(DEVICE_NAME);
  
  // Set up connection callbacks
  Bluefruit.Periph.setConnectCallback(connect_callback);
  Bluefruit.Periph.setDisconnectCallback(disconnect_callback);
  
  // Configure Temperature Service
  Serial.println("Configuring Temperature Service...");
  tempService.begin();
  
  // Configure Temperature Characteristic
  tempChar.setProperties(CHR_PROPS_NOTIFY | CHR_PROPS_READ);
  tempChar.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
  tempChar.setFixedLen(4); // 4 bytes for temperature data
  tempChar.begin();
  
  // Start advertising
  startAdv();
  
  Serial.println("Ready! Waiting for connection...");
}

void startAdv() {
  // Advertising packet
  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
  Bluefruit.Advertising.addTxPower();
  Bluefruit.Advertising.addService(tempService);
  Bluefruit.Advertising.addName();
  
  // Slow advertising for power savings
  Bluefruit.Advertising.restartOnDisconnect(true);
  Bluefruit.Advertising.setInterval(160, 244); // 100ms-152.5ms
  Bluefruit.Advertising.setFastTimeout(30);
  Bluefruit.Advertising.start(0); // 0 = Don't stop advertising
}

void loop() {
  // Read temperature
  float tempF = readTemperature();
  
  // Debug output
  Serial.print("Temperature: ");
  Serial.print(tempF, 1);
  Serial.println(" °F");
  
  // Send via BLE if connected
  if (Bluefruit.connected()) {
    // Convert to format: temperature * 100 (to preserve 2 decimal places)
    uint32_t tempData = (uint32_t)(tempF * 100);
    tempChar.notify32(tempData);
  }
  
  delay(SAMPLE_INTERVAL);
}

float readTemperature() {
  // Take multiple samples and average
  uint32_t sum = 0;
  for (int i = 0; i < NUM_SAMPLES; i++) {
    sum += analogRead(THERMISTOR_PIN);
    delay(10);
  }
  uint16_t adcValue = sum / NUM_SAMPLES;
  
  // Convert ADC to voltage (12-bit: 0-4095 = 0-3.3V)
  float voltage = (adcValue / 4095.0) * 3.3;
  
  // Calculate resistance using voltage divider
  float resistance = SERIES_RESISTOR * voltage / (3.3 - voltage);
  
  // Steinhart-Hart equation for temperature
  float logR = log(resistance);
  float tempK = 1.0 / (STEINHART_A + STEINHART_B * logR + STEINHART_C * logR * logR * logR);
  
  // Convert to Celsius then Fahrenheit
  float tempC = tempK - 273.15;
  float tempF = tempC * 9.0 / 5.0 + 32.0;
  
  return tempF;
}

// Connection callbacks
void connect_callback(uint16_t conn_handle) {
  BLEConnection* connection = Bluefruit.Connection(conn_handle);
  
  char central_name[32] = { 0 };
  connection->getPeerName(central_name, sizeof(central_name));
  
  Serial.print("Connected to: ");
  Serial.println(central_name);
}

void disconnect_callback(uint16_t conn_handle, uint8_t reason) {
  Serial.print("Disconnected, reason = 0x");
  Serial.println(reason, HEX);
}

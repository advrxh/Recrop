#include <DHT.h>

#define DHTPIN 7
#define DHTTYPE DHT11
#define LM_PIN A0
#define MOISTURE_PIN A5
#define PUMP_PIN 6
#define PIR_PIN 10

int SIGNAL_LED_OUT = 8;
int SIGNAL_BUZ_OUT = 9;

DHT dht(DHTPIN, DHTTYPE);

struct ReadValues {
  float temperature;
  float humidity;
  float moisture;
};

// multitasking

unsigned long last_exec = millis();
long interval = 2000;
int iteration_idx = 0;

unsigned long last_scan = millis();
unsigned long last_detc = millis();
long pir_interval = 1000;
long pir_detc_interval = 5000;


// iter mean data

float humidity_set[5];
float temperature_set_dht[5];
// float temperature_set_lm35[5];
float moisture_set[5];


void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  dht.begin();
  pinMode(SIGNAL_LED_OUT, OUTPUT);
  pinMode(SIGNAL_BUZ_OUT, OUTPUT);
  pinMode(PUMP_PIN, OUTPUT);
  pinMode(PIR_PIN, INPUT);
  digitalWrite(PUMP_PIN, HIGH);
}

// signal

void send_data_signal(){
  digitalWrite(SIGNAL_LED_OUT, HIGH);
  digitalWrite(SIGNAL_BUZ_OUT, HIGH);
  delay(500);
  digitalWrite(SIGNAL_LED_OUT, LOW); 
  digitalWrite(SIGNAL_BUZ_OUT, LOW);
}

// read dht11

float get_dht_humidity() {
  return dht.readHumidity();
}

float get_dht_temperature(){
  return dht.readTemperature();
}

// read lm

//float get_lm_temperature(){
//  return (analogRead(LM_PIN) * (5000/1024.0))/10;
//}

// read FC 28

float get_moisture(){
  return (100 - ((analogRead(MOISTURE_PIN)/1023.0) * 100));
}

// pump control

void pump_control() {
  char rx_byte = 0;
  String rx_str = "";

  if (Serial.available() > 0){
    rx_byte = Serial.read();
    if (rx_byte == '1'){
      digitalWrite(PUMP_PIN, LOW);
      Serial.println("P:1");
      }
    else if ( rx_byte == '0'){
      digitalWrite(PUMP_PIN, HIGH);
      Serial.println("P:0");
    }
  }
}
// Read data

void read_data(){
  ReadValues read_values;

  unsigned long currentTime = millis();

  if((currentTime - last_exec > interval) && (iteration_idx < 5)){

    //   other operation listeners
    // value setters

    int i = iteration_idx;
    
    humidity_set[i] = get_dht_humidity();
    temperature_set_dht[i] = get_dht_temperature();
    // temperature_set_lm35[i] = get_lm_temperature();
    moisture_set[i] = get_moisture();

    iteration_idx += 1;

    last_exec = currentTime;
  }

  else if (iteration_idx == 5){
    float humidity = 0;
    float temperature_dht = 0;
    // float temperature_lm35 = 0;
    float moisture = 0;

    for (int i = 0; i < 5; i++) {
      humidity += humidity_set[i];
      temperature_dht += temperature_set_dht[i];
      // temperature_lm35 += temperature_set_lm35[i];
      moisture += moisture_set[i];
    }

    humidity = humidity / 5;
    temperature_dht = temperature_dht / 5;
    moisture = moisture / 5;

    read_values.humidity = humidity;
    read_values.temperature = temperature_dht;
    read_values.moisture = moisture;

    iteration_idx = 0;

    // iter mean data

    for (int i = 0; i < 5; i++){
    humidity_set[i] = 0;
    temperature_set_dht[i] = 0;;
    // float temperature_set_lm35[5];
    moisture_set[i] = 0;
    }

  send_data_signal();
  
  Serial.print("H:");
  Serial.println(read_values.humidity);

  Serial.print("T:");
  Serial.println(read_values.temperature);

  Serial.print("MS:");
  Serial.println(read_values.moisture);
  }
}

void pir_scan(){
  unsigned long currentTime = millis();

  if (currentTime - last_scan > pir_interval){
    if(!(currentTime - last_detc < pir_detc_interval)){
      if(digitalRead(PIR_PIN) == HIGH){
        Serial.println("M:1");
        last_detc = currentTime;
      }
    }
      last_scan = currentTime;
    }
  
}

void loop() {
  // put your main code here, to run repeatedly:  
  read_data();
  pump_control();
  pir_scan();
}

 

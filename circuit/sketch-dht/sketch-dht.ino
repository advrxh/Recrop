#include <DHT.h>

#define DHTPIN 7
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  // put your main code here, to run repeatedly:

  float humidity = dht.readHumidity();
  Serial.print("Humidity :\t");
  Serial.println(humidity);

  delay(500);
  
  float temperature = dht.readTemperature();
  Serial.print("temperature :\t");
  Serial.println(temperature);
  
  delay(100);
}

 

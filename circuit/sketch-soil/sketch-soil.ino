
int soil_moisture_pin = A0;


void setup() {
  // put your setup code here, to run once:
   Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:

  Serial.println(((analogRead(soil_moisture_pin)/1023.0) * 100));

  delay(3000);
}

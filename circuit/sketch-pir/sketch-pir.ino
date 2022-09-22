void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(8, INPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  if (digitalRead(8) == 1){
  Serial.println("MOVEMENT detected");
  }
  else {
    Serial.println("NO MOVEMENT");
  }
  

  delay(2000);
}

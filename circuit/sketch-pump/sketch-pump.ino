
int motorPin = 8;

void setup() {
  // put your setup code here, to run once:
   Serial.begin(9600);
   pinMode(13, OUTPUT);
   pinMode(8, OUTPUT);
    digitalWrite(8, HIGH);
}

void loop() {
  // put your main code here, to run repeatedly:
  char rx_byte = 0;
  String rx_str = "";

  if (Serial.available() > 0){
    rx_byte = Serial.read();

    if (rx_byte == '1'){
      Serial.println("ON");
      digitalWrite(motorPin, LOW);
      digitalWrite(13, HIGH);
      }
    else if ( rx_byte == '0'){
      Serial.println("OFF");
      digitalWrite(motorPin, HIGH);
      digitalWrite(13, LOW);
    }
  }
  delay(1000);
}

int val;
#define tempPin  A0

void setup()
{
  Serial.begin(9600);
}
void loop()
{
  val = analogRead(tempPin);
  float mv = (val * (5000/1024.0))/10;
  Serial.println(mv);

   delay(3000);
}

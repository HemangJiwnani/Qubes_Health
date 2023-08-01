print("G")
import mysql.connector

mydb = mysql.connector.connect(
  host="164.52.212.196",
  port=3306,
  user="iailDataMining",
  password="CUWDUY@xjhjh8971",
  database="qubes"
)

mycursor = mydb.cursor()

mycursor.execute("SHOW DATABASES;")

myresult = mycursor.fetchall()
print("Hello " + myresult)

# for x in myresult:
#   print(x)
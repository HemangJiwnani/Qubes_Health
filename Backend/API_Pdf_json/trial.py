from fastapi import FastAPI
import pymysql

app = FastAPI()

@app.get("/files")
def get_files():
    try:
        # Connect to the MySQL database
        connection = pymysql.connect(
            host='164.52.212.196',
            user='iailDataMining',
            password='CUWDUY@xjhjh8971',
            database='qubes'
        )
        cursor = connection.cursor()

        # Execute the query to retrieve all data from the "File" table
        query = "SELECT * FROM File"
        cursor.execute(query)

        # Fetch all the rows from the result set
        rows = cursor.fetchall()

        # Close the database connection
        cursor.close()
        connection.close()
        new_data = []
        for file_data in rows:
            new_data.append({
                "Sno": file_data[0],
                "Flink": file_data[1],
                "ReferenceId": file_data[2],
                "FileName": file_data[3],
                "PushInTime": file_data[4],
                "CompeleTime": file_data[5],
                "CompanyId": file_data[6],
                "EmployeeName": file_data[7],
                "Employeemn": file_data[8],
                "Employeemail": file_data[9],
                "Patientn": file_data[10],
                "Ramount": file_data[11],
                "Eamount": file_data[12]
            })
        rows = new_data
        # Return the data as JSON response
        return {"files": rows}
    
    except pymysql.Error as error:
        return {"error": f"Error connecting to MySQL database: {error}"}

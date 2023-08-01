import pymysql

def mysqlconnect():
    # To connect MySQL database
    conn = pymysql.connect(
        host="164.52.212.196",
        user="iailDataMining",
        password="CUWDUY@xjhjh8971",
        database="qubes"
    )

    cur = conn.cursor()

    # Execute SQL commands
    cur.execute("USE qubes;")  # Switch to the "qubes" database
    cur.execute("INSERT INTO login (username, password) VALUES ('example_user', 'example_password');")  # Insert values into the "login" table

    # Commit the changes to the database
    conn.commit()

    # Retrieve the inserted data
    cur.execute("SELECT * FROM login;")
    output = cur.fetchall()
    print(output)

    # To close the connection
    conn.close()

# Driver Code
if __name__ == "__main__":
    mysqlconnect()

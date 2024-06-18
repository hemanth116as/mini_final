from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
# Function to connect to the MySQL database
def get_db_connection():
    connection = mysql.connector.connect(
        host='localhost',
        user='root',
        password='1234',
        database='student_db'
    )
    return connection
# Function to query the database for login credentials
def authenticate_user(email, password):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    query = "SELECT * FROM students WHERE student_id = %s AND student_pass = %s"
    cursor.execute(query, (email, password))
    user = cursor.fetchone()
    connection.close()
    return user

@app.route('/api/login', methods=['POST'])
def login():
    try:
        # Get email and password from request JSON
        data = request.json
        email = data.get('email')
        password = data.get('password')

        # Authenticate user by querying the database
        user = authenticate_user(email, password)

        if user:
            # Valid credentials
            return jsonify({'message': 'Login successful!'}), 200
        else:
            # Invalid credentials
            return jsonify({'error': 'Invalid login credentials'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)

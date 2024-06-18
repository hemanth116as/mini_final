from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
EXCEL_DIRECTORY = "C:/Users/91934/OneDrive/Desktop/timetables/faculty_individual_tt"

@app.route('/get_faculty_excel_data/<filename>', methods=['GET'])
def get_excel_data(filename):
    try:
        file_path = os.path.join(EXCEL_DIRECTORY, filename)
        if os.path.isfile(file_path):
            # Read the file content
            with open(file_path, 'rb') as f:
                file_data = f.read()
            # Return file data as bytes
            return file_data
        else:
            return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

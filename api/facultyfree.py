from flask import Flask, request, jsonify
import pandas as pd
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Directory where department files are stored
DEPARTMENTS_DIRECTORY = 'C:/Users/91934/OneDrive/Desktop/timetables/deps'

@app.route('/get_faculty_availability', methods=['GET'])
def get_faculty_availability():
    try:
        department = request.args.get('department')
        day = request.args.get('day')
        time = request.args.get('time')
        print(department, day, time)
        
        if not department or not day or not time:
            return jsonify({'error': 'Missing parameters'}), 400

        # Assuming the file for each department is named after the department
        file_path = os.path.join(DEPARTMENTS_DIRECTORY, f'{department}.xlsx')

        if os.path.isfile(file_path):
            df = pd.read_excel(file_path)

            # Find the cell value for the given day and time
            try:
                availability = df.loc[df['Time'] == day, time].values[0]
                if pd.isna(availability):
                    return jsonify({'faculty': []})  # No faculty available
                else:
                    faculty_list = availability.split(',')
                    return jsonify({'faculty': faculty_list})
            except Exception as e:
                return jsonify({'error': f'Error reading data: {str(e)}'}), 500

        else:
            return jsonify({'error': 'Department file not found'}), 404

    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)

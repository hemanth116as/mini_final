from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import pandas as pd

app = Flask(__name__)
CORS(app)

STUDENT_EXCEL_DIRECTORY = os.getenv('STUDENT_EXCEL_DIRECTORY', "C:/Users/91934/OneDrive/Desktop/timetables/class_tt")
FACULTY_EXCEL_DIRECTORY = os.getenv('FACULTY_EXCEL_DIRECTORY', "C:/Users/91934/OneDrive/Desktop/timetables/faculty_individual_tt")

@app.route('/get_student_excel_files', methods=['GET'])
def get_student_excel_files():
    try:
        excel_files = [f for f in os.listdir(STUDENT_EXCEL_DIRECTORY) if f.endswith('.xlsx')]
        return jsonify(excel_files)
    except Exception as e:
        app.logger.error(f"Error getting student Excel files: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/get_faculty_excel_files', methods=['GET'])
def get_faculty_excel_files():
    try:
        excel_files = [f for f in os.listdir(FACULTY_EXCEL_DIRECTORY) if f.endswith('.xlsx')]
        return jsonify(excel_files)
    except Exception as e:
        app.logger.error(f"Error getting faculty Excel files: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/get_student_excel_data/<filename>', methods=['GET'])
def get_student_excel_data(filename):
    return get_excel_data(STUDENT_EXCEL_DIRECTORY, filename)

@app.route('/get_faculty_excel_data/<filename>', methods=['GET'])
def get_faculty_excel_data(filename):
    return get_faculty_data(FACULTY_EXCEL_DIRECTORY, filename)

def get_excel_data(directory, filename):
    try:
        if not os.path.basename(filename).endswith('.xlsx'):
            return "Invalid file type", 400

        file_path = os.path.join(directory, filename)
        if os.path.isfile(file_path):
            df = pd.read_excel(file_path)
            df_filled = df.ffill(axis=1)

            class_teacher = None
            room_number = None

            if "faculty" not in filename.lower():
                time_row_index = df_filled.apply(lambda row: row.astype(str).str.contains('time', case=False).any(), axis=1).idxmax()
                df_filled = df_filled.iloc[time_row_index:]

                time_col_index = df_filled.columns[df_filled.apply(lambda col: col.astype(str).str.contains('time', case=False).any())].tolist()[0]
                df_filled = df_filled.loc[:, time_col_index:]

                lunch_cols = df_filled.columns[df_filled.apply(lambda col: col.astype(str).str.contains('LUNCH', case=False).any())]
                for col in lunch_cols:
                    df_filled[col].iloc[1:] = "LUNCH"

                rows_to_remove = []
                for index, row in df_filled.iterrows():
                    for cell in row:
                        if isinstance(cell, str):
                            if cell.strip().lower().startswith("year"):
                                rows_to_remove.append(index)
                                break
                            elif cell.strip().lower().startswith("class teacher"):
                                class_teacher = cell
                            elif cell.strip().lower().startswith("room"):
                                room_number = row[row.index(cell) + 1] if (row.index(cell) + 1) < len(row) else None

                df_filled.drop(rows_to_remove, inplace=True)

            excel_data = df_filled.values.tolist()
            if "fac" in filename:
                excel_data = [row[2:] for row in excel_data]
                excel_data = [row[:len(row) - 2] + row[len(row) - 1:] for row in excel_data]

            return jsonify({
                'data': excel_data,
                'class_teacher': class_teacher,
                'room_number': room_number
            })
        else:
            return "File not found", 404
    except Exception as e:
        app.logger.error(f"Error getting Excel file {filename}: {e}")
        return str(e), 500

def get_faculty_data(directory, filename):
    try:
        file_path = os.path.join(directory, filename)
        if os.path.isfile(file_path):
            df = pd.read_excel(file_path)
            excel_data = df.values.tolist()
            return jsonify({'data': excel_data})
        else:
            return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/save_excel_data/<filename>', methods=['POST'])
def save_excel_data(filename):
    try:
        data = request.json.get('data')
        student_files = os.listdir(STUDENT_EXCEL_DIRECTORY)
        faculty_files = os.listdir(FACULTY_EXCEL_DIRECTORY)
        directory = ""

        if filename in student_files:
            directory = STUDENT_EXCEL_DIRECTORY
        elif filename in faculty_files:
            directory = FACULTY_EXCEL_DIRECTORY

        if directory == "":
            return jsonify({"error": "Invalid filename or directory"}), 400

        file_path = os.path.join(directory, filename)
        
        df = pd.DataFrame(data)
        df.to_excel(file_path, index=False)
        return jsonify({"message": "File saved successfully"}), 200
    except Exception as e:
        app.logger.error(f"Error saving Excel file {filename}: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

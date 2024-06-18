from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import pandas as pd

app = Flask(__name__)
CORS(app)
# Use environment variable for Excel directory
EXCEL_DIRECTORY = os.getenv('EXCEL_DIRECTORY', "C:/Users/91934/OneDrive/Desktop/timetables/")
@app.route('/get_excel_files', methods=['GET'])
def get_excel_files():
    try:
        # Get list of all files in the directory with .xlsx extension
        excel_files = [f for f in os.listdir(EXCEL_DIRECTORY) if f.endswith('.xlsx')]
        return jsonify(excel_files)
    except Exception as e:
        app.logger.error(f"Error getting Excel files: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/get_excel_data/<filename>', methods=['GET'])
def get_excel_data(filename):
    try:
        
        # Validate the requested filename to prevent directory traversal attacks
        if not os.path.basename(filename).endswith('.xlsx'):
            return "Invalid file type", 400

        file_path = os.path.join(EXCEL_DIRECTORY, filename)
        if os.path.isfile(file_path):
            # Load Excel file into a pandas DataFrame
            df = pd.read_excel(file_path)
            
            # Apply forward fill (ffill) to handle empty cells
            df_filled = df.ffill(axis=1)
            if "fac" in filename:
                app.logger.info(filename)
            class_teacher = None
            room_number = None


            if "faculty" not in filename.lower():

                # Remove rows until the row containing "time" (case-insensitive)
                time_row_index = df_filled.apply(lambda row: row.astype(str).str.contains('time', case=False).any(), axis=1).idxmax()
                df_filled = df_filled.iloc[time_row_index:]

                # Remove columns until the column containing "time" (case-insensitive)
                time_col_index = df_filled.columns[df_filled.apply(lambda col: col.astype(str).str.contains('time', case=False).any())].tolist()[0]
                df_filled = df_filled.loc[:, time_col_index:]

                # Replace entire column (except for the first row) with "LUNCH" if a cell in that column contains "LUNCH" (case-insensitive)
                lunch_cols = df_filled.columns[df_filled.apply(lambda col: col.astype(str).str.contains('LUNCH', case=False).any())]
                for col in lunch_cols:
                    df_filled[col].iloc[1:] = "LUNCH"  # Skip the first row

                # Process each row in the DataFrame
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
                
                # Drop rows that need to be removed
                df_filled.drop(rows_to_remove, inplace=True)
                

            # Convert DataFrame back to list of lists for JSON serialization
            excel_data = df_filled.values.tolist()
            if "fac" in filename:
                excel_data=[row[3:] for row in excel_data]
                excel_data = [row[:len(row)-2] + row[len(row)-1:] for row in excel_data]
                excel_data.insert(0,['Course Name','Course Code','Faculty Name','No.of Periods'])
                return jsonify({
                'data': excel_data,
                'class_teacher': class_teacher,
                'room_number': room_number
            })

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

if __name__ == '__main__':
    app.run(debug=True)
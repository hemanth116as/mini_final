import os
import pandas as pd
import re
import mysql.connector

folder_path = "C:/Users/91934/OneDrive/Desktop/timetables/faculty__tt"

def extract_faculty_data(file_path):
    try:
        df = pd.read_excel(file_path)
        faculty_names = df['Faculty Name'].tolist()
        course_codes = df['Course Code'].tolist()
        subjects = df['Subject(T/P)'].tolist()
        return faculty_names, course_codes, subjects
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return [], [], []

def abbreviate_subject(subject):
    subject = re.sub(r'\([^)]*\)', '', subject)
    subject = subject.replace("IT ", "IOT ").replace("ITL", "IOTL")
    words = subject.split()
    if subject.strip() == "Internet of Things":
        return "IOT"
    elif subject.strip() == "Internet of Things Lab":
        return "IOTLAB"
    else:
        abbreviation = ''.join([word if word.lower() == "lab" else word[0] for word in words if word[0].isupper() or word.lower() == "lab"])
        return abbreviation

def extract_classes_and_courses(folder_path):
    faculty_data = {}

    for filename in os.listdir(folder_path):
        if filename.endswith('.xlsx') and not filename.startswith('~$'):
            file_path = os.path.join(folder_path, filename)
            faculty_names, course_codes, _ = extract_faculty_data(file_path)

            for faculty_name, course_code in zip(faculty_names, course_codes):
                split_names = [name.strip() for name in faculty_name.split("&")]

                for name in split_names:
                    if name not in faculty_data:
                        faculty_data[name] = {}

                    class_name = os.path.splitext(filename)[0].replace("_Faculty", "").replace("_faculty", "")
                    if class_name not in faculty_data[name]:
                        faculty_data[name][class_name] = []

                    faculty_data[name][class_name].append(course_code)

    return faculty_data

all_faculty_names = []
course_code_subject_map = {}
course_code_abbreviation_map = {}
folder_path_faculty_tt = "C:/Users/91934/OneDrive/Desktop/timetables/faculty__tt"
faculty_data = extract_classes_and_courses(folder_path_faculty_tt)

for filename in os.listdir(folder_path):
    if filename.endswith('.xlsx') and not filename.startswith('~$'):
        file_path = os.path.join(folder_path, filename)
        faculty_names, course_codes, subjects = extract_faculty_data(file_path)
        all_faculty_names.extend(faculty_names)
        for course_code, subject in zip(course_codes, subjects):
            course_code_subject_map[course_code] = subject
            course_code_abbreviation_map[course_code] = abbreviate_subject(subject)

all_faculty_names = list(set(all_faculty_names))

pd.set_option('future.no_silent_downcasting', True)
directory_path = "C:/Users/91934/OneDrive/Desktop/timetables/class_tt"
processed_data = {}

for filename in os.listdir(directory_path):
    if filename.endswith(".xlsx"):
        file_path = os.path.join(directory_path, filename)
        d1 = pd.read_excel(file_path)
        time_row_index = d1.apply(lambda row: row.astype(str).str.contains('time', case=False)).any(axis=1).idxmax()
        if pd.isna(time_row_index):
            time_row_index = d1.apply(lambda row: row.astype(str).str.contains('Time', case=False)).any(axis=1).idxmax()
        d1 = d1.iloc[time_row_index:].reset_index(drop=True)
        d1.columns = d1.iloc[0]
        d1 = d1[1:]
        time_col_index = d1.apply(lambda col: col.astype(str).str.contains('time', case=False)).any(axis=0).idxmax()
        if pd.isna(time_col_index):
            time_col_index = d1.apply(lambda col: col.astype(str).str.contains('Time', case=False)).any(axis=0).idxmax()
        time_col_position = d1.columns.get_loc(time_col_index)
        d1 = d1.iloc[:, time_col_position:].reset_index(drop=True)
        d1 = d1.ffill(axis=1)
        lunch_col_index = d1.columns[d1.apply(lambda col: col.astype(str).str.contains('LUNCH', case=False)).any()]
        d1[lunch_col_index] = "LUNCH"
        d1 = d1.infer_objects(copy=False)
        filename_no_ext = os.path.splitext(filename)[0]
        processed_data[filename_no_ext] = d1

print(faculty_data)
d2 = processed_data['CSE-A'].copy()
indi = {}

for f in faculty_data:
    for col in d2.columns:
        d2[col] = "-"
    d2['Time'] = ["Period", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    for c in faculty_data[f]:
        l = faculty_data[f][c]
        l1 = []
        for r in l:
            l1.append(course_code_abbreviation_map[r])
        df = processed_data[c]
        for s in l1:
            for cols in d2.columns:
                for i in range(len(df[cols])):
                    if str(df[cols][i]).replace(" ", "").lower().find(s.lower()) != -1:
                        d2.loc[i, cols] = c + "_" + s
    d2.iloc[0] = ["Period", 1, 2, 3, 4, 5, 6, 7]
    indi[f] = d2.copy()

faculty_id = []

def create_excel_for_each_faculty(folder_path, faculty_names):
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    for faculty_name in indi:
        df = pd.DataFrame(indi[faculty_name])
        file_path = os.path.join(folder_path, f"{faculty_name.replace(' ', '_')}.xlsx")
        faculty_id.append(faculty_name.replace(' ', '_'))
        with pd.ExcelWriter(file_path, mode='w') as writer:
            df.to_excel(writer, sheet_name='Sheet1', index=False)

folder_path = "C:/Users/91934/OneDrive/Desktop/timetables/faculty_individual_tt"
faculty_names = all_faculty_names
create_excel_for_each_faculty(folder_path, faculty_names)

days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
cols = ['09.00 -10.00', '10.00 -11.00', '11.00 -12.00', '12.00 - 01.00', '01.40-02.40', '02.40-03.40']
d2 = d2.drop('01.00-01.40', axis=1)

for day in days:
    for time in cols:
        l = ""
        for fac in indi:
            value = indi[fac].loc[df['Time'] == day, time].values[0]
            if value == "-":
                l = l + "," + fac
        d2.loc[d2['Time'] == day, time] = l

if not os.path.exists("C:/Users/91934/OneDrive/Desktop/timetables/free"):
    os.makedirs("C:/Users/91934/OneDrive/Desktop/timetables/free")

df = pd.DataFrame(d2)
df.to_excel("C:/Users/91934/OneDrive/Desktop/timetables/free/sheet.xlsx", sheet_name='Sheet1', index=False)

faculty_names = faculty_id

def connect_to_mysql():
    config = {
        'host': 'localhost',
        'user': 'root',
        'password': '1234',
        'database': 'faculty_db'
    }

    try:
        connection = mysql.connector.connect(**config)
        return connection
    except mysql.connector.Error as err:
        print(f"Error connecting to MySQL: {err}")
        return None

def insert_faculty_data(connection):
    if connection is None:
        return

    common_password = '1234'

    try:
        cursor = connection.cursor()

        create_table_query = '''
        CREATE TABLE IF NOT EXISTS faculty (
            faculty_id INT AUTO_INCREMENT PRIMARY KEY,
            faculty_name VARCHAR(255) NOT NULL,
            faculty_pass VARCHAR(255) NOT NULL
        )
        '''
        cursor.execute(create_table_query)

        for faculty_name in faculty_names:
            insert_query = '''
            INSERT INTO faculty (faculty_name, faculty_pass)
            VALUES (%s, %s)
            '''
            cursor.execute(insert_query, (faculty_name, common_password))
            print(f"Inserted faculty: {faculty_name}")

        connection.commit()
        cursor.close()
    except mysql.connector.Error as err:
        print(f"Error inserting data: {err}")
    finally:
        connection.close()

connection = connect_to_mysql()
if connection:
    insert_faculty_data(connection)

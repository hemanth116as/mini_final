from threading import Thread
import student_tt
import faculty_tt
import app
import faculty_login
import facultyfree
import admin_module
import admin
import faculty
def run_student_app():
    student_tt.app.run(port=5005)

def run_faculty_tt_app():
    faculty_tt.app.run(port=5003)

def run_main_app():
    app.app.run(port=5001)

def run_faculty_login_app():
    faculty_login.app.run(port=5002)

def run_faculty_free_app():
    facultyfree.app.run(port=5004)

def run_admin_module_app():
    admin_module.app.run(port=5000)
def run_admin_app():
    admin.app.run(port=5006)
def run_faculty_app():
    faculty.app.run(port=5007)
if __name__ == "__main__":
    # Create threads for each Flask app
    student_thread = Thread(target=run_student_app)
    faculty_tt_thread = Thread(target=run_faculty_tt_app)
    main_app_thread = Thread(target=run_main_app)
    faculty_login_thread = Thread(target=run_faculty_login_app)
    faculty_free_thread = Thread(target=run_faculty_free_app)
    admin_module_thread = Thread(target=run_admin_module_app)
    admin_thread=Thread(target=run_admin_app)
    faculty_thread=Thread(target=run_faculty_app)
    # Start all threads
    student_thread.start()
    faculty_tt_thread.start()
    main_app_thread.start()
    faculty_login_thread.start()
    faculty_free_thread.start()
    admin_module_thread.start()
    admin_thread.start()
    faculty_thread.start()
    # Join all threads
    student_thread.join()
    faculty_tt_thread.join()
    main_app_thread.join()
    faculty_login_thread.join()
    faculty_free_thread.join()
    admin_module_thread.join()
    admin_thread.join()
    faculty_thread.join()
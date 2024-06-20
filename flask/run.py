from flask import Flask
from truequear_app.views import *
from truequear_app.db_conexion import *

app = Flask(__name__)

#Rutas
app.route('/', methods=['GET'])(index)

# Database
test_connection()
create_table_tareas()
init_app(app)


if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, request, send_file
from truequear_app.views import *
from truequear_app.db_conexion import *


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = "./static/img"



@app.get('/api/articulos')
def get_articulos():
    return ver_articulos()

@app.post('/api/articulos')
def post_articulos():
    
    nuevo_articulo = request.get_json()
    titulo = nuevo_articulo['titulo']
    imagen = nuevo_articulo['imagen']
    descripcion = nuevo_articulo['descripcion']
    activo = nuevo_articulo['activo']
    articulo_nuevo = agregar_articulo(titulo,imagen,descripcion,activo)
    print(titulo,imagen,descripcion,activo)

    return articulo_nuevo


@app.delete('/api/articulos/<id>')
def delete_articulos(id):
    return borrar_articulo(id)


@app.put('/api/articulos/<id>')
def put_articulos(id):
    return modificar_articulo(id)

@app.get('/api/articulos/<id>')
def get_articulo(id):
    return ver_articulo(id)


@app.get('/')
def home():
    return send_file('templates/datos.html')
# Database
#test_connection()
#create_table_tareas()
init_app(app)


if __name__ == '__main__':
    app.run(debug=True)
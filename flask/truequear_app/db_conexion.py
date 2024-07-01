import os
import psycopg2
from psycopg2 import extras
from dotenv import load_dotenv  # type: ignore
from flask import g, jsonify, request
# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Configuración de la base de datos usando variables de entorno
DATABASE_CONFIG = {
    'user': os.getenv('DB_USERNAME'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'database': os.getenv('DB_NAME'),
    'port': os.getenv('DB_PORT', 5432)
}


def test_connection():
    conn = psycopg2.connect(**DATABASE_CONFIG)
    cur = conn.cursor()
    conn.commit()
    cur.close()
    conn.close()

    print("TEST CONECTION - OK")


def agregar_articulo(titulo, imagen, descripcion, activo=True):
    conn = psycopg2.connect(**DATABASE_CONFIG)
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('INSERT INTO trueque (titulo, imagen, descripcion,activo) VALUES(%s,%s,%s,%s) RETURNING *',
                (titulo, imagen, descripcion, activo))
    nuevo_articulo = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(nuevo_articulo)


def ver_articulos():
    conn = psycopg2.connect(**DATABASE_CONFIG)
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM trueque')
    articulos = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(articulos)


def ver_articulo(id):
    conn = psycopg2.connect(**DATABASE_CONFIG)
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('SELECT * FROM trueque WHERE id= %s', (id))
    articulo = cur.fetchone()
    if articulo is None:
        return jsonify({'message': 'Articulos no encontrado'}), 404

    cur.close()
    conn.close()
    return jsonify(articulo)


def borrar_articulo(id):
    conn = psycopg2.connect(**DATABASE_CONFIG)
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    cur.execute('DELETE FROM trueque WHERE id=%s RETURNING *', (id))
    art_eliminado = cur.fetchone()
    if art_eliminado is None:
        return jsonify({'message': 'Articulos no encontrado'}), 404
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(art_eliminado)


def modificar_articulo(id):
    conn = psycopg2.connect(**DATABASE_CONFIG)
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    mod_articulo = request.get_json()
    titulo = mod_articulo['titulo']
    imagen = mod_articulo['imagen']
    descripcion = mod_articulo['descripcion']
    activo = mod_articulo['activo']
    cur.execute('UPDATE trueque SET titulo=%s, imagen=%s, descripcion=%s,activo=%s WHERE id=%s RETURNING *',
                (titulo, imagen, descripcion, activo, id))

    art_modificado = cur.fetchone()

    conn.commit()
    cur.close()
    conn.close()
    if art_modificado is None:
        return jsonify({'message': 'Articulos no encontrado'}), 404
    
    return jsonify(art_modificado)


def create_table_tareas():
    conn = psycopg2.connect(**DATABASE_CONFIG)
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS Trueque (
            id SERIAL PRIMARY KEY,
            titulo VARCHAR(50) NOT NULL,
            imagen VARCHAR(50) NOT NULL,
            descripcion VARCHAR(300) NOT NULL,
            activo BOOLEAN NOT NULL
        );
        """
    )
    conn.commit()
    cur.close()
    conn.close()

# Función para obtener la conexión a la base de datos


def get_db():
    # Si 'db' no está en el contexto global de Flask 'g'
    if 'db' not in g:
        # Crear una nueva conexión a la base de datos y guardarla en 'g'
        g.db = psycopg2.connect(**DATABASE_CONFIG)
    # Retornar la conexión a la base de datos
    return g.db

# Función para cerrar la conexión a la base de datos


def close_db(e=None):
    # Extraer la conexión a la base de datos de 'g' y eliminarla
    db = g.pop('db', None)
    # Si la conexión existe, cerrarla
    if db is not None:
        db.close()

# Función para inicializar la aplicación con el manejo de la base de datos


def init_app(app):
    # Registrar 'close_db' para que se ejecute al final del contexto de la aplicación
    app.teardown_appcontext(close_db)

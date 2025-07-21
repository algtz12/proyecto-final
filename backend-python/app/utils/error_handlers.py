from flask import jsonify

def handle_bad_request(e):
    return jsonify(error=str(e)), 400

def handle_not_found(e):
    return jsonify(error="Recurso no encontrado"), 404

def handle_unauthorized(e):
    return jsonify(error="No autorizado"), 401

def handle_forbidden(e):
    return jsonify(error="Acceso prohibido"), 403

def handle_internal_error(e):
    return jsonify(error="Error interno del servidor"), 500

def register_error_handlers(app):
    app.register_error_handler(400, handle_bad_request)
    app.register_error_handler(401, handle_unauthorized)
    app.register_error_handler(403, handle_forbidden)
    app.register_error_handler(404, handle_not_found)
    app.register_error_handler(500, handle_internal_error)
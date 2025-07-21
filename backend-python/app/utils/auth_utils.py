from functools import wraps
from flask import request, jsonify
import jwt

def admin_required(f):
    """Decorador para requerir rol de administrador"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token no proporcionado'}), 401
            
        try:
            # Eliminar 'Bearer ' si está presente
            if token.startswith('Bearer '):
                token = token[7:]
                
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            if payload.get('rol') != 'administrador':
                return jsonify({'error': 'Se requiere rol de administrador'}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401
        except Exception as e:
            return jsonify({'error': f'Error de autenticación: {str(e)}'}), 401
            
        return f(*args, **kwargs)
    return decorated_function

def consultor_or_admin_required(f):
    """Decorador para requerir rol de consultor o administrador"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token no proporcionado'}), 401
            
        try:
            # Eliminar 'Bearer ' si está presente
            if token.startswith('Bearer '):
                token = token[7:]
                
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            if payload.get('rol') not in ['administrador', 'consultor']:
                return jsonify({'error': 'Se requiere rol de consultor o administrador'}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401
        except Exception as e:
            return jsonify({'error': f'Error de autenticación: {str(e)}'}), 401
            
        return f(*args, **kwargs)
    return decorated_function
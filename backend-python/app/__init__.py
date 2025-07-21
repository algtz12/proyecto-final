from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache
from .config import Config
from .utils.error_handlers import register_error_handlers

db = SQLAlchemy()
cache = Cache()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Inicializar extensiones
    db.init_app(app)
    cache.init_app(app)
    CORS(app)
    
    # Importar modelos después de inicializar db
    with app.app_context():
        from .models import Categoria, Producto
    
    # Registrar blueprints
    from .routes.product_routes import product_bp
    from .routes.report_routes import report_bp
    
    app.register_blueprint(product_bp, url_prefix='/api/products')
    app.register_blueprint(report_bp, url_prefix='/api/reports')
    
    # Registrar manejadores de errores
    register_error_handlers(app)
    
    return app
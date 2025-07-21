import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Configuración de PostgreSQL
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuración de caché
    CACHE_TYPE = 'SimpleCache'  # Para desarrollo, en producción usar Redis
    CACHE_DEFAULT_TIMEOUT = 300  # 5 minutos
    
    # Clave secreta para JWT (compartida con Node.js)
    SECRET_KEY = os.getenv('JWT_SECRET', 'default-secret-key')
    
    # API Keys para servicios externos
    CURRENCY_API_KEY = os.getenv('CURRENCY_API_KEY')
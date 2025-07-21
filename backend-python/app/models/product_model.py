from ..utils.db import db
from .category_model import Categoria

class Producto(db.Model):
    __tablename__ = 'productos'
    
    producto_id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    descripcion = db.Column(db.Text)
    precio = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    categoria_id = db.Column(db.Integer, db.ForeignKey('categorias.categoria_id'), nullable=False)
    imagen_url = db.Column(db.String(255))
    fecha_creacion = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    fecha_actualizacion = db.Column(db.DateTime, server_default=db.func.current_timestamp(), 
                                     onupdate=db.func.current_timestamp())
    activo = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'producto_id': self.producto_id,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'precio': float(self.precio),
            'stock': self.stock,
            'categoria_id': self.categoria_id,
            'imagen_url': self.imagen_url,
            'fecha_creacion': self.fecha_creacion.isoformat(),
            'fecha_actualizacion': self.fecha_actualizacion.isoformat(),
            'activo': self.activo
        }
    
    def update_from_dict(self, data):
        for key, value in data.items():
            if hasattr(self, key) and key != 'producto_id':
                setattr(self, key, value)
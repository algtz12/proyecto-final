from ..utils.db import db

class Categoria(db.Model):
    __tablename__ = 'categorias'
    
    categoria_id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text)
    
    # Relación con productos
    productos = db.relationship('Producto', backref='categoria', lazy=True)
    
    def to_dict(self):
        return {
            'categoria_id': self.categoria_id,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'productos_count': len(self.productos)
        }
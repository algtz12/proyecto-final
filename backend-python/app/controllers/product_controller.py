from flask import request, jsonify, current_app
from app.models.product_model import Producto
from app.models.category_model import Categoria
from app.utils import db
from app.utils.cache import cache
from app.utils.auth_utils import admin_required

class ProductController:
    @staticmethod
    @cache.cached(timeout=300, query_string=True)
    def get_all_products():
        """Obtiene todos los productos activos con paginación"""
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 20, type=int)
            
            # Consulta productos activos con paginación
            productos = Producto.query.filter_by(activo=True).paginate(
                page=page, per_page=per_page, error_out=False
            )
            
            return jsonify({
                'data': [producto.to_dict() for producto in productos.items],
                'pagination': {
                    'total': productos.total,
                    'pages': productos.pages,
                    'current_page': productos.page,
                    'per_page': productos.per_page,
                    'next_page': productos.next_num if productos.has_next else None,
                    'prev_page': productos.prev_num if productos.has_prev else None
                }
            }), 200
        except Exception as e:
            current_app.logger.error(f"Error al obtener productos: {str(e)}")
            return jsonify({'error': 'Error interno del servidor'}), 500

    @staticmethod
    def get_product(product_id):
        """Obtiene un producto por su ID"""
        try:
            producto = Producto.query.get_or_404(product_id)
            if not producto.activo:
                return jsonify({'error': 'Producto no encontrado'}), 404
                
            return jsonify(producto.to_dict()), 200
        except Exception as e:
            current_app.logger.error(f"Error al obtener producto {product_id}: {str(e)}")
            return jsonify({'error': 'Error interno del servidor'}), 500

    @staticmethod
    @admin_required
    def create_product():
        """Crea un nuevo producto (solo administradores)"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Datos no proporcionados'}), 400
                
            # Validar campos requeridos
            required_fields = ['nombre', 'precio', 'stock', 'categoria_id']
            if not all(field in data for field in required_fields):
                return jsonify({'error': 'Faltan campos requeridos'}), 400
                
            # Verificar existencia de categoría
            categoria = Categoria.query.get(data['categoria_id'])
            if not categoria:
                return jsonify({'error': 'Categoría no encontrada'}), 400
                
            # Crear nuevo producto
            nuevo_producto = Producto(
                nombre=data['nombre'],
                descripcion=data.get('descripcion', ''),
                precio=data['precio'],
                stock=data['stock'],
                categoria_id=data['categoria_id'],
                imagen_url=data.get('imagen_url', '')
            )
            
            db.session.add(nuevo_producto)
            db.session.commit()
            
            # Invalidar caché de productos
            cache.delete('view//api/products')
            
            return jsonify(nuevo_producto.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error al crear producto: {str(e)}")
            return jsonify({'error': 'Error interno del servidor'}), 500

    @staticmethod
    @admin_required
    def update_product(product_id):
        """Actualiza un producto existente (solo administradores)"""
        try:
            producto = Producto.query.get_or_404(product_id)
            data = request.get_json()
            
            # Actualizar campos permitidos
            producto.update_from_dict(data)
            
            # Si se cambia la categoría, validar que exista
            if 'categoria_id' in data:
                categoria = Categoria.query.get(data['categoria_id'])
                if not categoria:
                    return jsonify({'error': 'Categoría no encontrada'}), 400
                producto.categoria_id = data['categoria_id']
            
            db.session.commit()
            
            # Invalidar caché de este producto y de la lista
            cache.delete(f'view//api/products/{product_id}')
            cache.delete('view//api/products')
            
            return jsonify(producto.to_dict()), 200
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error al actualizar producto {product_id}: {str(e)}")
            return jsonify({'error': 'Error interno del servidor'}), 500

    @staticmethod
    @admin_required
    def delete_product(product_id):
        """Desactiva un producto (solo administradores)"""
        try:
            producto = Producto.query.get_or_404(product_id)
            producto.activo = False
            db.session.commit()
            
            # Invalidar caché
            cache.delete(f'view//api/products/{product_id}')
            cache.delete('view//api/products')
            
            return jsonify({'message': 'Producto desactivado'}), 200
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Error al desactivar producto {product_id}: {str(e)}")
            return jsonify({'error': 'Error interno del servidor'}), 500

    @staticmethod
    def get_categories():
        """Obtiene todas las categorías"""
        try:
            categorias = Categoria.query.all()
            return jsonify([categoria.to_dict() for categoria in categorias]), 200
        except Exception as e:
            current_app.logger.error(f"Error al obtener categorías: {str(e)}")
            return jsonify({'error': 'Error interno del servidor'}), 500
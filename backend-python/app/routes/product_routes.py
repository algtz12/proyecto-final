from flask import Blueprint
from ..controllers import product_controller

product_bp = Blueprint('product_bp', __name__)

@product_bp.route('', methods=['GET'])
def get_all_products():
    return product_controller.ProductController.get_all_products()

@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    return product_controller.ProductController.get_product(product_id)

@product_bp.route('', methods=['POST'])
def create_product():
    return product_controller.ProductController.create_product()

@product_bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    return product_controller.ProductController.update_product(product_id)

@product_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    return product_controller.ProductController.delete_product(product_id)

@product_bp.route('/categories', methods=['GET'])
def get_categories():
    return product_controller.ProductController.get_categories()
from flask import Blueprint
from ..controllers import report_controller

report_bp = Blueprint('report_bp', __name__)

@report_bp.route('/sales', methods=['GET'])
def get_sales_report():
    return report_controller.ReportController.get_sales_report()

@report_bp.route('/products', methods=['GET'])
def get_products_report():
    return report_controller.ReportController.get_products_report()
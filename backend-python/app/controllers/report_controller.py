from flask import request, jsonify, send_file, current_app
from ..services import report_generator
from ..services.external_apis import ExternalAPIs
from ..utils.auth_utils import consultor_or_admin_required
import requests
import json

class ReportController:
    @staticmethod
    @consultor_or_admin_required
    def get_sales_report():
        """Genera un reporte de ventas en el formato solicitado"""
        try:
            # Obtener parámetros de la solicitud
            report_format = request.args.get('format', 'json')
            fecha_inicio = request.args.get('fecha_inicio')
            fecha_fin = request.args.get('fecha_fin')
            
            # Obtener datos de ventas del backend de Node.js
            node_api_url = current_app.config.get('NODE_API_URL', 'http://localhost:5000') + '/api/sales/report'
            params = {
                'fecha_inicio': fecha_inicio,
                'fecha_fin': fecha_fin
            }
            
            # Obtener token de autenticación
            token = request.headers.get('Authorization')
            headers = {'Authorization': token} if token else {}
            
            response = requests.get(node_api_url, params=params, headers=headers)
            
            if response.status_code != 200:
                return jsonify({'error': 'Error al obtener datos de ventas'}), response.status_code
                
            report_data = response.json()
            
            # Generar reporte en el formato solicitado
            if report_format == 'csv':
                csv_file, filename = report_generator.ReportGenerator.generate_csv_report(report_data)
                return send_file(csv_file, mimetype='text/csv', as_attachment=True, download_name=filename)
                
            elif report_format == 'excel':
                excel_file, filename = report_generator.ReportGenerator.generate_excel_report(report_data)
                return send_file(excel_file, mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
                                as_attachment=True, download_name=filename)
                
            elif report_format == 'pdf':
                pdf_file, filename = report_generator.ReportGenerator.generate_pdf_report(report_data, "Reporte de Ventas")
                return send_file(pdf_file, mimetype='application/pdf', as_attachment=True, download_name=filename)
                
            else:
                return jsonify(report_data), 200
                
        except Exception as e:
            current_app.logger.error(f"Error al generar reporte de ventas: {str(e)}")
            return jsonify({'error': 'Error interno del servidor'}), 500

    @staticmethod
    @consultor_or_admin_required
    def get_products_report():
        """Genera un reporte de productos por categoría"""
        try:
            # Obtener todas las categorías con sus productos
            categorias = Categoria.query.all()
            report_data = []
            
            for categoria in categorias:
                productos_activos = [p for p in categoria.productos if p.activo]
                report_data.append({
                    'categoria_id': categoria.categoria_id,
                    'categoria': categoria.nombre,
                    'productos_count': len(productos_activos),
                    'valor_total': sum(p.precio * p.stock for p in productos_activos)
                })
            
            return jsonify(report_data), 200
        except Exception as e:
            current_app.logger.error(f"Error al generar reporte de productos: {str(e)}")
            return jsonify({'error': 'Error interno del servidor'}), 500
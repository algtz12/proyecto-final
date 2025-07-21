import pandas as pd
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors
from flask import current_app

class ReportGenerator:
    @staticmethod
    def generate_csv_report(data, filename="reporte.csv"):
        """Genera un reporte CSV a partir de una lista de diccionarios"""
        if not data:
            return None
            
        df = pd.DataFrame(data)
        output = BytesIO()
        df.to_csv(output, index=False)
        output.seek(0)
        return output, filename

    @staticmethod
    def generate_excel_report(data, filename="reporte.xlsx"):
        """Genera un reporte Excel (xlsx) a partir de una lista de diccionarios"""
        if not data:
            return None
            
        df = pd.DataFrame(data)
        output = BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name='Reporte')
        output.seek(0)
        return output, filename

    @staticmethod
    def generate_pdf_report(data, title="Reporte", filename="reporte.pdf"):
        """Genera un reporte PDF a partir de una lista de diccionarios"""
        if not data:
            return None
            
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        
        # Crear tabla con los datos
        headers = list(data[0].keys())
        table_data = [headers]
        
        for row in data:
            table_data.append([str(row[header]) for header in headers])
        
        # Crear y estilizar la tabla
        table = Table(table_data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        # Construir el documento
        elements = []
        elements.append(table)
        doc.build(elements)
        
        buffer.seek(0)
        return buffer, filename
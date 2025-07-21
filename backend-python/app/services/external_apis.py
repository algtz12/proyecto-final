import requests
from flask import current_app

class ExternalAPIs:
    @staticmethod
    def get_currency_conversion(amount, from_currency, to_currency):
        """Obtiene la conversión de moneda usando una API externa"""
        api_key = current_app.config.get('CURRENCY_API_KEY')
        if not api_key:
            return None
            
        url = f"https://api.apilayer.com/exchangerates_data/convert?to={to_currency}&from={from_currency}&amount={amount}"
        headers = {"apikey": api_key}
        
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            return data.get('result')
        except requests.exceptions.RequestException as e:
            current_app.logger.error(f"Error en API de divisas: {str(e)}")
            return None
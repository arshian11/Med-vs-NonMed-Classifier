# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import torch
# import io
# import base64
# from PIL import Image
# import requests
# from pdf2image import convert_from_bytes
# import cloudscraper
# import os
# from utils.model import load_model, classify_image
# import time

# app = Flask(__name__)
# CORS(app)

# # Initialize model
# device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
# model = load_model(device)

# @app.route('/api/classify-url', methods=['POST'])
# def classify_from_url():
#     try:
#         data = request.json
#         url = data.get('url')
        
#         if not url:
#             return jsonify({'error': 'URL is required'}), 400
        
#         # Use cloudscaper to extract images
#         scraper = cloudscraper.CloudScraper()
#         images = scraper.extract_images(url)
        
#         results = []
#         for i, img_url in enumerate(images):
#             try:
#                 # Download image
#                 response = requests.get(img_url)
#                 image = Image.open(io.BytesIO(response.content))
                
#                 # Classify image
#                 classification, confidence = classify_image(image, model)
                
#                 results.append({
#                     'id': f'url-{i}',
#                     'imageUrl': img_url,
#                     'classification': classification,
#                     'confidence': float(confidence),
#                     'source': 'url',
#                     'originalUrl': url,
#                     'timestamp': int(time.time() * 1000)
#                 })
#             except Exception as e:
#                 print(f"Error processing image {img_url}: {e}")
#                 continue
        
#         return jsonify({'results': results})
    
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/classify-pdf', methods=['POST'])
# def classify_from_pdf():
#     try:
#         if 'file' not in request.files:
#             return jsonify({'error': 'No file provided'}), 400
        
#         file = request.files['file']
#         if file.filename == '':
#             return jsonify({'error': 'No file selected'}), 400
        
#         # Convert PDF to images
#         pdf_bytes = file.read()
#         images = convert_from_bytes(pdf_bytes, dpi=200)
        
#         results = []
#         for page_num, image in enumerate(images, 1):
#             try:
#                 # Classify image
#                 classification, confidence = classify_image(image, model)
                
#                 # Convert image to base64 for frontend display
#                 buffer = io.BytesIO()
#                 image.save(buffer, format='JPEG')
#                 img_str = base64.b64encode(buffer.getvalue()).decode()
#                 img_url = f"data:image/jpeg;base64,{img_str}"
                
#                 results.append({
#                     'id': f'pdf-{page_num}',
#                     'imageUrl': img_url,
#                     'classification': classification,
#                     'confidence': float(confidence),
#                     'source': 'pdf',
#                     'pageNumber': page_num,
#                     'timestamp': int(time.time() * 1000)
#                 })
#             except Exception as e:
#                 print(f"Error processing page {page_num}: {e}")
#                 continue
        
#         return jsonify({'results': results})
    
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/health', methods=['GET'])
# def health_check():
#     return jsonify({'status': 'healthy', 'model_loaded': model is not None})

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5000)

from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import io
import base64
from PIL import Image
import requests
from pdf2image import convert_from_bytes
import cloudscraper
from bs4 import BeautifulSoup
from utils.model import load_model, classify_image

import time

app = Flask(__name__)
CORS(app)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = load_model(device)

@app.route('/api/classify-url', methods=['POST'])
def classify_from_url():
    try:
        data = request.json
        url = data.get('url') # type: ignore
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400

        scraper = cloudscraper.create_scraper()
        response = scraper.get(url, timeout=10)
        
        if response.status_code != 200:
            return jsonify({'error': f'Status code {response.status_code}'}), 400

        soup = BeautifulSoup(response.content, 'html.parser')
        image_tags = soup.find_all('img')
        if not image_tags:
            return jsonify({'results': []})

        results = []

        for i, img_tag in enumerate(image_tags):
            img_url = (
                img_tag.get("src") or  # type: ignore
                img_tag.get("data-src") or # type: ignore
                img_tag.get("data-lazy") or # type: ignore
                img_tag.get("data-original") or # type: ignore
                img_tag.get("data-url") # type: ignore
            )

            if not img_url:
                continue

            img_url = str(img_url).strip()

            # Normalize image URL
            if img_url.startswith("//"):
                img_url = "https:" + img_url
            elif img_url.startswith("/"):
                base = url.rstrip("/")
                img_url = base + img_url
            elif not img_url.startswith("http"):
                continue

            try:
                img_response = scraper.get(img_url, timeout=10)
                img_response.raise_for_status()
                image = Image.open(io.BytesIO(img_response.content)).convert('RGB')

                classification, confidence = classify_image(image, model)

                results.append({
                    'id': f'url-{i}',
                    'imageUrl': img_url,
                    'classification': classification,
                    'confidence': float(confidence),
                    'source': 'url',
                    'originalUrl': url,
                    'timestamp': int(time.time() * 1000)
                })
            except Exception as e:
                print(f"⚠️ Failed to classify {img_url}: {e}")
                continue

        return jsonify({'results': results})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
# utils/process_pdf.py - PDF processing functionality

from pdf2image import convert_from_path
from tqdm import tqdm
from utils.model import classify_image
from utils.common import save_classified_image
from config import PDF_DPI


def process_pdf(pdf_path, model, output_folder):
    """Process PDF file and classify all pages"""
    print(f"\n🔍 Processing PDF: {pdf_path}")
    
    try:
        # Convert PDF pages to images
        pages = convert_from_path(pdf_path, dpi=PDF_DPI)
        print(f"📄 Extracted {len(pages)} pages from PDF...")
        
        results = []
        
        for idx, page in enumerate(tqdm(pages, desc="Classifying PDF pages")):
            # Classify the page
            label, prob = classify_image(page, model)
            
            # Create filename
            filename = f"pdf_page_{idx+1:03d}_{label}_{prob:.2f}.png"
            
            # Save the classified image
            path = save_classified_image(page, label, prob, filename, output_folder)
            
            # Store result
            result = {
                'page': idx + 1,
                'label': label,
                'probability': prob,
                'filename': filename,
                'path': path
            }
            results.append(result)
            
            print(f"🧾 Page {idx+1}: {label} ({prob:.2f}) → {filename}")
        
        # Print summary
        medical_count = sum(1 for r in results if r['label'] == 'medical')
        non_medical_count = len(results) - medical_count
        
        print(f"\n📊 PDF Processing Summary:")
        print(f"   Total pages: {len(results)}")
        print(f"   Medical: {medical_count}")
        print(f"   Non-medical: {non_medical_count}")
        
        return results
        
    except Exception as e:
        print(f"❌ Error processing PDF: {e}")
        return []
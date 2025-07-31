# utils/process_url.py - URL processing functionality

import cloudscraper
from PIL import Image
from io import BytesIO
from bs4 import BeautifulSoup
from tqdm import tqdm
from utils.model import classify_image
from utils.common import save_classified_image
from config import REQUEST_TIMEOUT, IMAGE_TIMEOUT


def process_url(site_url, model, output_folder):
    """Process URL and classify all images found"""
    print(f"\n🌐 Processing URL: {site_url}")
    
    try:
        # Create CloudScraper instance
        scraper = cloudscraper.create_scraper()
        
        # Get the webpage
        print("📡 Fetching webpage...")
        response = scraper.get(site_url, timeout=REQUEST_TIMEOUT)
        
        if response.status_code != 200:
            print(f"❌ Server returned status {response.status_code}")
            return []
        
        print("✅ Webpage fetched successfully")
        
        # Parse HTML content
        soup = BeautifulSoup(response.content, 'html.parser')
        image_tags = soup.find_all('img')

        if not image_tags:
            print("❌ No images found at URL.")
            return []

        print(f"🖼️ Found {len(image_tags)} images to process...")
        
        results = []
        successful_downloads = 0
        
        for idx, img_tag in enumerate(tqdm(image_tags, desc="Classifying web images")):
            # Extract image URL from various possible attributes
            img_url = (img_tag.get("src") or # type: ignore
                      img_tag.get("data-src") or # type: ignore
                      img_tag.get("data-lazy") or # type: ignore
                      img_tag.get("data-original") or # type: ignore
                      img_tag.get("data-url")) # type: ignore
            
            img_url = str(img_url)
            if not img_url:
                continue

            # Normalize the URL
            if img_url.startswith("//"):
                img_url = "https:" + img_url
            elif img_url.startswith("/"):
                img_url = site_url.rstrip("/") + img_url
            elif not img_url.startswith(("http://", "https://")):
                continue

            try:
                # Download image
                img_response = scraper.get(img_url, timeout=IMAGE_TIMEOUT)
                img_response.raise_for_status()
                
                # Open and process image
                image = Image.open(BytesIO(img_response.content))
                
                # Classify image
                label, prob = classify_image(image, model)
                
                # Create filename
                filename = f"url_img_{successful_downloads+1:03d}_{label}_{prob:.2f}.png"
                
                # Save classified image
                path = save_classified_image(image, label, prob, filename, output_folder)
                
                # Store result
                result = {
                    'index': successful_downloads + 1,
                    'url': img_url,
                    'label': label,
                    'probability': prob,
                    'filename': filename,
                    'path': path
                }
                results.append(result)
                successful_downloads += 1
                
                print(f"🌍 Image {successful_downloads}: {label} ({prob:.2f}) → {filename}")
                
            except Exception as e:
                print(f"⚠️ Failed to process image at {img_url}: {e}")
                continue
        
        # Print summary
        medical_count = sum(1 for r in results if r['label'] == 'medical')
        non_medical_count = len(results) - medical_count
        
        print(f"\n📊 URL Processing Summary:")
        print(f"   Images found: {len(image_tags)}")
        print(f"   Successfully processed: {successful_downloads}")
        print(f"   Medical: {medical_count}")
        print(f"   Non-medical: {non_medical_count}")
        
        return results
        
    except Exception as e:
        print(f"❌ Error processing URL: {e}")
        return []
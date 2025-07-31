# main.py - Main script entry point

import os
import sys
import argparse
import torch

# Add utils directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'utils'))

from utils.model import load_model
from utils.process_pdf import process_pdf
from utils.process_url import process_url
from utils.common import setup_output_dirs


def main():
    parser = argparse.ArgumentParser(
        description="Medical Image Classifier - Classify images from PDFs or URLs"
    )
    
    # Input options
    parser.add_argument("--pdf", type=str, help="Path to PDF file with images")
    parser.add_argument("--url", type=str, help="Website URL containing images")
    
    # Model selection option
    parser.add_argument("--model-type", type=str, choices=["cnn", "vit"], 
                       help="Model type to use (overrides config.py setting)")
    
    # Device option
    parser.add_argument("--device", type=str, choices=["cpu", "cuda", "auto"], 
                       default="auto", help="Device to use for inference")
    
    args = parser.parse_args()
    
    # Validate arguments
    if not args.pdf and not args.url:
        print("❌ Error: Please provide either --pdf or --url argument")
        parser.print_help()
        return
    
    if args.pdf and args.url:
        print("❌ Error: Please provide only one input source (--pdf or --url)")
        return
    
    # Setup device
    if args.device == "auto":
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    else:
        device = torch.device(args.device)
    
    print(f"🔧 Using device: {device}")
    
    # # Handle URL extraction only
    # if args.extract_urls and args.url:
    #     urls = get_image_urls_only(args.url)
    #     if urls:
    #         print("\n📋 Extracted Image URLs:")
    #         for i, url in enumerate(urls, 1):
    #             print(f"{i:3d}. {url}")
    #     return
    
    # Load model
    model = 0
    model_type = 0
    try:
        print("🤖 Loading model...")
        model_type = args.model_type if args.model_type else None
        model = load_model(device, model_type)
        print("✅ Model loaded successfully")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        # print(model)
        # print(model_type)
        return
    
    # Setup output directory
    output_folder = setup_output_dirs()
    print(f"📁 Output directory: {output_folder}")
    
    # Process input
    results = []
    
    if args.pdf:
        results = process_pdf(args.pdf, model, output_folder)
    elif args.url:
        results = process_url(args.url, model, output_folder)
    
    # Final summary
    if results:
        total_items = len(results)
        medical_count = sum(1 for r in results if r['label'] == 'medical')
        non_medical_count = total_items - medical_count
        
        print(f"\n🎉 Processing Complete!")
        print(f"📊 Final Summary:")
        print(f"   Total processed: {total_items}")
        print(f"   Medical: {medical_count} ({medical_count/total_items*100:.1f}%)")
        print(f"   Non-medical: {non_medical_count} ({non_medical_count/total_items*100:.1f}%)")
        print(f"   Results saved in: {output_folder}")
    else:
        print("\n❌ No items were processed")


if __name__ == "__main__":
    main()
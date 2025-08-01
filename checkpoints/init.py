import gdown
import os

# Replace with your Google Drive shareable link or file ID
drive_links = {
    "vit_model": "https://drive.google.com/uc?id=1yD_rV-FXilIEBsckMmYUAVYchKuwHXQb",
    "cnn_model": "https://drive.google.com/uc?id=1rId5OrtkgBemYX6WIboJ_tC-R2vooLfK",
    
}

def download_models(links):
    for name, url_or_id in links.items():
        print(f"⬇️ Downloading {name} model...")
        output_path = f"checkpoints/{name}.pth"
        gdown.download(url_or_id, output=output_path, quiet=False)
        print(f"✅ {name} model saved as: {output_path}")

if __name__ == "__main__":
    download_models(drive_links)


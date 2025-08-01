# Medical Image Classification Backend

## Setup Instructions

### 1. Project Structure
```
backend/
├── app.py                 # Flask API server
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── models/              # Model files directory
│   ├── cnn_model.pth    # Your trained CNN model
│   └── vit_model.pth    # Your trained ViT model (if using)
└── utils/
    ├── __init__.py
    ├── model.py          # Your model definition file
    └── vit_model.py      # ViT model utilities (if using)
```

### 2. Model File Placement

Place your trained model files in the `backend/models/` directory:

- **CNN Model**: `backend/models/cnn_model.pth`
- **ViT Model**: `backend/models/vit_model.pth` (if using Vision Transformer)

### 3. Installation

1. Create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Additional system dependencies for PDF processing:
```bash
# Ubuntu/Debian
sudo apt-get install poppler-utils

# macOS
brew install poppler

# Windows
# Download poppler from: https://github.com/oschwartz10612/poppler-windows/releases/
```

### 4. Configuration

Edit `config.py` to match your setup:
- Set `MODEL_TYPE` to "cnn" or "vit"
- Adjust `CNN_MODEL_PATH` and `VIT_MODEL_PATH` if needed
- Modify image preprocessing parameters if required

### 5. Running the Server

```bash
python app.py
```

The API will be available at `http://localhost:5000`

### 6. API Endpoints

- `POST /api/classify-url` - Extract and classify images from URL
- `POST /api/classify-pdf` - Convert PDF pages to images and classify
- `GET /api/health` - Health check endpoint

### 7. Frontend Integration

Update the frontend service to call your backend:

```typescript
// In src/services/modelService.ts
const API_BASE_URL = 'http://localhost:5000/api';

export async function classifyFromURL(url: string): Promise<ClassificationResult[]> {
  const response = await fetch(`${API_BASE_URL}/classify-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  const data = await response.json();
  return data.results;
}
```
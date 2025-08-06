# Medical vs Non-Medical Image Classifier

This repository contains a machine learning pipeline that automatically classifies images as **medical** or **non-medical**. The system supports inputs from **URLs** or **PDF files**, extracts all images, and outputs predicted labels using a **deep learning model** (ResNet18 or Vision Transformer).

---

## ✅ Features
- Accepts **URL** or **PDF** as input.
- Extracts all images from the given source.
- Classifies each image as **Medical** or **Non-Medical**.
- Supports **two model types**:
  - **CNN (ResNet18)** – Fast, high accuracy.
  - **ViT (Vision Transformer)** – State-of-the-art performance on large datasets.
- Provides **high accuracy**, tested on a mixed dataset of medical and non-medical images.

---

## 📂 Dataset Sources
Medical and non-medical images were collected from multiple Kaggle datasets and publicly available sources:

**Medical Datasets:**
- [Breast Histopathology Images](https://www.kaggle.com/datasets/paultimothymooney/breast-histopathology-images)
- [Chest X-ray Pneumonia](https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia)
- [Cervical Cancer SIPaKMeD](https://www.kaggle.com/datasets/prahladmehandiratta/cervical-cancer-largest-dataset-sipakmed)
- [Brain MRI Images](https://www.kaggle.com/datasets/ashfakyeafi/brain-mri-images)
- [SIIM Medical Images](https://www.kaggle.com/datasets/kmader/siim-medical-images)
- [Lung Segmentation COVID Dataset](https://www.kaggle.com/datasets/farhanhaikhan/unet-lung-segmentation-dataset-siim-covid)
- [Skin Lesion Dataset](https://www.kaggle.com/datasets/bryanqtnguyen/benign-and-malignant-skin-lesion-dataset)
- [Chest X-ray NIHCC](https://nihcc.app.box.com/v/ChestXray-NIHCC)

**Non-Medical Datasets:**
- [Natural Images](https://www.kaggle.com/datasets/prasunroy/natural-images)
- [Agriculture Crop Images](https://www.kaggle.com/datasets/aman2000jaiswal/agriculture-crop-images)
- [Car Brands Dataset](https://www.kaggle.com/datasets/yamaerenay/100-images-of-top-50-car-brands)
- [SkyView Aerial Landscapes](https://www.kaggle.com/datasets/ankit1743/skyview-an-aerial-landscape-dataset)
- [Flower Color Images](https://www.kaggle.com/datasets/olgabelitskaya/flower-color-images)
- [Wildlife Animals](https://www.kaggle.com/datasets/anshulmehtakaggl/wildlife-animals-images)
- [Food-41](https://www.kaggle.com/datasets/kmader/food41)
- [Fashion Product Images](https://www.kaggle.com/datasets/paramaggarwal/fashion-product-images-small)

---

## 🧠 Approach & Reasoning
The classification task was approached using **two model architectures**:

### 1. **ResNet18 (CNN-based)**
- **Pretrained vs Scratch**: Pretrained performed significantly better.
- **Why ResNet18?** Lightweight, fast, and excellent for feature extraction on image classification tasks.
- **Results**:
  - F1 Score: **0.99983**
  - Precision: **0.99988**
  - Recall: **0.99977**
  - AUC: **0.99999**
  - Accuracy: **0.99982**

### 2. **Vision Transformer (ViT)**
- Model: `vit_small_patch32_224`
- **Why ViT?** Transformers excel at capturing global image context, often outperforming CNNs on large-scale image datasets.
- **Results**:
  - F1 Score: **0.99678**
  - Precision: **0.99804**
  - Recall: **0.99552**
  - AUC: **0.99993**
  - Accuracy: **0.99662**

📊 **Confusion Matrices**:  
- [ResNet18 Confusion Matrix](https://github.com/arshian11/Med-vs-NonMed-Classifier/blob/main/asset/Screenshot%202025-07-30%20210918.png)  
- [ViT Confusion Matrix](https://github.com/arshian11/Med-vs-NonMed-Classifier/blob/main/asset/Screenshot%202025-07-30%20210954.png)

---

## ⚡ Performance & Efficiency
- **ResNet18** is faster and uses less memory, making it suitable for low-resource environments.
- **ViT** offers slightly better generalization on large datasets but requires more compute.
- **Inference Speed**:  
  - ResNet18: ~35ms/image  
  - ViT: ~80ms/image  
(on a standard GPU)

---

## 🚀 Installation & Usage

### **1. Clone the Repository**
```bash
git clone https://github.com/arshian11/Med-vs-NonMed-Classifier.git
cd medical-image-classifier
```

### **2. Install Dependencies**
```bash
pip install -r requirements.txt
```

### **3. Run the Script**
From a URL
```bash
python main.py --url https://radiopaedia.org/ --model-type cnn
```

From a PDF
```bash
python main.py --pdf xray-sample.pdf --model-type vit
```

- --url : Extracts images from a webpage.
- --pdf : Extracts images from a PDF file.
- --model-type : Choose between cnn (ResNet18) and vit (Vision Transformer).

## 📊 Model Summary

| Model     | Accuracy | F1 Score | Precision | Recall  | AUC     |
|-----------|----------|----------|-----------|---------|---------|
| ResNet18  | 0.99982  | 0.99983  | 0.99988   | 0.99977 | 0.99999 |
| ViT       | 0.99662  | 0.99678  | 0.99804   | 0.99552 | 0.99993 |

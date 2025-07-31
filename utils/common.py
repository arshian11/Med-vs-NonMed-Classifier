# utils/common.py - Common utility functions

import os
from datetime import datetime


def setup_output_dirs():
    """Create output directories with timestamp"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    base_dir = f"classification_output_{timestamp}"
    os.makedirs(os.path.join(base_dir, "medical"), exist_ok=True)
    os.makedirs(os.path.join(base_dir, "non-medical"), exist_ok=True)
    return base_dir


def save_classified_image(image, label, prob, filename, output_folder):
    """Save classified image to appropriate folder"""
    path = os.path.join(output_folder, label, filename)
    image.save(path)
    return path
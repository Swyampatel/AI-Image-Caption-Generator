from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from caption_generator import generate_caption
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Ensure CORS works for API routes

app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/api/caption', methods=['POST'])
def caption_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    file = request.files['image']
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    try:
        caption = generate_caption(filepath)
        if not caption:  # Ensure a valid caption is returned
            return jsonify({"error": "Caption generation failed"}), 500
        return jsonify({"caption": caption})
    except Exception as e:
        print(f"Error generating caption: {str(e)}")  # Debugging
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

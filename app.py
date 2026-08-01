from flask import Flask, render_template
from flask_cors import CORS
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

app = Flask(__name__, static_folder="static")
CORS(app)  # Enable CORS for API requests

# Import blueprints
from routes.user import user_bp

# Register blueprints at root so routes behave like standard pages
app.register_blueprint(user_bp)

# Serve static files (HTML, CSS, JS)
@app.route('/')
def serve_index():
    return render_template('homepage.html')

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
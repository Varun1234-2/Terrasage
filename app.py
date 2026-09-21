import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path
import re

# Configure page settings
st.set_page_config(
    page_title="TerraSage — Urban Climate Intelligence",
    page_icon="🌿",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Seamless full-screen styling for Streamlit container
st.markdown("""
    <style>
        #MainMenu {visibility: hidden;}
        header {visibility: hidden;}
        footer {visibility: hidden;}
        div[data-testid="stToolbar"] {visibility: hidden;}
        div[data-testid="stDecoration"] {visibility: hidden;}
        div[data-testid="stStatusWidget"] {visibility: hidden;}
        .block-container {
            padding: 0rem !important;
            margin: 0rem !important;
            max-width: 100% !important;
        }
        iframe {
            width: 100% !important;
            min-height: 100vh !important;
            border: none !important;
            display: block;
        }
    </style>
""", unsafe_allow_html=True)

base_dir = Path(__file__).parent
html_file_path = base_dir / "index.html"
css_file_path = base_dir / "style.css"
js_file_path = base_dir / "script.js"

if html_file_path.exists():
    with open(html_file_path, "r", encoding="utf-8") as f:
        html_code = f.read()

    # Seamlessly inline style.css if present so Streamlit's isolated iframe loads styling
    if css_file_path.exists():
        with open(css_file_path, "r", encoding="utf-8") as f:
            css_code = f.read()
        html_code = re.sub(
            r'<link\s+rel=["\']stylesheet["\']\s+href=["\']style\.css["\']\s*/?>',
            f'<style>\n{css_code}\n</style>',
            html_code,
            flags=re.IGNORECASE
        )

    # Seamlessly inline script.js if present so Streamlit's isolated iframe executes scripts
    if js_file_path.exists():
        with open(js_file_path, "r", encoding="utf-8") as f:
            js_code = f.read()
        html_code = re.sub(
            r'<script\s+src=["\']script\.js["\'](?:\s+defer)?\s*>\s*</script>',
            f'<script>\n{js_code}\n</script>',
            html_code,
            flags=re.IGNORECASE
        )

    # Render HTML application with generous height and smooth scrolling
    components.html(html_code, height=3600, scrolling=True)
else:
    st.error("`index.html` not found. Please ensure it is in the same directory as `app.py`.")

#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, render_template, jsonify
from typing import List, Tuple
import re
import logging
from pathlib import Path

app = Flask(__name__)
app.logger.setLevel(logging.INFO)

CONFIG = {
    'MAX_WORDS': 2000,
    'DEFAULT_WORDS': ["Merhaba!", "Dünya?", "Flask.", "Kelimeler,", "Sıralı:"],
    'WORD_PATTERN': r'\S+'  # Noktalama dahil her türlü karakter dizisi
}


def get_words_from_file(filepath: str) -> Tuple[List[str], int]:
    """
    Noktalama işaretlerini koruyarak kelimeleri okur
    Dönen değer: (kelime_listesi, okunan_satır_sayısı)
    """
    try:
        path = Path(filepath)
        if not path.exists():
            app.logger.error(f"Dosya bulunamadı: {filepath}")
            return CONFIG['DEFAULT_WORDS'], 0

        words = []
        line_count = 0

        with path.open('r', encoding='utf-8') as file:
            for line in file:
                line_count += 1
                line = line.strip()
                if not line:
                    continue

                # Noktalama işaretlerini koruyarak kelimeleri ayır
                line_words = re.findall(CONFIG['WORD_PATTERN'], line)
                words.extend(line_words)

                if len(words) >= CONFIG['MAX_WORDS']:
                    app.logger.warning(f"Maksimum kelime sınırı: {CONFIG['MAX_WORDS']}")
                    break

        if not words:
            app.logger.warning("Dosya boş veya geçerli kelime yok")
            return CONFIG['DEFAULT_WORDS'], line_count

        return words[:CONFIG['MAX_WORDS']], line_count

    except Exception as e:
        app.logger.critical(f"Dosya okuma hatası: {str(e)}")
        return CONFIG['DEFAULT_WORDS'], 0


@app.route('/')
def home():
    """Ana sayfa endpoint'i"""
    words, _ = get_words_from_file('data/book.txt')
    return render_template('index.html', words=words)


@app.route('/api/debug')
def debug():
    """Debug endpoint'i"""
    words, line_count = get_words_from_file('data/book.txt')
    return jsonify({
        'word_count': len(words),
        'line_count': line_count,
        'sample_words': words[:20],  # İlk 20 kelime
        'contains_punctuation': any(
            re.search(r'[.,!?;:]', word) for word in words[:20]
        )
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
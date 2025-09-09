from flask import Flask, jsonify, render_template, request, session, redirect, url_for
import uuid

from scripts.home_data.home_data import lojas, anos, meses

app = Flask(__name__)
app.secret_key = 'Gustavo@2022Ds'

@app.route('/')
def home():
    session.pop('grade_id', None)
    session['historico_funcionarios'] = 0
    return render_template('index.html', lojas=lojas, anos=anos, meses=meses)
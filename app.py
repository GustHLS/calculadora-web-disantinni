from flask import Flask, jsonify, render_template, request, session, redirect, url_for
import uuid

from scripts.home_data.home_data import get_lojas, get_meses, get_anos

app = Flask(__name__)
app.secret_key = 'Gustavo@2022Ds'

@app.route('/')
def home():
    """
    Rota principal.
    Quando acessada, renderiza a página inicial com as listas de lojas,
    anos e meses disponíveis.
    """
    session.pop('grade_id', None)
    session['historico_funcionarios'] = 0

    return render_template(
        'index.html',
        lojas=get_lojas(),
        meses=get_meses(),
        anos=get_anos()
    )
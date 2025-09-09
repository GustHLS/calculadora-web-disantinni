from datetime import datetime

import pandas as pd 

from scripts.db_connection.db import engine

# Query para pegar as lojas que estão ativas, não são franquias e são SMART.
query = "select distinct Loja from loja where LOJA_ATIVA = 'SIM' and LOJA_MODELO = 'S' AND PROPRIA_FRANQUIA = 'Propria'"
df = pd.read_sql(query, engine)
lojas = df['Loja'].tolist()

# Ano atual até 2018, são as possibilidades para rodar a calculadora.
ano_atual = datetime.now().year + 1
anos = [str(ano) for ano in range(ano_atual, 2017, -1)]

# Lista de todos os meses do ano.
meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]
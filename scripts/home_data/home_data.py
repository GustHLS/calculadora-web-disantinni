from datetime import datetime

import pandas as pd 

from scripts.db_connection.db import engine


def get_lojas():
    """
    Retorna a lista de lojas que são SMART, estão ativas e são próprias.
    Returns:
        list[str]: Lista de nomes de lojas.
    """

    query = "select distinct Loja from loja where LOJA_ATIVA = 'SIM' and LOJA_MODELO = 'S' AND PROPRIA_FRANQUIA = 'Propria'"
    df = pd.read_sql(query, engine)
    lojas = df['Loja'].tolist()

    return lojas


def get_anos():
    """
    Retorna a lista com os meses do ano em português.
    Returns:
        list[str]: Lista de anos como strings.
    """

    ano_atual = datetime.now().year + 1
    anos = [str(ano) for ano in range(ano_atual, 2017, -1)]

    return anos


def get_meses():
    """
    Função de retorno da lista de meses do ano.
    Returns:
        list[str]: Lista de nomes dos meses.
    """

    meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]

    return meses
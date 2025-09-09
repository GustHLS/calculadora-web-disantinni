from sqlalchemy import create_engine
import pandas as pd

USUARIO = 'gustavo.santinho'
SENHA = '3JYMzYbcpt'

dados_conexao = (
    "Server=10.115.1.6;"
    "Driver={SQL Server};"
    "Database=DWCOM;"
    f"UID={USUARIO};"
    f"PWD={SENHA}"
)

engine = create_engine(f"mssql+pyodbc:///?odbc_connect={dados_conexao}")

def teste_conexao():
    query = "SELECT TOP 1 * FROM fluxo_pessoas"
    df = pd.read_sql(query, engine)

    print(df)

# teste_conexao()

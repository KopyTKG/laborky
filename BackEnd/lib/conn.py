from sqlalchemy import create_engine, MetaData, Table
import os, dotenv

dotenv.load_dotenv()
DATABASE_URL= os.getenv('DB_URL')

engine = create_engine(DATABASE_URL)

metadata = MetaData()

metadata.reflect(bind=engine)

print("Tables in the database:")
for table_name in metadata.tables.keys():
    print(table_name)


from pathlib import Path
from app.services.ingestion import load_file, chunk_documents
from app.rag.vectorstore import add_documents

files = [
    Path("data/sample_kb/vpn_troubleshooting_guide.md"),
    Path("data/sample_kb/password_reset_and_mfa_policy.txt"),
]

docs = []
for file in files:
    docs.extend(load_file(file))

chunks = chunk_documents(docs)
ids = add_documents(chunks)

print(f"Loaded {len(docs)} documents, uploaded {len(chunks)} chunks to Pinecone")
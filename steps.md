1. `requirements.txt` — Add all required libraries such as LangGraph, OpenAI, Pinecone, Tavily, FastAPI, document loaders, etc.
2. `.env` — Configure API keys, Pinecone index/namespace, OpenAI model, embedding model, and other environment settings.
3. `app/core/config.py` — Load all `.env` configurations into the application using a centralized settings class.
4. `data/sample_kb/` — Add sample company IT documents such as VPN, password reset, MFA, and troubleshooting policies.
5. `app/services/ingestion.py` — Build the document loading and chunking pipeline for PDF, TXT, Markdown, and DOCX files.
6. `app/rag/vectorstore.py` — Configure OpenAI embeddings, connect with Pinecone, store document vectors, and create the retriever.
7. `ingest_sample_kb.py` — Create a simple script that loads the sample documents, chunks them, and uploads them into Pinecone.
8. `app/rag/state.py` — Define the LangGraph shared state containing the question, retrieved documents, grades, answer, retries, citations, and trace.

from sqlalchemy import Table, Column, String, Text, DateTime
from sqlalchemy.sql import func
from database import metadata

generated_images = Table(
    "generated_images",
    metadata,
    Column("id", String, primary_key=True),
    Column("user_id", String, nullable=False),
    Column("prompt", Text, nullable=False),
    Column("image_url", Text, nullable=False),
    Column("created_at", DateTime(timezone=True), server_default=func.now())
)

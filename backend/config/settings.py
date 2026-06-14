import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    ADMIN_EMAIL: str = "admin@unibooking.com"
    ADMIN_PASSWORD: str = "admin123"
    
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    
    RESEND_API_KEY: str = ""
    GOOGLE_MAPS_API_KEY: str = ""
    
    FRONTEND_URL: str
    CORS_ORIGINS: str = "*"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

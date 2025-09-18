#!/bin/bash

# Ecommerce Testbench Database Setup Script
# This script sets up the PostgreSQL database with sample data

echo "🚀 Setting up Ecommerce Testbench Database..."

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

# Database configuration
DB_NAME="ecommerce_testbench"
DB_USER="${POSTGRES_USER:-$(whoami)}"
DB_HOST="localhost"
DB_PORT="5432"

echo "📋 Database Configuration:"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo ""
echo "ℹ️  Note: Using current user as PostgreSQL user. Set POSTGRES_USER env var to override."
echo ""

# Check if database exists
if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "⚠️  Database '$DB_NAME' already exists."
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Dropping existing database..."
        psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
    else
        echo "ℹ️  Using existing database."
    fi
fi

# Create database if it doesn't exist
if ! psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "📦 Creating database '$DB_NAME'..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
fi

# Run setup script
echo "🔧 Running database setup script..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f backend/database/setup.sql

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "📊 Sample data includes:"
    echo "   - 5 categories"
    echo "   - 12 products"
    echo "   - 1 test user (check database for credentials)"
    echo ""
    echo "🎉 You can now start the application!"
    echo "   Backend: cd backend && npm run dev"
    echo "   Frontend: cd frontend && npm start"
else
    echo "❌ Database setup failed. Please check the error messages above."
    exit 1
fi

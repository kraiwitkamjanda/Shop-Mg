#!/bin/bash
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_CONTAINER_NAME="garden-shop-mvp-db-1"

mkdir -p $BACKUP_DIR

# Backup Database
docker exec $DB_CONTAINER_NAME pg_dump -U postgres gardenshop > $BACKUP_DIR/db_$TIMESTAMP.sql

# Backup Uploaded Images
tar -czf $BACKUP_DIR/uploads_$TIMESTAMP.tar.gz ./uploads

# Delete backups older than 30 days
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $TIMESTAMP"
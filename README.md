## Migrations

### Criar migrations
    npx node-pg-migrate create create-address-table -m src/infra/database/migrations

### Rodar migrations
    npx node-pg-migrate up

### Rollback
    npx node-pg-migrate down

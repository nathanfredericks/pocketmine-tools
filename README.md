# PocketMine Tools
Convert PocketMine-MP plugins online.

## Getting Started
Before switching environments, remember to delete all existing volumes.
### Development
Don't forget to copy `.env.example` to `.env.development` and fill in missing values before starting the server. Leave `NEXT_PUBLIC_POGGIT_SEARCH_API_KEY` blank.
```shell
docker compose -f compose.dev.yaml up --build
```

### Production
Don't forget to copy `.env.example` to `.env.production` and fill in missing values before starting the server. Leave `NEXT_PUBLIC_POGGIT_SEARCH_API_KEY` blank.
```shell
docker compose -f compose.prod.yaml run update-poggit-search
docker compose -f compose.prod.yaml up --build
```

## Notes
`crashdump.interface.ts` and `crashdump-schema.json` represent the same schema. Do not edit one without updating the other.

## Screenshots
![screenshot](https://github.com/nathanfredericks/pocketmine-tools/blob/main/screenshot.png?raw=true)

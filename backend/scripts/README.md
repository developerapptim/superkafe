Migration scripts

`migrate-file.js` posts a JSON file to `/api/data/migrate` and accepts `--url` and `--key`. If `API_KEY` is set in `.env`, the script will read it by default.
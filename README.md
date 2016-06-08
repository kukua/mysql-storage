# MySQL storage via MQTT

## To Do

- Log to file (with Bunyan)
- Error/exit when can't connect to MySQL or receiver

## Setup

```bash
ln -s ../concava-setup-mysql-mqtt/.env concava.env
./init.sh # to create the data table
docker-compose up -d

sleep 5
sudo chown $USER:$USER -R ./node_modules/
```

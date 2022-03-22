#!/bin/sh
sudo apt-get install nodejs
sudo apt install nginx
sudo npm install -g typescript
sudo npm install pm2 -g
sudo npm install -g pnpm
#sudo pnpm i next -w
sudo pnpm i 
cd apps/client
pm2 kill
pm2 start npm --name "next" -- start
sudo systemctl restart nginx


# uncomment to pause script execution.
# sleep 5
#MalignsSymbolic
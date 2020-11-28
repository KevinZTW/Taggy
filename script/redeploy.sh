#!/bin/sh     
git pull origin master
npm install
cd client/app
npm install
npm run-script build
cd ..
cd ..
sudo systemctl restart nginx
sudo pm2 restart all

## Setting up PM2 to run lolisafe

The best way to keep the service running in case of crashes or unexpected issues is to attach the process to PM2 and forget about it. This also gives you the ability to dettach the process from your terminal and run it in the background, which is a must since lolisafe now comes in 2 separate processes.
The recommended way to set it up is to run the commands below, one for the API and the other for the site.

```
pm2 start npm --name "lolisafe.api" -- run api
pm2 start npm --name "lolisafe.site" -- run site
```

All set, if you want to check the logs you can `pm2 logs lolisafe.api` or similar.

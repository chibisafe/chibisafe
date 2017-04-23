![loli-safe](https://a.cuntflaps.me/jcutlz.png)

# lolisafe, a small safe worth protecting

## Sites using loli-safe

- [lolisafe.moe](https://lolisafe.moe): A small safe worth protecting.
- [safe.moe](https://safe.moe): The world most ~~un~~safe pomf clone
- Feel free to add yours here.

## What's new in v2.2.0

- Creation of public link for sharing a gallery
- Ability to add your own html files without making git dirty (Check [this commit](https://github.com/WeebDev/loli-safe/commit/18c66d27fb580ed0f847f11525d2d2dca0fda2f4))
- Thumbnail creation for .webm and .mp4 (Thanks to [PascalTemel](https://github.com/PascalTemel))
- Changed how duplicate files work (Check [this issue for more info](https://github.com/WeebDev/loli-safe/issues/8))

If you're upgrading from a previous version, create a `migrate.js` file on the root folder with the following code and run it only once:

```js
const config = require('./config.js')
const db = require('knex')(config.database)
const randomstring = require('randomstring')

db.schema.table('albums', function (table) {
    table.string('identifier')
}).then(() => {
    db.table('albums').then((albums) => {
        for(let album of albums)
            db.table('albums').where('id', album.id).update('identifier', randomstring.generate(8)).then(() => {})
    })
})
```

## Running

1. Clone
1. Rename `config.sample.js` to `config.js`
1. Modify port, basedomain and privacy options if desired
1. run `npm install` to install all dependencies
1. *Optional* [Set up NGINX](#setting-up-nginx)
1. run `pm2 start lolisafe.js` or `node lolisafe.js` to start the service

## Getting started

This service supports running both as public and private. The only difference is that one needs a token to upload and the other one doesn't. If you want it to be public so anyone can upload files either from the website or API, just set the option `private: false` in the `config.js` file. In case you want to run it privately, you should set `private: true`.

Upon running the service for the first time, it's gonna create a user account with the username `root` and password `root`. This is your admin account and you should change the password immediately. This account will let you manage all uploaded files and remove any if necessary.

If you set `enableUserAccounts: true`, people will be able to create accounts on the service to keep track of their uploaded files and create albums to upload stuff to, pretty much like imgur does, but only through the API. Every user account has a token that the user can use to upload stuff through the API. You can find this token on the section called `Change your token` on the administration dashboard, and if it gets leaked or compromised you can renew it by clicking the button titled `Request new token`.

## Using loli-safe

Once the service starts you can start hitting the upload endpoint at `/api/upload` with any file. If you're using the frontend to do so then you are pretty much set, but if using the API to upload make sure the form name is set to `files[]` and the form type to `multipart/form-data`. If the service is running in private mode, dont forget to send a header of type `token: YOUR-CLIENT-TOKEN` to validate the request.

A sample of the returning json from the endpoint can be seen below:

```json
{
    "name": "EW7C.png",
    "size": "71400",
    "url": "https://i.kanacchi.moe/EW7C.png"
}
```

To make it easier and better than any other service, you can download [our Chrome extension](https://chrome.google.com/webstore/detail/loli-safe-uploader/enkkmplljfjppcdaancckgilmgoiofnj) that will let you configure your hostname and tokens, so that you can simply `right click` -> `send to loli-safe` to any image/audio/video file on the web.

----

## Setting up NGINX

- **_Note:_** Whenever you see `subdomain` or `domain` you should replace that with *your* subdomain/domain. If you do not have a subdomain, then just remove `subdomain`.

### **_Without_** SSL

1. Edit your NGINX config to follow this format `sudo vi /etc/nginx/sites-available/subdomain.domain.com`

```nginx
server {
    listen  subdomain.domain.com:80;    # Listen to IPv4 traffic on port 80.

    server_name subdomain.domain.com;   # The domain you set in your lolisafe config.js file.

    root    /path/to/local/lolisafe/github/repo/pages;  # NOTE! The path MUST end with '/pages'.

    index   home.html;              # This is the file to be sent to the requested user when they go to your domain (You shouldn't need to change this).

    client_max_body_size    512M;   # This must be grater than, or equal to the max upload size you set in the lolisafe config.

    access_log  /var/log/nginx/subdomain.domain.com.access.log;     # The file where all NGINX requests are logged.
    error_log   /var/log/nginx/subdomain.domain.com.error.log;      # The file where all NGINX errors are logged.

    location / {
        proxy_pass  http://subdomain.domain.com:9999;   # This is the domain and port number you set in the lolisafe config.js file.

        # These pass all relevant information to lolisafe.
        proxy_set_header    Host                $host;
        proxy_set_header    X-Real-IP           $remote_addr;
        proxy_set_header    x-Forwarded-For     $proxy_add_x_forwarded_for;
        proxy_set_header    x-Forwarded-Proto   $scheme;
    }
}

# Close vi by pressing ESC + :q! + ENTER.
```

1. Stage your config file to be live. This creates a [symbolic link](https://kb.iu.edu/d/abbe) to the configuration we just edited, so you only have to edit the file in `/etc/nginx/sites-available`
    - `sudo ln -s /etc/nginx/sites-available/subdomain.domain.com /etc/nginx/sites-enabled/`

1. Test the NGINX configuration with `sudo nginx -t`. If you get any errors, check for typos and missing semicolons. Otherwise, continue with the guide.
1. Restart NGINX
    - `sudo systemctl restart nginx`
1. Your lolisafe is available live at your domain! If you get any errors, make sure that you allowed the ports in the firewall (Ubuntu: `sudo ufw allow 80 && sudo ufw reload` ).

----

### **_With_** SSL

1. Edit the NGINX configuration of the domain you're going to use for lolisafe.
    1. `sudo vi /etc/nginx/sites-available/subdomain.domain.com`
    ```nginx
    server {
        listen  subdomain.domain.com:80;                    # Listen to IPv4 traffic on port 80.

        server_name subdomain.domain.com;                   # This is the domain and port number you set in the lolisafe config.js file.

        root    /path/to/local/lolisafe/github/repo/pages;  # NOTE! The path MUST end with '/pages'.

        location ~ /.well-known {
            allow all;  # This is for LetsEncrypt
        }
    }

    # Close vi by pressing ESC + :q! + ENTER.
    ```

    1. Create a [symbolic link](https://kb.iu.edu/d/abbe) to stage the config you just edited.
        - `sudo ln -s /etc/nginx/sites-available/subdomain.domain.com /etc/nginx/sites-enabled/`
    1. Make sure your configuration is correct with: `sudo nginx -t`
        - If all goes well, you can restart NGINX with `sudo systemctl restart nginx`
        - If not, make sure you've spelt everything *exactly* and aren't missing any semicolons.

1. Obtain your certificate (If you already have a certificate you can skip to step 3).
    1. Install LetsEncrypt
        - `sudo apt update && sudo apt install letsencrypt -y`
    1. Create the certificates with the following command:
        - `sudo letsencrypt certonly -a webroot --webroot-path=/path/to/lolisafe/github/repo/pages -d subdomain.domain.com`
    1. Now you should get a prompt such as this

        ![letsencrypt prompt](https://safe.kayo.moe/esK6WQKq.png)

        - **_NOTE:_** If you have alread used this letsencypt service, then you will not get any prompts, and the service will use the email you used last time.
    1. Read and agree to the Terms of Service

        ![letsencrypt TOS](https://safe.kayo.moe/58k2iq5Y.png)

    1. You should get thrown back to your terminal with the following output:

        ```code
        Output:
        IMPORTANT NOTES:
        - If you lose your account credentials, you can recover through
        e-mails sent to you@example.com
        - Congratulations! Your certificate and chain have been saved at
        /etc/letsencrypt/live/subdomain.domain.com/fullchain.pem. Your
        cert will expire on 2016-03-15. To obtain a new version of the
        certificate in the future, simply run Let's Encrypt again.
        - Your account credentials have been saved in your Let's Encrypt
        configuration directory at /etc/letsencrypt. You should make a
        secure backup of this folder now. This configuration directory will
        also contain certificates and private keys obtained by Let's
        Encrypt so making regular backups of this folder is ideal.
        - If like Let's Encrypt, please consider supporting our work by:

        Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
        Donating to EFF:                    https://eff.org/donate-le
        ```

1. Now we go back and make some edits to the NGINX configuation from a few steps ago `sudo vi /etc/nginx/sites-available/subdomain.domain.com`
    ```nginx
    # HTTP server.
    server {
        listen  subdomain.domain.com:80;        # Listen to IPv4 traffic on port 80.

        server_name subdomain.domain.com;       # The domain you set in your lolisafe config.js file.

        location ~ /.well-known {
            allow all;  # This is for LetsEncrypt.
        }

        return  301 https://$server_name$request_uri;   # This forces SSL by redirecting the user to the HTTPS version of your domain.
    }

    # HTTPS Server.
    server {
        listen  subdomain.domain.com:443 ssl;        # Listen to IPv4 traffic on port 443 (SSL).

        server_name subdomain.domain.com;                                                   # The domain you set in your lolisafe config.js file.
        ssl_certificate         /etc/letsencrypt/live/subdomain.domain.com/fullchain.pem;   # If you did not use LetsEncrypt, this is the full path to your cert/fullchain pem.
        ssl_certificate_key     /etc/letsencrypt/live/subdomain.domain.com/privkey.pem;     # If you did not use LetsEncrypt, this is the full path to your private key.
        ssl_trusted_certificate /etc/letsencrypt/live/subdomain.domain.com/fullchain.pem;   # If you did not use LetsEncrypt, this is the full path to your fullchain pem.

        root    /path/to/local/lolisafe/github/repo/pages;                                  # NOTE! The path MUST end with '/pages'.

        index   home.html;              # This is the file to be sent to the requested user when they go to your domain (You shouldn't need to change this).

        client_max_body_size    512M;   # This must be grater than, or equal to the max upload size you set in the lolisafe configuration.

        location / {
            proxy_pass  https://subdomain.domain.com:9999;  # This is the domain and port number you set in the lolisafe config.js file.

            # These pass all relevant information to lolisafe.
            proxy_set_header    Host                $host;
            proxy_set_header    X-Real-IP           $remote_addr;
            proxy_set_header    X-Forwarded-For     $proxy_addr_x_forward_for;
            proxy_set_header    X-Forwarded-Proto   $scheme;
        }
    }

    # Close vi by pressing ESC + :q! + ENTER.
    ```

1. Make sure your configuration is correct with: `sudo nginx -t`.  If all goes well, you can restart NGINX with: `sudo systemctl restart nginx`. If not, make sure you've spelt everything *exactly* and aren't missing any semicolons.

1. Now you're all set to [start lolisafe](#running)!

## Author

**loli-safe** © [Pitu](https://github.com/Pitu), Released under the [MIT](https://github.com/WeebDev/loli-safe/blob/master/LICENSE) License.

Authored and maintained by Pitu.

> [lolisafe.moe](https://lolisafe.moe) · GitHub [@Pitu](https://github.com/Pitu) · Twitter [@kanaadeko](https://twitter.com/kanaadeko)

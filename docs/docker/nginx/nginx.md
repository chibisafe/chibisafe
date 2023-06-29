**Nginx**

To use chibisafe with Docker and a domain name of your choosing, you have two options for setting up SSL certificates: using `certbot --nginx` or `certbot certonly --webroot`. You can choose the method that best suits your needs.

1. Copy the `docker-compose.yml file` to the project's root directory.
2. Duplicate the `chibisafe.moe.example.conf` file and rename it to `chibisafe.moe.conf` within the same directory.
3. Open the `chibisafe.moe.conf` file and replace the servername directive with your chosen domain.
4. Remove any existing SSL-related configurations in the `chibisafe.moe.conf` file since Certbot will handle SSL setup.
5. Ensure that the DNS records for your domain correctly point to the server where Chibisafe is hosted.
6. Install Certbot on your server by following the official Certbot installation instructions specific to your operating system.
7. Once Certbot is installed, you have two options:

   Option 1: Using `certbot --nginx`

   Run the following command to obtain and install SSL certificates:
   ```
   certbot --nginx
   ```
   Certbot will automatically apply the certificates to your Nginx configuration.

   Option 2: Using `certbot certonly --webroot`

   Run the following command to obtain and install SSL certificates:
   ```
   certbot certonly --webroot -w /path/to/chibisafe/root -d your-domain.com
   ```
   Replace `/path/to/chibisafe/root` with the actual path to the Chibisafe root directory and `your-domain.com` with your chosen domain.
   
8. Certbot will validate your domain ownership by creating a temporary file under `your-domain.com/.well-known/acme-challenge`. Ensure that your Nginx configuration allows access to this directory.
9. Upon successful validation, Certbot will save the obtained certificates in the default Certbot directory (typically `/etc/letsencrypt/live/your-domain.com/`).
10. Modify the docker-compose.yml file to mount the SSL certificates into the Nginx container. Within the nginx service, update the volumes section as follows:
    ```
    /etc/letsencrypt/live/your-domain.com/fullchain.pem:/etc/nginx/ssl/cert.crt
    /etc/letsencrypt/live/your-domain.com/privkey.pem:/etc/nginx/ssl/cert.key
    ```
    Replace your-domain.com with your chosen domain.
11. Run `docker-compose up -d` from within the nginx folder, ensuring that Nginx is ready to use the SSL certificates obtained by Certbot.
12. Set up a cron job to automatically renew the SSL certificates. Run the following command to edit the crontab:
    ```
    crontab -e
    ```
    Add the following line to the crontab file to run the renewal command daily at a specified time (e.g., 2:30 am):
    ```
    30 2 * * * certbot renew --quiet
    ```
    Save and exit the crontab editor and you should be ready to go. Certbot will now attempt to automatically renew your SSL certificates as needed.

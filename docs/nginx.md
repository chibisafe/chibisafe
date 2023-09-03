Some things to keep in mind when using nginx or any reverse proxy when behind cloudflare or any other proxy:
It's important to forward headers correctly since otherwise uploaders can spoof their own IP making it impossible for you to ban them if you have public uploads enabled.
To do so please refer to this document https://www.authelia.com/integration/proxies/fowarded-headers/#steps

After you're done, add the following rules to your nginx config:
```nginx
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 131.0.72.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 2400:cb00::/32;
set_real_ip_from 2606:4700::/32;
set_real_ip_from 2803:f800::/32;
set_real_ip_from 2405:b500::/32;
set_real_ip_from 2405:8100::/32;
set_real_ip_from 2c0f:f248::/32;
set_real_ip_from 2a06:98c0::/29;
real_ip_header CF-Connecting-IP;
```

Additionally, if you want you can run the following script to deny incoming requests on port 80 and 443 if the connection is not coming from a CloudFlare IP
```bash
for i in `curl https://www.cloudflare.com/ips-v4`; do iptables -I INPUT -p tcp -s $i --dport http -j ACCEPT; done
for i in `curl https://www.cloudflare.com/ips-v4`; do iptables -I INPUT -p tcp -s $i --dport https -j ACCEPT; done
```

export const BUILD_NGINX_DEFAULT = (serviceName: string) => {
  return `upstream ${serviceName} {
        server 127.0.0.1:8000;
    }
    server {
        listen       80;
        server_name  localhost;

        error_log /opt/esper/run/${serviceName}/logs/nginx_error_log;
        access_log off;
        location / {
            # Timeout for transmitting a response to client. If the client does not
            # receive any response within this time, connection is closed
            send_timeout                20;
            # Timeout for establishing connection with the proxied server
            proxy_connect_timeout       60s;
            # Timeout for transmitting a request to the proxied server.
            # If the proxied server does not receive anything within this time, the connection is closed.
            proxy_send_timeout          15s;
            # Timeout for reading a response from proxied server.
            # If the proxied server does not transmit anything within this time, the connection is closed
            proxy_read_timeout          20s;
            proxy_set_header        Upgrade $http_upgrade;
            proxy_set_header        Connection 'upgrade';
            proxy_cache_bypass      $http_upgrade;
            proxy_set_header        Host $host;
            proxy_set_header        X-Real-IP $remote_addr;
            proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header        X-Forwarded-Proto $scheme;
            proxy_pass              http://${serviceName};
            # Required for new HTTP-based CLI
            proxy_http_version 1.1;
            proxy_request_buffering off;
            proxy_buffering off; # Required for HTTP-based CLI to work over SSL
        }
        # redirect server error pages to the static page /50x.html
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
    `;
};

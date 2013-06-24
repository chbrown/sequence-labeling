# Sequence Labeling UI

The demo uses a MongoDB backend for the database.

* Database: "sequence-labeling"
* Collections: "textDocuments"

Highlights and annotation UI are all client-side, in [site.js](static/site.js).

## Deployment

Install locally:

    cd /www
    git clone git://github.com/chbrown/sequence-labeling.git

By default, the server listens on port 4505.

    cd sequence-labeling
    node index.js

And then you should configure [nginx](http://nginx.org/) like so:

    server {
      listen 4504;
      server_name localhost;

      location /static {
        root /www/sequence-labeling;
      }
      location / {
        proxy_pass http://127.0.0.1:4505;
      }
    }

## License

Copyright © 2011–2013 Christopher Brown. [MIT Licensed](LICENSE).

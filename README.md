# A content crowdfunding platform
This is the application code for a content publishing platform with crowdfunding and paywall features.

See a live version at [uncomma.com](uncomma.com)

### Warning
MVP quality code (there are no tests lol).

### Technical Stuff
- The application is built on Rails and the dev environment is Dockerized.
- Background jobs are run on Sidekiq.
- The database is Postgres.
- The front end is a mix of server rendered HTML (with HAML) and React + Typescript.
- The payment processor is Stripe.
- The rich text editor is Draft.js
- The admin is build with Active Admin

FROM ruby:2.7
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -y nodejs yarn postgresql-client dnsutils curl

RUN mkdir /uncomma
WORKDIR /uncomma

COPY Gemfile /uncomma/Gemfile
COPY Gemfile.lock /uncomma/Gemfile.lock
RUN bundle install

COPY package.json /uncomma/package.json
COPY yarn.lock /uncomma/yarn.lock
RUN yarn install --check-files

COPY . /uncomma

# https://github.com/rails/rails/issues/32947
RUN SECRET_KEY_BASE=1 RAILS_ENV=production ./bin/rails assets:precompile

# Add a script to be executed every time the container starts.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Start the main process.
ENV RUBYOPT '-W:no-deprecated -W:no-experimental'
CMD ["./bin/rails", "server", "-b", "0.0.0.0"]
